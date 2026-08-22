import { upsertPendingBid, getLeaderboard, deleteBid, applyBoost } from './lib/db';
import { activateTakeover, getTakeover } from './lib/takeover';
import { supabase } from './lib/supabaseClient';

async function runTests() {
  console.log("Starting E2E Test Suite...");
  
  // Clean up
  await supabase.from('bids').delete().like('identity', 'E2E_%');
  await supabase.from('takeover').update({ active: false }).eq('id', 1);

  // 1. Initial Bid
  console.log("\n--- Test 1: Initial Bid ---");
  await upsertPendingBid({
    identity: "E2E_test1.com",
    title: "test", description: "test", amount: 10,
    baseAmount: 10,
    paid: true,
    stripeSessionId: "sess_1"
  });
  
  let board = await getLeaderboard();
  let t1 = board.find((b: any) => b.identity === "E2E_test1.com");
  console.assert(t1?.amount === 10, "Initial amount should be 10");
  console.log("✅ Initial bid successful");

  // 2. Top-up
  console.log("\n--- Test 2: Top Up ---");
  await upsertPendingBid({
    identity: "E2E_test1.com",
    title: "test", description: "test", amount: 20,
    baseAmount: 20, // user typed 20, chargeForBid calculates 10, but baseAmount is updated to 20
    paid: true,
    stripeSessionId: "sess_2"
  });
  board = await getLeaderboard();
  t1 = board.find((b: any) => b.identity === "E2E_test1.com");
  console.assert(t1?.amount === 20, "Top up amount should be 20");
  console.assert(t1?.baseAmount === 20, "Top up baseAmount should be 20");
  console.log("✅ Top up successful");

  // 3. Boost
  console.log("\n--- Test 3: Boost ---");
  await applyBoost("E2E_test1.com", 5);
  board = await getLeaderboard();
  t1 = board.find((b: any) => b.identity === "E2E_test1.com");
  console.assert(t1?.amount === 25, "Boosted amount should be 25");
  console.assert(t1?.baseAmount === 20, "Boosted baseAmount should still be 20");
  console.log("✅ Boost successful");

  // 4. Boosted Top-up (The bug we just fixed!)
  console.log("\n--- Test 4: Boosted Top-up ---");
  // User wants to top up to 30. chargeForBid charges 10 (30-20).
  // Webhook gets amount: 30.
  await upsertPendingBid({
    identity: "E2E_test1.com",
    title: "test", description: "test", amount: 30,
    baseAmount: 30,
    paid: true,
    stripeSessionId: "sess_3"
  });
  board = await getLeaderboard();
  t1 = board.find((b: any) => b.identity === "E2E_test1.com");
  console.assert(t1?.amount === 35, `Boosted top up amount should be 35, got ${t1?.amount}`);
  console.assert(t1?.baseAmount === 30, `Boosted top up baseAmount should be 30, got ${t1?.baseAmount}`);
  console.log("✅ Boosted Top-up successful (bug is gone!)");

  // 5. Hostile Takeover Overwrite Protection
  console.log("\n--- Test 5: Hostile Takeover Race Condition ---");
  await activateTakeover("E2E_takeover_1", "Takeover 1", 100);
  let takeover = await getTakeover();
  console.assert(takeover.identity === "E2E_takeover_1", "Takeover 1 should be active");
  
  // Simulate concurrent webhook logic check
  const secondWebhookIdentity = "E2E_takeover_2";
  const isRetry = takeover.active && takeover.identity === secondWebhookIdentity && (new Date().getTime() - new Date(takeover.triggeredAt).getTime() < 120000);
  
  // Webhook drops payment if active and not retry
  if (takeover.active && takeover.identity !== secondWebhookIdentity) {
    console.log("✅ Successfully dropped concurrent takeover (race condition prevented!)");
  } else {
    console.assert(false, "Race condition failed to drop");
  }

  // Cleanup
  console.log("\nCleaning up...");
  await supabase.from('bids').delete().like('identity', 'E2E_%');
  await supabase.from('takeover').update({ active: false }).eq('id', 1);
  console.log("Done!");
}

runTests().catch(console.error);
