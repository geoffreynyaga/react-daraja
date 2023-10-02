import "./index.css";
import axios from "axios";
import {
  AccountBalanceBody,
  AccountBalanceResponse,
  B2CRequestBody,
  B2CRequestResponse,
  BusinessRequestBody,
  BusinessRequestResponse,
  InitializeAppResponse,
  InitOptions,
  RegisterUrlBody,
  RegisterUrlResponse,
  ReverseC2BTransactionBody,
  ReverseC2BTransactionResponse,
  ScannableQrCodeResponse,
  ScannableQrParams,
  StateOfALNMOnlinePaymentBody,
  StateOfALNMOnlinePaymentResponse,
  STKPushBody,
  STKPushResponse,
  TaxRemittanceBody,
  TaxRemittanceResponse,
  TransactionStatusBody,
  TransactionStatusResponse,
} from "./types";
import { useReactDaraja } from "./hooks/useReactDaraja";
import { generatePassword, generateTimestamp } from "./util/utils";

export const initializeApp = async (
  initOptions: InitOptions
): Promise<InitializeAppResponse> => {
  const { consumerKey, consumerSecret } = initOptions;
  const credentials = `${consumerKey}:${consumerSecret}`;
  const encodedCredentials = btoa(credentials);

  try {
    const res = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Bearer ${encodedCredentials}`,
        },
      }
    );
    return res.data;
  } catch (err: any) {
    throw new Error(
      `Error occurred with status code ${err.response?.status}, ${err.response?.statusText}`
    );
  }
};

export const getScannableQRCode = async (
  scannableQrParams: ScannableQrParams,
  accessToken: string
): Promise<ScannableQrCodeResponse> => {
  try {
    const res: ScannableQrCodeResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/qrcode/v1/generate",
      scannableQrParams,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res;
  } catch (err: any) {
    throw new Error(
      `Error occurred with status code ${err.response?.status}, ${err.response?.statusText}`
    );
  }
};

export const STKPush = async (
  body: Omit<
    STKPushBody,
    "BusinessShortCode" | "PartyB" | "Timestamp" | "Password"
  >
): Promise<STKPushResponse> => {
  try {
    const { accessToken, businessShortCode, mode } = useReactDaraja();
    if (!accessToken) {
      throw new Error("Access token is not available");
    }

    const timestamp = generateTimestamp();
    // TODO get passkey
    // const password = generatePassword(businessShortCode!, "", timestamp);
    const password =
      "PJfngGqxieuYDC2MyqjvLkEjSFSDgZlHUuGjKpjUfhVH00XgCYaLlUDEgCoBTMlzEBoirlBEVHcHzywhz/i7Jo+geGMAd+Fn4sCy+qCg5ZfnbyGYKEL72QjSIaTcFmRvmVVu+XN9iRY5x4OSkQgM+wmyrfycXArjwiTo2odVlP9PUnEsuCv/R3++MZEo1J6tFfKa+1KjTuoO3ils8CDVQQbfeR+bstByJ5F21H+8vtpZN1yjIqH6Bie9/Hxgy5XNXRdAPk6YSQ//qUFvi0eHkvlFwoXMPVhI5NTlOP2S6OyFCGhkOjZcUWukydq5IDGftL7/DeEdlAWU8xlmdXjDUg==";

    const stkPushBody: STKPushBody = {
      ...body,
      BusinessShortCode: businessShortCode!,
      PartyB: businessShortCode!,
      Timestamp: timestamp,
      Password: password,
    };

    const res: STKPushResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      stkPushBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return res;
  } catch (err: any) {
    throw new Error(
      `Error occurred with status code ${err.response?.status}, ${err.response?.statusText}`
    );
  }
};

/**
 * Use this API to check the status of a Lipa Na M-Pesa Online Payment.
 */
export const stateOfALNMOnlinePayment = async (
  stateOfALNMOnlinePaymentBody: StateOfALNMOnlinePaymentBody,
  accessToken: string
): Promise<StateOfALNMOnlinePaymentResponse> => {
  try {
    const res: StateOfALNMOnlinePaymentResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query",
      stateOfALNMOnlinePaymentBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return res;
  } catch (err: any) {
    throw new Error(
      `Error occurred with status code ${err.response?.status}, ${err.response?.statusText}`
    );
  }
};

export const C2BRegisterURL = async (
  registerUrlBody: RegisterUrlBody,
  accessToken: string
): Promise<RegisterUrlResponse> => {
  try {
    const res: RegisterUrlResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl",
      registerUrlBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return res;
  } catch (err: any) {
    throw new Error(
      `Error occurred with status code ${err.response?.status}, ${err.response?.statusText}`
    );
  }
};

export const businessToCustomer = async (
  b2CBody: B2CRequestBody,
  accessToken: string
): Promise<B2CRequestResponse> => {
  try {
    const res: B2CRequestResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest",
      b2CBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res;
  } catch (err: any) {
    throw new Error(
      `Error occurred with status code ${err.response?.status}, ${err.response?.statusText}`
    );
  }
};

export const getTransactionStatus = async (
  transactionStatusBody: TransactionStatusBody,
  accessToken: string
): Promise<TransactionStatusResponse> => {
  try {
    const res: TransactionStatusResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/transactionstatus/v1/query",
      transactionStatusBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res;
  } catch (err: any) {
    throw new Error(
      `Error occurred with status code ${err.response?.status}, ${err.response?.statusText}`
    );
  }
};

export const getAccountBalance = async (
  accountBalance: AccountBalanceBody,
  accessToken: string
): Promise<AccountBalanceResponse> => {
  try {
    const res: AccountBalanceResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/accountbalance/v1/query",
      accountBalance,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res;
  } catch (err: any) {
    throw new Error(
      `Error occurred with status code ${err.response?.status}, ${err.response?.statusText}`
    );
  }
};

export const reverseC2BTransaction = async (
  body: ReverseC2BTransactionBody,
  accessToken: string
): Promise<ReverseC2BTransactionResponse> => {
  try {
    const res: ReverseC2BTransactionResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/reversal/v1/request",
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res;
  } catch (err: any) {
    throw new Error(
      `Error occurred with status code ${err.response?.status}, ${err.response?.statusText}`
    );
  }
};

export const remitTax = async (
  body: TaxRemittanceBody,
  accessToken: string
): Promise<TaxRemittanceResponse> => {
  try {
    const res: TaxRemittanceResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/b2b/v1/remittax",
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res;
  } catch (err: any) {
    throw new Error(
      `Error occurred with status code ${err.response?.status}, ${err.response?.statusText}`
    );
  }
};

export const businessPaybill = async (
  body: BusinessRequestBody,
  accessToken: string
): Promise<BusinessRequestResponse> => {
  try {
    const res: BusinessRequestResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/b2b/v1/paymentrequest",
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res;
  } catch (err: any) {
    throw new Error(
      `Error occurred with status code ${err.response?.status}, ${err.response?.statusText}`
    );
  }
};

export const businessBuyGoods = async (
  body: BusinessRequestBody,
  accessToken: string
) => {
  try {
    const res: BusinessRequestResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/b2b/v1/paymentrequest",
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res;
  } catch (err: any) {
    throw new Error(
      `Error occurred with status code ${err.response?.status}, ${err.response?.statusText}`
    );
  }
};

export { ReactDarajaProvider } from "./hooks/useReactDaraja";