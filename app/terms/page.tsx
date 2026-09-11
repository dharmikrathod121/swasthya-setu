import Link from "next/link";

export const metadata = {
  title: "Terms of Service — Swasthya Setu",
  description:
    "Terms of service for Swasthya Setu, the national healthcare platform by the Ministry of Health & Family Welfare, Govt. of India.",
};

export default function TermsPage() {
  return (
    <div className="container section" style={{ paddingTop: "var(--space-8)", maxWidth: 800 }}>
      <div className="section-header reveal">
        <div className="section-eyebrow">Legal</div>
        <h1>Terms of Service</h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Last updated: September 2026
        </p>
      </div>

      <div className="flex flex-col gap-8 mt-8">
        {[
          {
            title: "1. Acceptance of Terms",
            body: "By accessing or using the Swasthya Setu platform (&ldquo;Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. The Service is operated by the Ministry of Health & Family Welfare, Government of India.",
          },
          {
            title: "2. Description of Service",
            body: "Swasthya Setu provides a digital health platform including hospital and doctor search, appointment booking, AI health tools, telemedicine consultations, voice triage, medicine catalog, and related services. The Service is intended for informational purposes and does not replace professional medical advice.",
          },
          {
            title: "3. User Accounts",
            body: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account. You must be at least 13 years of age to create an account.",
          },
          {
            title: "4. Medical Disclaimer",
            body: "The Service provides AI-assisted health information for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions you may have regarding a medical condition. Never disregard professional medical advice because of something you have read on the platform.",
          },
          {
            title: "5. AI Tools Disclaimer",
            body: "AI-powered features including the voice triage, food analyzer, medicine identifier, and report analyzers are provided as demonstration tools. Results may not be accurate and should not be used as the sole basis for medical decisions. Always consult a licensed medical professional.",
          },
          {
            title: "6. User Conduct",
            body: "You agree not to: (a) use the Service for any unlawful purpose; (b) attempt to gain unauthorized access to any portion of the Service; (c) interfere with or disrupt the integrity or performance of the Service; (d) upload or transmit malicious code or harmful content; (e) impersonate any person or entity.",
          },
          {
            title: "7. Intellectual Property",
            body: "All content, features, and functionality of the Service, including but not limited to text, graphics, logos, icons, images, audio clips, and software, are the exclusive property of the Ministry of Health & Family Welfare, Govt. of India, and are protected by Indian and international copyright, trademark, and other intellectual property laws.",
          },
          {
            title: "8. Limitation of Liability",
            body: "To the maximum extent permitted by law, the Ministry of Health & Family Welfare shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses resulting from your use of the Service.",
          },
          {
            title: "9. Termination",
            body: "We reserve the right to suspend or terminate your access to the Service at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.",
          },
          {
            title: "10. Governing Law",
            body: "These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.",
          },
          {
            title: "11. Contact Information",
            body: "For questions about these Terms of Service, please contact us at legal@swasthyasetu.gov.in or write to: Swasthya Setu Support, Ministry of Health & Family Welfare, Govt. of India, Nirman Bhawan, New Delhi - 110108.",
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
