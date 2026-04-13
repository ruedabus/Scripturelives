import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Scripture Lives",
  description: "Privacy Policy for Scripture Lives — how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="text-sm text-amber-600 hover:text-amber-700 transition">
            ← Back to Scripture Lives
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: April 13, 2026</p>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">

          {/* Introduction */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Introduction</h2>
            <p>
              Welcome to Scripture Lives (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). We operate the website{" "}
              <a href="https://scripturelives.com" className="text-amber-600 hover:underline">scripturelives.com</a>{" "}
              (the &ldquo;Site&rdquo;). This Privacy Policy explains how we collect, use, disclose, and safeguard
              your information when you visit our Site. Please read this policy carefully. If you disagree
              with its terms, please discontinue use of the Site.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Information We Collect</h2>
            <h3 className="text-base font-semibold text-gray-800 mb-2">Information You Provide</h3>
            <p className="mb-4">
              We do not require you to create an account to use Scripture Lives. If you contact us via
              email at{" "}
              <a href="mailto:info@scripturelives.com" className="text-amber-600 hover:underline">
                info@scripturelives.com
              </a>
              , we may retain your name and email address to respond to your inquiry.
            </p>
            <h3 className="text-base font-semibold text-gray-800 mb-2">Automatically Collected Information</h3>
            <p>
              When you visit our Site, certain information may be collected automatically, including your
              IP address, browser type, operating system, referring URLs, pages visited, and the date and
              time of your visit. This information is used to analyze trends, administer the site, and
              improve user experience.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Cookies and Tracking Technologies</h2>
            <p className="mb-4">
              We use cookies and similar tracking technologies to enhance your experience on our Site.
              Cookies are small data files stored on your device. We use them to:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-600">
              <li>Remember your reading position and bookmarks (stored locally on your device)</li>
              <li>Analyze site traffic and usage via analytics services</li>
              <li>Display relevant advertisements through Google AdSense</li>
            </ul>
            <p className="mt-4">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              However, some features of the Site may not function properly without cookies.
            </p>
          </section>

          {/* Google AdSense */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Advertising — Google AdSense</h2>
            <p className="mb-4">
              We use Google AdSense to display advertisements on our Site. Google AdSense uses cookies
              to serve ads based on your prior visits to our Site and other websites. Google&apos;s use
              of advertising cookies enables it and its partners to serve ads based on your visit to our
              Site and/or other sites on the Internet.
            </p>
            <p className="mb-4">
              You may opt out of personalized advertising by visiting{" "}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
                Google Ads Settings
              </a>
              . You can also opt out via the{" "}
              <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
                Network Advertising Initiative opt-out page
              </a>
              .
            </p>
            <p>
              For more information on how Google uses data from sites that use its services, please visit{" "}
              <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
                How Google uses information from sites or apps that use our services
              </a>
              .
            </p>
          </section>

          {/* Third Party APIs */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Third-Party Services</h2>
            <p className="mb-4">We use the following third-party services which may collect data independently:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>
                <span className="font-medium text-gray-800">api.bible</span> — Used to serve Bible translations
                (NIV, NLT, AMP). Subject to the{" "}
                <a href="https://scripture.api.bible/terms" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
                  api.bible Terms of Service
                </a>.
              </li>
              <li>
                <span className="font-medium text-gray-800">Wikipedia / Wikimedia</span> — Used to display
                visual references and location imagery. Subject to{" "}
                <a href="https://wikimediafoundation.org/wiki/Privacy_policy" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
                  Wikimedia&apos;s Privacy Policy
                </a>.
              </li>
              <li>
                <span className="font-medium text-gray-800">PayPal</span> — Used to process donations.
                Subject to{" "}
                <a href="https://www.paypal.com/us/webapps/mpp/ua/privacy-full" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
                  PayPal&apos;s Privacy Policy
                </a>.
              </li>
              <li>
                <span className="font-medium text-gray-800">YouTube</span> — Links to our Faith Tails channel.
                Subject to{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
                  Google&apos;s Privacy Policy
                </a>.
              </li>
            </ul>
          </section>

          {/* Local Storage */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Local Storage</h2>
            <p>
              Scripture Lives stores certain data directly on your device using your browser&apos;s local
              storage. This includes your reading position, bookmarked chapters, reading plan entries, and
              study session notes. This data never leaves your device and is not transmitted to our servers.
            </p>
          </section>

          {/* Children */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Children&apos;s Privacy</h2>
            <p>
              Our Site is not directed to children under the age of 13. We do not knowingly collect
              personal information from children under 13. If you believe a child has provided us with
              personal information, please contact us and we will promptly delete it.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by
              updating the &ldquo;Last updated&rdquo; date at the top of this page. Your continued use of
              the Site after any changes constitutes your acceptance of the new policy.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h2>
            <p>
              If you have questions or concerns about this Privacy Policy, please contact us at:
            </p>
            <div className="mt-3 rounded-xl border border-gray-200 bg-white px-5 py-4 text-sm">
              <p className="font-semibold text-gray-900">Scripture Lives</p>
              <p className="mt-1">
                <a href="mailto:info@scripturelives.com" className="text-amber-600 hover:underline">
                  info@scripturelives.com
                </a>
              </p>
              <p>
                <a href="https://scripturelives.com" className="text-amber-600 hover:underline">
                  scripturelives.com
                </a>
              </p>
            </div>
          </section>

        </div>

        {/* Footer nav */}
        <div className="mt-12 border-t border-gray-200 pt-6 flex gap-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-gray-600 transition">Home</Link>
          <Link href="/about" className="hover:text-gray-600 transition">About</Link>
          <Link href="/terms" className="hover:text-gray-600 transition">Terms &amp; Conditions</Link>
          <Link href="/donate" className="hover:text-gray-600 transition">Donate</Link>
        </div>

      </div>
    </main>
  );
}
