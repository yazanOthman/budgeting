"use server";

import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from "plaid";
import { plaidClient } from "../plaid";
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const { account } = await createAdminClient();

    const response = await account.createEmailPasswordSession(email, password);
    cookies().set("appwrite-session", response.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    return parseStringify(response);
  } catch (error) {
    console.log("error", error);
  }
};

export const signUp = async ({ password, ...userData }: SignUpParams) => {
  const { email, firstName, lastName } = userData;
  let newUserAccount;
  try {
    const { account, database } = await createAdminClient();

    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );

    if (!newUserAccount) throw new Error("Error creating user");

    const dwollaCustomerUrl = await createDwollaCustomer({
      ...userData,
      type: "personal",
    });

    if (!dwollaCustomerUrl) throw new Error("Error creating dwolla customer");

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);
    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id,
        dwollaCustomerId,
        dwollaCustomerUrl,
      }
    );
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    return parseStringify(newUser);
  } catch (error) {
    console.log("error", error);
  }
};

export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();
    cookies().delete("appwrite-session");
    await account.deleteSession("current");
  } catch (error) {
    return null;
  }
};

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();
    return parseStringify(user);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const createLinkToken = async (user: User) => {
  try {
    const tokenParam = {
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
      user: {
        client_user_id: user.$id,
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ["auth"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };
    const response = await plaidClient.linkTokenCreate(tokenParam);
    return parseStringify({ linkToken: response.data.link_token });
  } catch (error) {
    console.log("failed to create link token", error);
  }
};

export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  sharableId,
}: createBankAccountProps) => {
  try {
    // create bank as document in our appwrite
    const { database } = await createAdminClient();

    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),
      { userId, bankId, accountId, accessToken, fundingSourceUrl, sharableId }
    );
    return parseStringify(bankAccount);
  } catch (error) {
    console.log(error);
  }
};

export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    const { accessToken, itemId } = await exchangeToken(publicToken);
    const accountData = await getAccountData(accessToken);

    const processorToken = await createProcessorToken(
      accessToken,
      accountData.account_id
    );

    const fundingSourceUrl = await setupFundingSourceUrl({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });
    if (!fundingSourceUrl) throw Error;

    // create bank accouting using the userId, itemId, accountId, accessToken, funding source url, and sharable id

    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      sharableId: encryptId(accountData.account_id),
    });
    //revalidate the path to reflect the changes
    revalidatePath("/");

    // return a success message
    return parseStringify({
      publicTokenExhnage: "complete",
    });
  } catch (error) {
    console.log(error);
  }
};

const exchangeToken = async (publicToken: string) => {
  // exchange public token for access token and item ID
  const response = await plaidClient.itemPublicTokenExchange({
    public_token: publicToken,
  });
  const accessToken = response.data.access_token;
  const itemId = response.data.item_id;
  return { accessToken, itemId };
};

const getAccountData = async (accessToken: string) => {
  const accountResponse = await plaidClient.accountsGet({
    access_token: accessToken,
  });
  return accountResponse.data.accounts[0];
};

const createProcessorToken = async (accessToken: string, accountId: string) => {
  // create a processor token for dwolla using the access token and account id
  const request: ProcessorTokenCreateRequest = {
    access_token: accessToken,
    account_id: accountId,
    processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum, // payment processor to process our money
  };
  const processorTokenResponse = await plaidClient.processorTokenCreate(
    request
  );
  return processorTokenResponse.data.processor_token;
};

const setupFundingSourceUrl = async ({
  dwollaCustomerId,
  processorToken,
  bankName,
}: {
  dwollaCustomerId: string;
  processorToken: string;
  bankName: string;
}) => {
  // create a funding source url for the account using the dwolla customer id, processor token, and bank name
  // connecting payment functionality with a specific bank account
  return await addFundingSource({ dwollaCustomerId, processorToken, bankName });
};
