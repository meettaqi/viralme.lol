async function run() {
  try {
    const res = await fetch("http://localhost:3000/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "bid",
        identity: "https://example.com",
        amount: 20
      })
    });
    console.log(await res.json());
  } catch(e) {
    console.error(e);
  }
}
run();
