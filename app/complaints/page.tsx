import Link from 'next/link'
import LegalDocument from '@/components/legal/LegalDocument'

const SUPPORT_EMAILS = [
  { region: 'Australia', email: 'aucustomercare@lotusfx.com' },
  { region: 'New Zealand', email: 'nzcustomercare@lotusfx.com' },
  { region: 'Fiji', email: 'fjcustomercare@lotusfx.com' },
] as const

export default function ComplaintsPage() {
  return (
    <LegalDocument
      title="Complaints"
      subtitle="If something isn’t right, we want to hear from you. This page explains how to raise a complaint with LotusFX and what happens next."
      lastUpdated="28 September 2026"
    >
      <section>
        <h2>How to make a complaint</h2>
        <p>You can contact us in any of these ways:</p>
        <ol>
          <li>
            Use our{' '}
            <Link href="/contact">contact form</Link> and select <strong>Complaint</strong> as the
            subject.
          </li>
          <li>Email the customer care team for your country (details below).</li>
          <li>Speak with a team member at your nearest LotusFX branch.</li>
        </ol>
      </section>

      <section>
        <h2>What to include</h2>
        <p>To help us investigate quickly, please provide:</p>
        <ul>
          <li>Your full name and best contact details</li>
          <li>Date, branch or channel involved (website, app, Quick Order, phone, or in store)</li>
          <li>Transaction, order or reference number if you have one</li>
          <li>A clear description of what happened and how you would like it resolved</li>
          <li>Any supporting documents or correspondence</li>
        </ul>
      </section>

      <section>
        <h2>What happens next</h2>
        <p>When we receive your complaint, we will:</p>
        <ol>
          <li>Acknowledge your complaint within 1–2 working days</li>
          <li>Gather and evaluate information about your complaint</li>
          <li>Respond to you within 20 working days where possible</li>
          <li>In some cases, take up to 40 working days to fully resolve the matter</li>
        </ol>
        <p>
          We investigate fairly and keep you updated where needed. We confirm the outcome and any
          next steps in writing where appropriate. If we need more time, we will let you know.
        </p>
      </section>

      <section>
        <h2>Customer care contacts</h2>
        <div className="mt-2 space-y-3">
          <ul className="space-y-3 list-none pl-0">
            {SUPPORT_EMAILS.map(({ region, email }) => (
              <li key={region} className="list-none">
                <span className="font-semibold text-gray-900">{region}:</span>{' '}
                <a
                  href={`mailto:${email}?subject=Complaint%20%E2%80%94%20LotusFX`}
                  className="text-primary-700 font-semibold hover:text-primary-900"
                >
                  {email}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-gray-600">
            You can also visit a <Link href="/locations">LotusFX branch</Link>.
          </p>
        </div>
      </section>
    </LegalDocument>
  )
}
