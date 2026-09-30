import Link from 'next/link'
import LegalDocument from '@/components/legal/LegalDocument'

const SUPPORT_EMAILS = [
  { region: 'Australia', email: 'aucustomercare@lotusfx.com' },
  { region: 'New Zealand', email: 'nzcustomercare@lotusfx.com' },
  { region: 'Fiji', email: 'fjcustomercare@lotusfx.com' },
] as const

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      subtitle="How Lotus Foreign Exchange Limited (we, us, our) collects, uses, discloses and protects your personal information when you use our products, services, website, apps and branches."
      lastUpdated="28 September 2026"
    >
      <section>
        <h2>1. Introduction</h2>
        <p>
          This policy sets out how Lotus Foreign Exchange Limited (including our operations trading
          as LotusFX across Australia, New Zealand and Fiji) will collect, use, disclose and protect
          your personal information.
        </p>
        <p>
          This policy applies if you use any of our products or services or contact us (including
          online, social media, our mobile apps, over the phone, over email, in-store, or by any
          other means) or visit our website or social media pages — including Quick Order, online
          customer portals, and country-specific apps where available.
        </p>
        <p>
          This policy does not limit or exclude any of your rights under applicable privacy laws,
          including the Privacy Act 2020 (New Zealand) and equivalent laws in Australia and Fiji
          where they apply.
        </p>
      </section>

      <section>
        <h2>2. Changes to this policy</h2>
        <p>
          We may change this policy by uploading a revised policy onto the website. The change will
          apply from the date that we upload the revised policy. The “Last updated” date at the top
          of this page shows when it was last revised.
        </p>
      </section>

      <section>
        <h2>3. Who we collect your personal information from</h2>
        <p>We collect personal information about you from:</p>
        <ul>
          <li>
            you, when you provide that personal information to us, whether in person, over the
            phone, on our app, via our website and any related service (including Quick Order and
            customer login portals), through any registration or subscription process, through any
            contact with us (e.g. telephone call or email), or when you buy or use our services and
            products; and
          </li>
          <li>
            third parties where you have authorised this, you are a recipient of a money transfer, or
            the information is publicly available.
          </li>
        </ul>
        <p>If possible, we will collect personal information from you directly.</p>
      </section>

      <section>
        <h2>4. Types of information collected</h2>
        <p>We may need to collect the following information from you in order to process your transaction or order:</p>
        <ul>
          <li>Your name, date of birth, address and contact details</li>
          <li>Your identification documents and proof of address</li>
          <li>Your credit or debit card information</li>
          <li>Your bank account details</li>
          <li>If you are sending money, the recipient’s name, address and contact details</li>
          <li>Your transaction and order records and interactions with us</li>
          <li>Details regarding your transaction or Quick Order (currency, amount, branch, pickup or delivery preference)</li>
          <li>The information set out in our customer registration form</li>
          <li>Your location</li>
          <li>Your computer, device or network information</li>
          <li>Relevant security information if you set up an online or app account</li>
          <li>Any other information we may determine to be relevant</li>
          <li>Other information required by law</li>
        </ul>
      </section>

      <section>
        <h2>5. How we use your personal information</h2>
        <p>We will use your personal information:</p>
        <ul>
          <li>to verify your identity</li>
          <li>to provide services and products to you (including currency exchange, remittance, Quick Order and related services)</li>
          <li>to ensure the security of your transaction or order</li>
          <li>to comply with our legal requirements</li>
          <li>
            to market our services and products to you, including contacting you electronically (e.g.
            by text or email for this purpose)
          </li>
          <li>to improve the services and products that we provide to you</li>
          <li>to undertake credit checks of you (if necessary)</li>
          <li>
            to bill you and to collect money that you owe us, including authorising and processing
            credit card transactions
          </li>
          <li>to respond to communications from you, including a complaint</li>
          <li>to conduct research and statistical analysis (on an anonymised basis)</li>
          <li>
            to protect and/or enforce our legal rights and interests, including defending any claim
          </li>
          <li>for any other reasonable purpose we determine in relation to our business</li>
          <li>for any other purpose authorised by you or applicable law</li>
        </ul>
      </section>

      <section>
        <h2>6. Disclosing your personal information</h2>
        <p>We may disclose your personal information to:</p>
        <ul>
          <li>another company within our group</li>
          <li>
            any business that supports our services and products, including any person that hosts or
            maintains any underlying IT system or data centre that we use to provide the website,
            apps, Quick Order, portals or other services and products
          </li>
          <li>
            identity verification entities in order to verify your identity for transaction security
            purposes and to comply with our obligations at law
          </li>
          <li>fraud prevention agencies</li>
          <li>a credit reference agency for the purpose of credit checking you</li>
          <li>
            any of our partners who require your information in order to process your transaction
            (including remittance partners such as MoneyGram or Western Union where used)
          </li>
          <li>other third parties (for anonymised statistical information)</li>
          <li>a person who can require us to supply your personal information</li>
          <li>any other person authorised by applicable law</li>
          <li>any other person authorised by you</li>
        </ul>
        <p>
          Due to the nature of our business which involves sending money overseas, and receiving
          money from overseas, businesses that assist us in providing our services and products may
          be located outside your country of residence. This may mean your personal information is
          held and processed outside that country.
        </p>
        <p>
          We may transfer your information in the case of a sale, merger, consolidation, liquidation,
          reorganisation or acquisition.
        </p>
        <p>
          <strong>We do not sell your personal information.</strong>
        </p>
      </section>

      <section>
        <h2>7. Protecting your personal information</h2>
        <p>
          We will take reasonable steps to keep your personal information safe from loss,
          unauthorised activity, or other misuse.
        </p>
        <p>
          We implement strict security measures to protect your information from unauthorised
          access, use, or disclosure. Advanced encryption technologies are employed to ensure the
          protection of your information during transmission and storage.
        </p>
      </section>

      <section>
        <h2>8. Refusal to provide information</h2>
        <p>
          You have the right to choose whether to provide personal information. However, please note
          that if you refuse to provide necessary information, we may be unable to complete your
          transaction or order request.
        </p>
      </section>

      <section>
        <h2>9. Internet use</h2>
        <p>
          While we take reasonable steps to maintain secure internet connections, if you provide us
          with personal information over the internet, the provision of that information is at your
          own risk.
        </p>
        <p>
          If you follow a link on our website to another site (including App Store, Google Play, or
          customer portal login pages), the owner of that site will have its own privacy policy
          relating to your personal information. We suggest you review that site’s privacy policy
          before you provide personal information.
        </p>
      </section>

      <section>
        <h2>10. CCTV</h2>
        <p>
          For safety and security reasons, and to resolve customer complaints, we collect and store
          CCTV footage at our physical stores.
        </p>
      </section>

      <section>
        <h2>11. Cookies and analytics</h2>
        <p>
          We use cookies (an alphanumeric identifier that we transfer to your computer’s hard drive
          so that we can recognise your browser) and similar technologies to monitor your use of the
          website, remember preferences, measure performance and improve content. You may disable
          cookies by changing the settings on your browser, although this may mean that you cannot
          use all of the features of the website (including parts of Quick Order or quote tools).
        </p>
      </section>

      <section>
        <h2>12. Lotus FX Online, apps and Quick Order</h2>
        <p>
          When you download and use our mobile app, or use Quick Order or an online customer portal,
          we may collect your mobile device information, browser information and location where
          relevant to provide the service.
        </p>
        <p>
          For Quick Order, we collect the details you enter to create and fulfil your order (including
          guest details where you order without a full account), and may share what is needed with our
          branch systems so your order can be prepared for pickup or delivery where available.
        </p>
        <p>
          You are responsible for selecting your password for Lotus FX Online / app accounts. Ensure
          this is something that cannot be easily guessed and keep it safe and secure.
        </p>
        <p>
          App account deletion requests are explained on our{' '}
          <Link href="/delete-account">delete account</Link> page.
        </p>
      </section>

      <section>
        <h2>13. Retention</h2>
        <p>
          We will retain your information as long as we need it in order to continue to provide our
          products and services to you. We are also bound by legal obligations in relation to our
          record keeping which requires us to hold transaction records for a minimum period of time.
        </p>
      </section>

      <section>
        <h2>14. Access, correction and contact</h2>
        <p>
          If you have any questions about this privacy policy, our privacy practices, or if you would
          like to request access to, or correction of, your personal information, you can contact us:
        </p>
        <div className="mt-2 space-y-3">
          <ul className="space-y-3 list-none pl-0">
            {SUPPORT_EMAILS.map(({ region, email }) => (
              <li key={region} className="list-none">
                <span className="font-semibold text-gray-900">{region}:</span>{' '}
                <a
                  href={`mailto:${email}?subject=Privacy%20request%20%E2%80%94%20LotusFX`}
                  className="text-primary-700 font-semibold hover:text-primary-900"
                >
                  {email}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-gray-600">
            New Zealand head office contact (from our NZ privacy notice): +64 9 369 1723 · Suite 3,
            Level 7, 300 Queen Street, Auckland Central 1010, New Zealand. You can also{' '}
            <Link href="/contact">contact us online</Link>.
          </p>
        </div>
      </section>
    </LegalDocument>
  )
}
