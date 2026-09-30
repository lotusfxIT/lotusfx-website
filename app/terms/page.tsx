import Link from 'next/link'
import type { Metadata } from 'next'
import LegalDocument from '@/components/legal/LegalDocument'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'Terms and Conditions',
  description:
    'Lotus Foreign Exchange Limited Terms and Conditions for currency exchange, remittance, Quick Order, website and app services.',
  path: '/terms',
})

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms and Conditions"
      subtitle="These Terms and Conditions (Terms) govern your use of the goods and services provided by Lotus Foreign Exchange Limited (we, our, us, or Lotus), including Foreign Exchange Services and Remittance Services through our branches, website, mobile applications, Quick Order, phone-based transactions and by any other means (collectively, the Services)."
      lastUpdated="28 September 2026"
    >
      <section>
        <p>
          By accessing or using our Services, you agree to comply with and be bound by these Terms.
          If you do not agree to these Terms, you must immediately cease using the Services.
        </p>
        <p>
          Please read these Terms carefully before using any of our Services. By using our Services,
          you acknowledge that you have read, understood, and agreed to these Terms.
        </p>
      </section>

      <section>
        <h2>1. Definitions</h2>
        <ul>
          <li>
            <strong>“App”</strong> means our mobile application(s), including country-specific Lotus
            FX apps where available.
          </li>
          <li>
            <strong>“Customer”</strong>, <strong>“you”</strong> and <strong>“your”</strong> means the
            individual or entity requesting to use our Services.
          </li>
          <li>
            <strong>“Foreign Exchange Services”</strong> means Lotus’ service of buying and/or
            selling foreign currency and includes online currency purchase and Quick Order services.
          </li>
          <li>
            <strong>“Quick Order”</strong> means the website (and related) service that allows you to
            place an order for foreign currency for branch pickup or, where offered, delivery,
            including as a guest within applicable limits.
          </li>
          <li>
            <strong>“Remittance Services”</strong> means Lotus’ service of transferring funds by a
            sender at one location to a beneficiary at another location, which includes MoneyGram,
            Western Union (where offered), Wire Transfer, and eWire products.
          </li>
          <li>
            <strong>“Website”</strong> refers to our online platforms accessible at lotusfx.com and
            related country domains or portals we operate.
          </li>
        </ul>
      </section>

      <section>
        <h2>2. Services provided</h2>

        <h3>2.1 Foreign Exchange Services</h3>
        <ol>
          <li>
            Foreign Exchange Services are available at our physical branches. Online currency
            purchases and Quick Orders for pickup (and delivery where offered) can be accessed
            through our website and mobile app, and are covered in clauses 2.3 and 2.4. Foreign
            Exchange Services are subject to availability and applicable exchange rates which change
            constantly.
          </li>
          <li>
            The transaction is confirmed and binding when you make payment (or hand over the foreign
            currency).
          </li>
          <li>
            It is your responsibility to check the condition of the currency that you receive, and
            that you have received the correct amount, as it may not be possible to verify this after
            you leave our premises.
          </li>
          <li>
            We may allow you to place an order for foreign currency to be picked up at a later date.
            You may be required to pay a deposit and sign a contract to confirm your order. If you do
            not sign a contract, then the terms of clauses 2.3 / 2.4 shall apply as if your order was
            placed as an online currency purchase or Quick Order.
          </li>
          <li>We do not charge any commission for Foreign Exchange Services.</li>
        </ol>

        <h3>2.2 Remittance Services</h3>
        <ol>
          <li>
            Remittance Services can be accessed through our website, mobile app, phone service, or by
            visiting a physical branch (availability may vary by country).
          </li>
          <li>
            We provide Remittance Services for sending funds through methods that may include:
            <ul>
              <li>
                <strong>MoneyGram:</strong> third-party MoneyGram global payment system. This is
                restricted to personal transfers only. Once initiated, the transaction is processed
                through the MoneyGram network and is subject to MoneyGram’s own terms and conditions.
              </li>
              <li>
                <strong>Western Union:</strong> where offered, subject to Western Union’s own terms
                and conditions.
              </li>
              <li>
                <strong>Wire Transfers:</strong> we use our partners to facilitate payments directly
                into overseas bank accounts. Available to personal and business customers. The
                transfer will be processed through a bank or financial institution, and the recipient
                may be subject to additional fees or charges. Online / app use may require customer
                onboarding and identity verification.
              </li>
              <li>
                <strong>eWire Transfers:</strong> we use our own systems to transfer your funds
                between New Zealand, Australia or Fiji for cash pickup at one of our branches, bank
                deposit, or other pickup methods made available from time to time (including mobile
                wallet in Fiji where available). Available to personal and business customers. These
                transfers may be subject to digital verification processes and account onboarding.
              </li>
            </ul>
          </li>
          <li>Fees and charges for Remittance Services are determined in accordance with clause 5.</li>
        </ol>

        <h3>2.3 Online currency purchase</h3>
        <p>
          This clause applies when you use our website or mobile app to purchase currency online to
          pick up at one of our branches (click and collect), including where a full customer profile
          is required.
        </p>
        <ol>
          <li>You must have a completed and up-to-date customer profile to purchase currency online where we require account registration.</li>
          <li>
            When you confirm your order, it forms a contract between you and Lotus pursuant to which
            you agree to purchase the relevant currency in the amount and at the rate stipulated (with
            pickup of the currency and, if only a deposit has been paid, the payment of the balance,
            to occur at a later date). This contract may not be cancelled unless agreed by us.
          </li>
          <li>
            Should you wish to cancel or amend your order for any reason and in any manner, we
            reserve the right to recover from you any losses, including foreign exchange losses, and
            reasonable costs incurred as a consequence of the cancellation or amendment, and may
            deduct the same from any deposit held by us. We further reserve the right to seek any
            shortfall from you that may arise should the deposit held (if any) be insufficient to
            cover the losses and costs incurred and you shall be liable for our costs of recovery.
          </li>
          <li>
            A valid government-issued photo ID and the confirmation email (or order confirmation)
            that you can collect your currency will be required to collect your order.
          </li>
          <li>
            The online currency purchase service is subject to availability at the selected branch.
            Currency availability may vary. Depending on stock levels, there may be a wait of up to 7
            days before your order is ready to collect.
          </li>
          <li>
            Orders must be collected within 7 days of receiving the confirmation email / ready
            notice. After this period, we reserve the right to cancel the order and refund the
            amount, and charge you an administration fee of $10 (or local currency equivalent).
          </li>
          <li>
            Lotus reserves the right to offer alternative arrangements if necessary. If we are not
            able to fulfil your order, we will inform you by email and process a full refund back to
            you.
          </li>
          <li>
            All online currency purchase transactions are subject to our security protocols. We
            reserve the right to refuse collection if identity and transaction verification
            requirements are not met.
          </li>
          <li>
            We reserve the right to charge a fee for online currency purchase transactions which will
            be notified to you before you confirm your order.
          </li>
        </ol>

        <h3>2.4 Quick Order</h3>
        <p>
          This clause applies when you use Quick Order on our Website (including as a guest, where
          offered).
        </p>
        <ol>
          <li>
            Quick Order lets you request foreign currency for collection at a selected Lotus branch,
            or delivery where that option is enabled for your country.
          </li>
          <li>
            Guest Quick Order may be limited to a maximum order value shown during the order flow.
            Orders above that limit may require you to log in, sign up, or use the Lotus FX app
            (where available for your country).
          </li>
          <li>
            Rates and totals shown are indicative until your order is confirmed and payment is
            completed in accordance with the process we provide. Rates can change.
          </li>
          <li>
            When you submit a Quick Order, you form a contract to purchase the currency at the rate
            and on the terms confirmed for that order, subject to stock, branch capacity, compliance
            checks and our right to refuse or cancel as set out in these Terms.
          </li>
          <li>
            Cancellation, amendment, collection, ID, fulfilment timeframes, and fees in clause 2.3
            apply to Quick Order as far as they are relevant, unless we notify different terms during
            the order flow.
          </li>
          <li>
            You must provide accurate contact and identity details. We may contact you about your
            order and may require additional verification before release of currency.
          </li>
          <li>
            Quick Order availability, delivery, and guest limits may differ by country (Australia,
            New Zealand, Fiji) and may change without prior notice.
          </li>
        </ol>

        <h3>2.5 Multi-currency cards</h3>
        <p>
          We may from time to time sell multi-currency cards which may be subject to their own
          specific terms and conditions which shall apply in addition to these Terms. In the case of
          any inconsistencies with those terms and conditions and these Terms, those terms and
          conditions shall prevail.
        </p>

        <h3>2.6 Transaction confirmation</h3>
        <p>
          After your transaction has been completed, we will provide a confirmation receipt or
          transaction / order reference number. You should retain this for your records.
        </p>

        <h3>2.7 Processing time</h3>
        <p>
          We aim to process all transactions (apart from Foreign Exchange Services provided at our
          branches) by the following business day, however, we cannot guarantee this. Delays may
          occur due to multiple reasons (such as compliance or technical issues or delays by
          third-parties), which can result in your transaction being processed slower than usual. If
          your transfer is urgent, please contact our head office or customer care team who will be
          happy to assist you directly. You agree that Lotus is not responsible if there is a delay
          in processing your transaction for any reason.
        </p>

        <h3>2.8 Change of mind</h3>
        <ol>
          <li>
            In relation to our Foreign Exchange Services, we cannot offer a return or exchange and
            you will be required to conduct another transaction if you wish to buy or sell any
            foreign currency.
          </li>
          <li>
            In relation to our Remittance Services, remittance transactions are non-refundable once
            they have been processed. However, provided that the beneficiary of the remittance
            transaction has not picked up or received the funds, you may request us to attempt to
            reverse the transaction (or request this from the third-party service provider, where
            relevant). You must provide proof of the transaction and additional documentation as
            necessary. We do not guarantee that we will be able to reverse the transaction. If we
            successfully reverse the transaction, any sending fees paid cannot be refunded and an
            additional $20 processing fee (or local equivalent; applicable only if the reversal is
            successful) must be paid prior to any refund being processed or deducted from the refund
            amount.
          </li>
        </ol>
      </section>

      <section>
        <h2>3. Account registration and security</h2>
        <h3>3.1 Account creation</h3>
        <p>
          To access certain Services, you may be required to register for an account with us. There
          is no cost to register for an account. You agree to provide accurate, current, and complete
          information during registration and to update such information as necessary.
        </p>
        <h3>3.2 Account security</h3>
        <p>
          You are responsible for maintaining the confidentiality of your account information,
          including your username and password. You must not share these details with anyone. You
          agree to immediately notify us of any unauthorised use or security breach regarding your
          account.
        </p>
      </section>

      <section>
        <h2>4. Customer responsibilities</h2>
        <h3>4.1 Accurate information</h3>
        <p>
          You must provide us with accurate and up-to-date information, including your personal
          details, recipient/beneficiary information, transaction or order details, and any other
          information requested by us.
        </p>
        <h3>4.2 Funds availability</h3>
        <p>
          You confirm that the funds you are remitting or exchanging are lawfully obtained, and you
          have the right to transfer them.
        </p>
        <h3>4.3 Compliance with laws</h3>
        <p>
          You agree to comply with all applicable laws and regulations, including anti-money
          laundering (AML) and counter the financing of terrorism (CFT) obligations.
        </p>
        <h3>4.4 Transaction verification</h3>
        <p>
          We may require you to provide identification or other documentation to verify your
          identity, address and/or the source of funds before processing any transaction or releasing
          any Quick Order.
        </p>
        <h3>4.5 Payment</h3>
        <ol>
          <li>You must pay for each transaction in full, on time, and in cleared funds without set off or deduction.</li>
          <li>
            You agree (in absence of fraud) not to instruct your bank to reverse any payments for
            Services which we have provided you.
          </li>
        </ol>
        <h3>4.6 Physical currency</h3>
        <ol>
          <li>
            When giving us physical currency (in relation to any Service), you must provide us with
            clean, legitimate notes with no rips or tears. If any notes you provide do not comply
            with this, we may return the note to you and require you to make good the difference.
          </li>
          <li>
            You must not provide us with, or attempt to provide us with, fake or counterfeit notes. If
            you have provided us with fake or counterfeit notes, we will retain these notes and pass
            your details on to the police for investigation.
          </li>
        </ol>
        <h3>4.7 Return of funds</h3>
        <p>
          There may be a case where, due to any reason (including but not limited to unintentional
          duplicated transactions, teller error, computer system error, or an error by any
          third-party), we have given you more money than you were entitled to receive; taken less
          money from you than we should have; or transferred more money than you were intending to
          send (a Payment Discrepancy). In such cases:
        </p>
        <ol>
          <li>
            If you have received more money than you were entitled to, you waive any right you have
            in that money (if any), hold the surplus in trust for our benefit, and will promptly
            return that money to us at our request or when you become aware of the Payment
            Discrepancy (whichever comes first).
          </li>
          <li>
            If we have taken less money than we should have, you owe us the shortfall and will pay
            this to us at our request or when you become aware of the Payment Discrepancy (whichever
            comes first).
          </li>
          <li>
            If we have transferred more money than you were intending to send (an Overpayment), you
            acknowledge it may not be possible for us to recover this from the beneficiary. You agree
            to procure that the beneficiary returns any Overpayment to us within 5 business days. If
            the beneficiary fails to do so, you agree to pay us the local-currency equivalent of the
            Overpayment (calculated at the relevant rate on the day of the transfer) upon our request.
          </li>
        </ol>
      </section>

      <section>
        <h2>5. Fees and charges</h2>
        <h3>5.1 Fees</h3>
        <p>
          Fees associated with our Services may vary depending on the transaction type, the amount
          being transferred, the destination, and the method of payment. You will be informed of all
          applicable fees before completing any transaction.
        </p>
        <h3>5.2 Currency exchange rates</h3>
        <p>
          Foreign exchange rates will be provided at the time of the transaction and are subject to
          change without notice. These rates are determined in accordance with the prevailing market
          conditions and our internal policies.
        </p>
        <h3>5.3 Additional charges</h3>
        <p>
          You are responsible for any third-party charges or fees, such as bank or card fees or
          intermediary charges, that may be applied to your transaction.
        </p>
      </section>

      <section>
        <h2>6. Liability</h2>
        <h3>6.1 Reliance on information provided</h3>
        <p>
          You acknowledge that we are reliant on you to provide us with the correct information for
          your transaction or order. We will conduct the transaction in accordance with the
          information you provide us. In particular, with respect to our Remittance Services, if you
          provide us with incorrect information, then the beneficiary may not be able to collect the
          funds and/or the funds may be transferred into a different third party’s account, resulting
          in a loss to you. You agree that we have no responsibility and will not be held liable for
          conducting a transaction in accordance with the information you provide us.
        </p>
        <h3>6.2 Exclusion of liability</h3>
        <p>We will not be held liable for any loss or damage caused by:</p>
        <ul>
          <li>
            Errors or delays in the transfer or order process, including issues caused by third-party
            service providers such as banks, MoneyGram, Western Union, or other partners
          </li>
          <li>Incorrect or incomplete information provided by you</li>
          <li>Unauthorised use of your account or any fraudulent activity, to the extent permitted by law</li>
          <li>Cyber criminals</li>
          <li>
            Acts of force majeure, including natural disasters, government actions, or technical
            failures that affect the Services
          </li>
        </ul>
        <h3>6.3 Limitation of liability</h3>
        <p>
          If we are found to be liable by a Court in relation to any matter, our total liability is
          limited to the total amount of the transaction fees paid by you to us.
        </p>
      </section>

      <section>
        <h2>7. Privacy and data protection</h2>
        <p>
          We collect, process, store and use your personal data in accordance with our{' '}
          <Link href="/privacy">Privacy Policy</Link>. By using our Services, you consent to the
          collection, processing, storage and use of your personal data as described in our Privacy
          Policy.
        </p>
      </section>

      <section>
        <h2>8. Restrictions on use</h2>
        <p>You agree not to use our Services for any unlawful purpose, including but not limited to:</p>
        <ul>
          <li>Money laundering or financing terrorism</li>
          <li>Fraudulent transactions</li>
          <li>Violations of any local or international laws or regulations</li>
        </ul>
      </section>

      <section>
        <h2>9. Termination of Services</h2>
        <h3>9.1 Your right to terminate</h3>
        <p>
          You may stop using our Services at any time by ceasing to conduct transactions with us.
          Termination does not affect any transactions that were processed before your cessation.
        </p>
        <h3>9.2 Our right to suspend or terminate</h3>
        <p>
          We may suspend or terminate your access to our Services and/or ban your account at our sole
          discretion if we suspect any fraudulent activity, non-compliance with these Terms, or any
          violation of applicable law. We will notify you of any such suspension or termination where
          required by law.
        </p>
      </section>

      <section>
        <h2>10. Governing law and jurisdiction</h2>
        <p>
          These Terms are governed by the laws of New Zealand. The courts of New Zealand shall have
          non-exclusive jurisdiction to hear, settle and/or determine any dispute, controversy or
          claim (including any non-contractual dispute, controversy or claim) arising out of or in
          connection with this agreement, including any question regarding its existence, validity,
          formation or termination. For these purposes, you hereby irrevocably submit to the
          jurisdiction of the New Zealand courts.
        </p>
        <p>
          If you have breached, or we suspect you have breached, any of these Terms, or you do not
          pay any amounts when due, you agree to pay all of our costs (including legal costs) in
          exercising our rights against you and/or enforcing this agreement.
        </p>
      </section>

      <section>
        <h2>11. Complaints</h2>
        <p>
          If you have a complaint, please see our <Link href="/complaints">Complaints</Link> page or
          email the customer care team for your country. When Lotus receives your complaint, we will
          acknowledge it within 1–2 working days, gather and evaluate information, and aim to respond
          within 20 working days (in some cases up to 40 working days).
        </p>
      </section>

      <section>
        <h2>12. Amendments to Terms</h2>
        <p>
          We reserve the right to modify, update, or revise these Terms at any time. Any changes will
          be posted on the Website, and such changes will be effective immediately upon posting. You
          are responsible for reviewing these Terms periodically for any changes. By continuing to
          use our Services after the changes, you accept the updated Terms.
        </p>
      </section>

      <section>
        <h2>13. Contact information</h2>
        <p>
          For questions, concerns, or to report any issues, please{' '}
          <Link href="/contact">contact us</Link> or email:
        </p>
        <ul>
          <li>
            Australia:{' '}
            <a href="mailto:aucustomercare@lotusfx.com">aucustomercare@lotusfx.com</a>
          </li>
          <li>
            New Zealand:{' '}
            <a href="mailto:nzcustomercare@lotusfx.com">nzcustomercare@lotusfx.com</a> · +64 9 369
            1723
          </li>
          <li>
            Fiji: <a href="mailto:fjcustomercare@lotusfx.com">fjcustomercare@lotusfx.com</a>
          </li>
        </ul>
      </section>
    </LegalDocument>
  )
}
