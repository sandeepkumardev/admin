export const generateOTP = async () => {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

export const fast2SMS = async (otp: string, number: string) => {
  try {
    const data = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "post",
      headers: {
        authorization: process.env.FAST2SMS_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        variables_values: otp,
        route: "otp",
        numbers: number,
      }),
    }).then((res) => res.json());
    return data;
  } catch (error) {
    return null;
  }
};
