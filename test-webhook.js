const { Webhook } = require("standardwebhooks");

const secret = "whsec_5gMBsmksK7bPpR8RzwABtdOKBVB5BncOqho4qkRygn0=";
const payload = {
  action: "payment.succeeded",
  data: {
    id: "pay_123",
    metadata: {
      type: "bid",
      identity: "https://example.com",
      amount: "20"
    }
  }
};
const wh = new Webhook(secret);
const signatureHeaders = wh.sign(JSON.stringify(payload));

async function run() {
  try {
    const res = await fetch("http://localhost:3000/api/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...signatureHeaders
      },
      body: JSON.stringify(payload)
    });
    console.log(res.status);
    console.log(await res.json());
  } catch(e) {
    console.error(e);
  }
}
run();
