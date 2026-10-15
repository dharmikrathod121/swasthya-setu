import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Swasthya Setu",
  description:
    "Privacy policy for Swasthya Setu, an independent health information platform.",
};

export default function PrivacyPage() {
  return (
    <div className="container section" style={{ paddingTop: "var(--space-8)", maxWidth: 800 }}>
      <div className="section-header reveal">
        <div className="section-eyebrow">Legal</div>
        <h1>Privacy Policy</h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Last updated: September 2026
        </p>
      </div>

      <div className="flex flex-col gap-8 mt-8">
        {[
          {
            title: "1. Information We Collect",
            body: "We collect information you provide directly to us, such as when you create an account, chat on WhatsApp, or use our AI health tools. This may include your name, contact information, health data, and payment details where applicable.",
          },
          {
            title: "2. How We Use Your Information",
            body: "Your health data is used solely to provide and improve our services, including connecting you with healthcare providers, powering AI-assisted diagnostics, and maintaining your digital health records. We do not sell your personal data to third parties.",
          },
          {
            title: "3. Data Security",
            body: "We implement industry-standard security measures including end-to-end encryption, role-based access control, and regular security audits to protect your personal health information. Access is restricted to authorized personnel only.",
          },
          {
            title: "4. Data Sharing & Consent",
            body: "Your health records are shared with healthcare providers only with your explicit consent, as required by law, or when necessary to provide emergency medical services. You maintain full control over who can access your data.",
          },
          {
            title: "5. Cookies & Tracking",
            body: "We use essential cookies to maintain your session and preferences. Analytics cookies are used only with your consent and help us improve the platform experience. You can manage cookie preferences at any time.",
          },
          {
            title: "6. Your Rights",
            body: "You have the right to access, correct, or delete your personal data at any time. You may also request a copy of all data we hold about you. For any privacy-related requests, contact our Data Protection Officer at privacy@swasthyasetu.gov.in.",
          },
          {
            title: "7. Children&apos;s Privacy",
            body: "Our services are not directed to individuals under the age of 13. If you become aware that a child has provided us with personal information, please contact us immediately.",
          },
          {
            title: "8. Changes to This Policy",
            body: "We may update this Privacy Policy from time to time. We will notify you of any material changes via email or through a prominent notice on our platform. Continued use of the service after changes constitutes acceptance of the updated policy.",
          },
          {
            title: "9. Contact Us",
            body: "If you have questions about this Privacy Policy, please contact us at support@swasthyasetu.in.",
          },
        ].map((section) => (
          <div key={section.title} className="card reveal">
            <div className="card-body">
              <h3 className="text-lg font-bold mb-2">{section.title}</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)" }}>
                {section.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
