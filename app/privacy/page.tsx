import Link from "next/link";

export default function PrivacyPolicy() {
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
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
          <p>
            We collect information that you explicitly provide to us when placing a bid on viralme.lol. This includes the URL, product title, and description you submit to be displayed on the leaderboard. Payment processing information is collected securely by our third-party payment processor (Stripe) and is not stored directly on our servers.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Usage Analytics</h2>
          <p>
            We use analytics tools (such as Datafa.st) to measure website traffic and performance. This involves collecting non-personally identifiable information such as browser type, referring pages, and aggregate visitor counts. This data is used solely to display public statistics on the website and improve the user experience.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
          <p>
            The core purpose of viralme.lol is a public leaderboard. By submitting a link, title, or description, you understand and agree that this information will be publicly displayed on the website. We use your payment information solely to process the transaction for your bid or takeover.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Data Sharing and Disclosure</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may disclose your information only if required by law or to protect the rights, property, or safety of viralme.lol, our users, or others.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Third-Party Links</h2>
          <p>
            Our leaderboard consists entirely of links submitted by third parties. We are not responsible for the privacy practices or the content of these external websites. Clicking any link on the leaderboard is done at your own risk.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us via our official Twitter/𝕏 account: <a href="https://x.com/viralmelol" target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline">@viralmelol</a>.
          </p>
        </div>
      </main>
    </div>
  );
}
