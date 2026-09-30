export type FaqItem = {
  question: string
  answer: string
}

/** Single source of truth for FAQ content across the site. */
export const SITE_FAQS: FaqItem[] = [
  {
    question: 'How do customers register on the Lotus Foreign Exchange App?',
    answer:
      'Customers can register on the Lotus Foreign Exchange App by downloading it from the Apple App Store or Google Play. Once installed, you\'ll need to sign up using your email address and verify your identity as part of the registration process.',
  },
  {
    question: 'Are there any charges/fees on using the Lotus Foreign Exchange App?',
    answer:
      'The Lotus Foreign Exchange App is free to download and use. However, transaction fees may apply when making money transfers. There are no monthly subscription fees or charges for maintaining an account, nor are there fees for ordering currency online.',
  },
  {
    question: 'What mobile OS platform does the app currently support?',
    answer:
      'The Lotus Foreign Exchange App is available for devices running iOS and Android. We ensure compatibility with the latest versions of these operating systems to provide the best user experience. For users with PCs or other operating systems, please log in to our website to conduct your transactions.',
  },
  {
    question: 'How can I pre-order my currency requirements?',
    answer:
      'To pre-order currency, visit our website or use the Lotus Foreign Exchange App. Select the currency and amount you need, and choose a pickup location. You should pre-order to skip wait times in branch and avoid rate fluctuations.',
  },
  {
    question: 'Is there a limit on how much currency I can exchange per day or month?',
    answer:
      'Quick Order is limited to $1,000. Money transfers can be made up to $10,000 online. You can transfer more than $10,000, but we will need additional information about you — please contact us.',
  },
  {
    question: 'What documents are required for transactions?',
    answer:
      'For most transactions, you will need to provide a valid government-issued ID (such as passport, national identity card, or driver licence plus bank card). Additional documents may be required for larger transactions or under specific regulatory requirements.',
  },
  {
    question: 'Are my personal details safe and secure?',
    answer:
      'Yes, your personal details are stored securely. We protect your data and comply with all relevant data protection regulations to ensure your information is safe from unauthorized access. Regular audits and compliance checks reinforce our commitment to security.',
  },
  {
    question: 'Why do you collect the source of funds?',
    answer:
      'Collecting the source of funds helps us comply with anti-money laundering laws and regulations. It is standard practice to ensure that the funds being exchanged or transferred are derived from legitimate sources.',
  },
  {
    question: 'What documents are required for large transfers?',
    answer:
      'For large transfers, you may need to provide additional documentation, such as proof of your source of funds and wealth, bank statements, or other financial documents to comply with regulatory requirements and to validate the legitimacy of the transaction.',
  },
]

const DOCS_ANSWER_AU =
  'For most transactions, you will need to provide a valid government-issued ID (such as passport, national identity card, or driver licence plus bank card). Additional documents may be required for larger transactions or under specific regulatory requirements.'

const DOCS_ANSWER_NZ_FJ =
  'For most transactions, you will need to provide a valid government-issued ID (such as passport, national identity card, or driver licence plus bank card) and proof of address (utility bill or bank statement). Additional documents may be required for larger transactions or under specific regulatory requirements.'

/** Country-aware FAQs (proof of address required in NZ/FJ, not AU). */
export function getSiteFaqs(country?: string): FaqItem[] {
  const docsAnswer = country === 'NZ' || country === 'FJ' ? DOCS_ANSWER_NZ_FJ : DOCS_ANSWER_AU

  return SITE_FAQS.map((faq) =>
    faq.question === 'What documents are required for transactions?'
      ? { ...faq, answer: docsAnswer }
      : faq
  )
}
