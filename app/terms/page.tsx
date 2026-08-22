import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold tracking-tight text-xl">
            viralme<span className="text-brand-500">.</span>lol
          </Link>
          <Link href="/" className="text-sm font-semibold text-gray-500 hover:text-gray-900">
            &larr; Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Terms of Service</h1>
        <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using viralme.lol (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Service Description</h2>
          <p>
            viralme.lol is a public leaderboard where users can pay a bid amount to display a link, title, and description related to an AI Product or AI Agent. Rank on the leaderboard is determined purely by the bid amount relative to other bids.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Non-Refundable Policy</h2>
          <p>
            <strong>All transactions on viralme.lol are final and non-refundable.</strong> 
            By completing a purchase, you acknowledge that you are paying for the immediate placement of your link on the leaderboard. We offer no guarantees regarding traffic, clicks, impressions, or specific outcomes resulting from your placement.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Content Guidelines & Moderation</h2>
          <p>
            The Service is strictly for <strong>AI Products and AI Agents</strong>. You agree not to submit links that:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Are completely unrelated to Artificial Intelligence or AI-driven products.</li>
            <li>Are direct chat invitation links (e.g., Telegram, WhatsApp, Messenger, Signal).</li>
            <li>Contain adult, NSFW, pornographic, or sexually explicit content.</li>
            <li>Promote illegal activities, scams, hate speech, or malicious software.</li>
          </ul>
          <p className="mt-4">
            <strong>Enforcement:</strong> We reserve the right to review, modify, or permanently delete any submission that violates these guidelines at our sole discretion. <strong>If your submission is deleted for violating these rules, you will NOT receive a refund.</strong>
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Hostile Takeovers & Ranking Mechanics</h2>
          <p>
            Your rank on the leaderboard is determined by market dynamics. Your placement is not permanent and will move down as higher bids are placed by other users. 
          </p>
          <p>
            The &quot;Hostile Takeover&quot; feature allows a user to pay a premium fee to instantly replace the current #1 ranked link. If your link is at the #1 spot and is subjected to a Hostile Takeover, you will lose the #1 spot immediately. You accept this as a core mechanic of the game and acknowledge that no refunds will be issued if your spot is taken over or outbid.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Limitation of Liability</h2>
          <p>
            viralme.lol and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the Service or any content submitted by users.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Disclaimer of Warranties</h2>
          <p>
            The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. We make no representations or warranties of any kind, express or implied, regarding the operation of the Service, the accuracy of the information, or the permanence of your leaderboard placement.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">8. Contact Information</h2>
          <p>
            For any questions regarding these Terms of Service, please reach out to us on Twitter/𝕏: <a href="https://x.com/viralmelol" target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline">@viralmelol</a>.
          </p>
        </div>
      </main>
    </div>
  );
}
