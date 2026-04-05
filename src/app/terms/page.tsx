import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions — Scripture Lives",
  description: "Terms and conditions for using Scripture Lives.",
};

export default function TermsPage() {
  const lastUpdated = "April 2026";

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top nav */}
      <header className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Hand-painted cross_logo.png" alt="Scripture Lives" className="h-10 w-10 object-contain" />
          <span className="text-lg font-bold text-amber-400">Scripture Lives</span>
        </Link>
        <Link href="/" className="text-sm text-stone-300 hover:text-white transition">← Back to App</Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-14">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Terms &amp; Conditions</h1>
        <p className="text-sm text-stone-400 mb-10">Last updated: {lastUpdated}</p>

        <div className="prose prose-stone max-w-none space-y-8 text-stone-700 leading-8">

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Scripture Lives (&ldquo;the Site,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) at scripturelives.com, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use the Site. We reserve the right to update these terms at any time; continued use of the Site after changes are posted constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">2. Purpose of the Site</h2>
            <p>
              Scripture Lives is a free, non-denominational Bible study platform designed to help individuals explore, study, and share the Word of God. Our tools include passage reading, biblical maps, devotionals, study prompts, lexicons, and commentary resources. The Site is intended for personal, educational, and spiritual enrichment purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">3. Bible Content and Copyright</h2>
            <p>
              Scripture texts used on this Site are drawn from the King James Version (KJV), American Standard Version (ASV), and World English Bible (WEB), all of which are in the public domain. Commentary, devotional content, study notes, and original written material produced by Scripture Lives are the intellectual property of Scripture Lives and may not be reproduced, distributed, or sold without prior written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">4. User Conduct</h2>
            <p>
              You agree to use the Site only for lawful purposes and in a way that does not infringe the rights of others or restrict their use and enjoyment of the Site. You must not misuse the Site by introducing viruses or other malicious code, attempt to gain unauthorized access to any part of the Site, or use it in any way that is abusive, hateful, or contrary to the Christian values the Site seeks to reflect.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">5. Donations</h2>
            <p>
              Scripture Lives accepts voluntary financial donations to help cover operating costs including hosting, domain registration, and ongoing development. Donations are non-refundable and do not constitute a purchase of goods or services. We are grateful for every contribution and use funds solely to support and improve the platform. Scripture Lives is not currently a registered 501(c)(3) nonprofit organization, so donations are not tax-deductible unless otherwise noted.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">6. Disclaimer of Warranties</h2>
            <p>
              The Site is provided &ldquo;as is&rdquo; without any warranties of any kind, express or implied. We do not warrant that the Site will be uninterrupted, error-free, or free of viruses or other harmful components. While we strive for biblical accuracy and quality in all content, Scripture Lives does not guarantee that all information is complete, current, or free from error. Users should always verify important theological or doctrinal information with qualified pastoral or scholarly sources.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Scripture Lives and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of or inability to use the Site, even if we have been advised of the possibility of such damages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">8. Third-Party Links and Services</h2>
            <p>
              The Site may contain links to third-party websites including Wikipedia, external Bible resources, and social media platforms. These links are provided for convenience and do not constitute an endorsement by Scripture Lives. We are not responsible for the content, accuracy, or practices of any third-party sites.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">9. Privacy</h2>
            <p>
              We respect your privacy. Scripture Lives does not currently require user registration or collect personal data beyond what is stored locally in your browser (such as your reading position and bookmarks). We do not sell, share, or distribute any user data to third parties. If this changes in the future, we will update these terms and provide clear notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">10. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law provisions. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts located in the United States.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">11. Contact</h2>
            <p>
              If you have questions about these Terms and Conditions, please reach out to us at{" "}
              <a href="mailto:info@scripturelives.com" className="text-amber-600 hover:underline">
                info@scripturelives.com
              </a>
              . We are committed to transparency and will respond to any reasonable inquiry in good faith.
            </p>
          </section>

        </div>
      </main>

      <footer className="border-t border-stone-200 bg-white py-8 text-center text-sm text-stone-400">
        <p>&copy; {new Date().getFullYear()} Scripture Lives. All rights reserved.</p>
        <div className="mt-2 flex justify-center gap-6">
          <Link href="/about" className="hover:text-amber-600 transition">About Us</Link>
          <Link href="/terms" className="hover:text-amber-600 transition">Terms</Link>
          <Link href="/donate" className="hover:text-amber-600 transition">Donate</Link>
          <Link href="/" className="hover:text-amber-600 transition">App</Link>
        </div>
      </footer>
    </div>
  );
}
