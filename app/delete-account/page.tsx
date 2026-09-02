import Link from 'next/link'
import LegalDocument from '@/components/legal/LegalDocument'

const SUPPORT_EMAILS = [
  { region: 'Australia', email: 'aucustomercare@lotusfx.com' },
  { region: 'New Zealand', email: 'nzcustomercare@lotusfx.com' },
  { region: 'Fiji', email: 'fjcustomercare@lotusfx.com' },
] as const

export default function DeleteAccountPage() {
  return (
    <LegalDocument
      title="Delete Your LotusFX Account"
      subtitle="This page explains how to request deletion of your LotusFX mobile app account and associated personal data held by Lotus Foreign Exchange (LotusFX)."
      lastUpdated="2 September 2026"
    >
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About this request</h2>
        <p>
          The <strong>LotusFX</strong> mobile app is operated by <strong>Lotus Foreign Exchange</strong>{' '}
          (also known as LotusFX). If you created an account using a username and password, you can
          request that your account and associated personal data be deleted using the steps below.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How to request account deletion</h2>
        <p className="mb-4">
          To delete your LotusFX app account, email our customer care team from the email address linked
          to your account. Include the following details:
        </p>
        <ol className="list-decimal pl-6 space-y-3">
          <li>
            Send an email to the customer care address for your country (see below).
          </li>
          <li>
            Use the subject line: <strong>Account deletion request — LotusFX app</strong>.
          </li>
          <li>
            Include your full name, registered username, registered email address, and mobile number (if
            applicable).
          </li>
          <li>
            State clearly that you want your LotusFX app account and associated personal data deleted.
          </li>
          <li>
            Our team will verify your identity and confirm when your request has been processed.
          </li>
        </ol>

        <div className="mt-6 rounded-2xl border border-primary-100 bg-white p-6 shadow-soft space-y-3">
          <h3 className="text-lg font-bold text-gray-900">Customer care email addresses</h3>
          <ul className="space-y-2">
            {SUPPORT_EMAILS.map(({ region, email }) => (
              <li key={region}>
                <span className="font-medium text-gray-900">{region}:</span>{' '}
                <a href={`mailto:${email}?subject=Account%20deletion%20request%20%E2%80%94%20LotusFX%20app`} className="text-primary-700 font-semibold hover:text-primary-900">
                  {email}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-600">
            You can also{' '}
            <Link href="/contact" className="text-primary-700 font-semibold hover:text-primary-900">
              contact us online
            </Link>{' '}
            or visit your nearest LotusFX branch.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What data will be deleted</h2>
        <p className="mb-4">When your deletion request is approved, we will delete or anonymise:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Your LotusFX app account login credentials (username and password)</li>
          <li>Profile information stored in the app (name, email, phone number, and contact details)</li>
          <li>Saved preferences and app settings linked to your account</li>
          <li>Marketing and communication preferences associated with your account</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What data may be kept</h2>
        <p className="mb-4">
          As a licensed financial services provider, LotusFX may be required to retain certain records
          even after your account is deleted. This can include:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Transaction records and transfer details (for regulatory and anti-money laundering compliance)</li>
          <li>Identity verification documents collected during onboarding or transactions</li>
          <li>Records needed to resolve disputes, fraud investigations, or legal claims</li>
          <li>Information we are legally required to keep under Australian, New Zealand, or Fijian law</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Retention period</h2>
        <p>
          Personal data that must be retained for legal or regulatory reasons is kept only for as long as
          required by applicable law — typically up to <strong>7 years</strong> for financial transaction
          records in Australia and New Zealand. After that period, retained data is securely deleted or
          permanently anonymised.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing time</h2>
        <p>
          We aim to process verified account deletion requests within <strong>30 days</strong>. You will
          receive email confirmation once your account has been deleted. If we need more information to
          verify your identity, we will contact you using the details on your account.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Related information</h2>
        <p>
          For more information about how we collect and use personal data, see our{' '}
          <Link href="/privacy" className="text-primary-700 font-semibold hover:text-primary-900">
            Privacy Policy
          </Link>
          .
        </p>
      </section>
    </LegalDocument>
  )
}
