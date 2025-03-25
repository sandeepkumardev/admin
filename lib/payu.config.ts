// @ts-ignore
import PayU from "payu-websdk";
import crypto from "crypto";
const key = process.env.PAYU_MERCHANT_KEY;
const salt = process.env.PAYU_MERCHANT_SALT;

export const payuClient = new PayU(
  {
    key,
    salt,
  },
  process.env.PAYU_MODE
);

// change as per product id or order id

export const CreateTransaction = async ({
  email,
  firstname,
  mobile,
  amount,
  productinfo,
  orderNo,
  udf1 = "",
  udf2 = "",
  udf3 = "",
  udf4 = "",
  udf5 = "",
}: {
  email: string;
  firstname: string;
  mobile: string;
  amount: number;
  productinfo: string;
  orderNo: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
}) => {
  const txnid = "PAYU_" + Date.now() + "_" + orderNo;

  // Prepare the string to hash
  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;

  // Calculate the hash
  const hash = crypto.createHash("sha512").update(hashString).digest("hex");

  const url = process.env.NODE_ENV === "development" ? "http://localhost:3010" : "https://admin.silkyester.com";

  const data = await payuClient.paymentInitiate({
    isAmountFilledByCustomer: false,
    amount: amount,
    currency: "INR",
    firstname: firstname,
    email: email,
    phone: mobile,
    txnid: txnid,
    productinfo: productinfo, // Passing productinfo as a string
    surl: `${url}/api/user/payment/payu/response?txnid=${txnid}`,
    furl: `${url}/api/user/payment/payu/response?txnid=${txnid}`,
    hash: hash,
  });

  return data;
};
