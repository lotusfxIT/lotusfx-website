export type ClickCollectReceiptData = {
  orderRef: string
  firstName: string
  buyAmount: string
  buyCurrency: string
  exchangeRate: string
  totalAmount: string
  payCurrency: string
  branchName: string
  branchAddress: string
  mapsUrl: string
  careEmail: string
  siteBase: string
  country: string
  kind?: 'receipt' | 'ready'
}

export type ClickCollectStaffEmailData = {
  orderRef: string
  country: string
  customerName: string
  customerEmail: string
  customerPhone: string
  placed: string
  buyAmount: string
  buyCurrency: string
  exchangeRate: string
  totalAmount: string
  payCurrency: string
  branchName: string
  branchAddress: string
  notes?: string
  adminUrl: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function clickCollectSiteBase(country: string, fallback = 'https://au.lotusfx.com') {
  if (country === 'NZ') return 'https://nz.lotusfx.com'
  if (country === 'FJ') return 'https://fj.lotusfx.com'
  if (country === 'AU') return 'https://au.lotusfx.com'
  return fallback.replace(/\/$/, '') || 'https://au.lotusfx.com'
}

function countrySiteBase(country: string, fallback: string) {
  return clickCollectSiteBase(country, fallback)
}

export function clickCollectMapsUrl(name?: string, address?: string) {
  const destination = [name ? officialBranchName(name) : '', address]
    .map((part) => String(part || '').trim())
    .filter(Boolean)
    .join(', ')
  if (!destination) return ''
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`
}

function moneyLabel(amount: string, currency: string) {
  const trimmed = String(amount || '').trim()
  const code = String(currency || '').trim()
  if (!trimmed) return code
  return `${trimmed} ${code}`.trim()
}

/** e.g. Penrith → Lotus Foreign Exchange Penrith Branch */
export function officialBranchName(name: string) {
  let place = String(name || '').trim()
  if (!place) return 'Lotus Foreign Exchange'
  place = place.replace(/^Lotus Foreign Exchange\s*[-–—]?\s*/i, '').trim()
  place = place.replace(/^[A-Za-z]{2,3}\s*[·•\-–—]\s*/, '').trim()
  if (!place) return 'Lotus Foreign Exchange'
  if (!/\bbranch\b/i.test(place)) place = `${place} Branch`
  return `Lotus Foreign Exchange ${place}`.replace(/\s+/g, ' ').trim()
}

/** Customer Click & Collect receipt — same HTML used in the confirmation email. */
export function buildClickCollectReceiptHtml(data: ClickCollectReceiptData): string {
  const isReady = data.kind === 'ready'
  const orderRef = escapeHtml(data.orderRef || 'Pending')
  const first = escapeHtml(data.firstName.trim() || 'there')
  const buy = escapeHtml(moneyLabel(data.buyAmount, data.buyCurrency))
  const rate = escapeHtml(data.exchangeRate || '—')
  const total = escapeHtml(moneyLabel(data.totalAmount, data.payCurrency))
  const branchName = escapeHtml(officialBranchName(data.branchName))
  const branchAddress = escapeHtml(data.branchAddress || '')
  const mapsUrl = data.mapsUrl
  const care = escapeHtml(data.careEmail)
  const country = String(data.country || 'AU').toLowerCase()
  const site = countrySiteBase(data.country, data.siteBase)
  const year = new Date().getFullYear()
  const heading = isReady ? 'Your currency is ready to collect' : "We've received your order"
  const intro = isReady
    ? 'Good news — your currency is ready to collect. Pop into the branch below during opening hours.'
    : 'Thanks for ordering with Lotus Foreign Exchange. Our team is getting your currency ready.'
  const notice = isReady
    ? 'Please collect during branch opening hours. Bring photo ID and pay in store when you collect.'
    : 'This email is only a confirmation that we have received your order. We will email you again when your currency is ready to collect.'
  const preheader = isReady
    ? `Ready to collect — ${buy} at ${branchName}.`
    : `Click &amp; Collect confirmation — ${buy}, pay ${total} in store${
        data.branchName ? ` at ${escapeHtml(officialBranchName(data.branchName))}` : ''
      }.`

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${isReady ? 'Your currency is ready to collect' : 'Your Lotus Foreign Exchange order'} ${orderRef}</title>
</head>
<body style="margin:0;padding:0;background:#f4f1ee;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    ${preheader}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ee;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #eadfd6;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:22px 28px 16px;border-bottom:3px solid #d5293a;">
              <img src="https://lotusfx.com/images/lotus-logo-horizontal.jpg" alt="Lotus Foreign Exchange" width="220" style="display:block;border:0;height:auto;max-width:220px;" />
            </td>
          </tr>
          <tr>
            <td style="padding:28px 28px 8px;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
              <p style="margin:0 0 10px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#d5293a;font-weight:bold;">Click &amp; Collect</p>
              <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;font-weight:bold;color:#111827;">${heading}</h1>
              <p style="margin:0 0 12px;font-size:15px;line-height:1.55;color:#374151;">Hi ${first},</p>
              <p style="margin:0 0 22px;font-size:15px;line-height:1.55;color:#374151;">${intro}</p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f4;border:1px solid #eadfd6;border-radius:10px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 14px;font-size:13px;font-weight:bold;color:#6b7280;letter-spacing:0.04em;text-transform:uppercase;">Order summary</p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;">
                      <tr>
                        <td style="padding:8px 0;color:#6b7280;width:42%;">Order reference</td>
                        <td style="padding:8px 0;color:#111827;font-weight:bold;">${orderRef}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;color:#6b7280;border-top:1px solid #eadfd6;">You're buying</td>
                        <td style="padding:8px 0;color:#111827;font-weight:bold;border-top:1px solid #eadfd6;">${buy}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;color:#6b7280;border-top:1px solid #eadfd6;">Exchange rate</td>
                        <td style="padding:8px 0;color:#111827;font-weight:bold;border-top:1px solid #eadfd6;">${rate}</td>
                      </tr>
                      <tr>
                        <td style="padding:12px 0 4px;color:#111827;font-weight:bold;border-top:1px solid #eadfd6;font-size:16px;">Total to pay in store</td>
                        <td style="padding:12px 0 4px;color:#d5293a;font-weight:bold;border-top:1px solid #eadfd6;font-size:16px;">${total}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;border:1px solid #eadfd6;border-radius:10px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 6px;font-size:13px;font-weight:bold;color:#6b7280;letter-spacing:0.04em;text-transform:uppercase;">Collect from</p>
                    <p style="margin:0 0 4px;font-size:16px;font-weight:bold;color:#111827;">${branchName}</p>
                    ${
                      branchAddress
                        ? `<p style="margin:0 0 10px;font-size:14px;line-height:1.5;color:#4b5563;">${branchAddress}</p>`
                        : ''
                    }
                    ${
                      mapsUrl
                        ? `<p style="margin:0;"><a href="${escapeHtml(
                            mapsUrl
                          )}" style="display:inline-block;background:#d5293a;color:#ffffff;font-size:13px;font-weight:bold;text-decoration:none;padding:10px 16px;border-radius:8px;">Get directions</a></p>`
                        : ''
                    }
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0 0;background:#fff8f0;border:1px solid #eadfd6;border-radius:10px;">
                <tr>
                  <td style="padding:14px 18px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.55;color:#374151;">
                    ${notice}
                  </td>
                </tr>
              </table>

              <p style="margin:22px 0 8px;font-size:15px;font-weight:bold;color:#111827;">When you come in</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#374151;">
                <tr>
                  <td style="padding:0 0 8px;vertical-align:top;width:22px;color:#d5293a;font-weight:bold;">1.</td>
                  <td style="padding:0 0 8px;">Bring valid photo ID in the same name as this order.</td>
                </tr>
                <tr>
                  <td style="padding:0 0 8px;vertical-align:top;color:#d5293a;font-weight:bold;">2.</td>
                  <td style="padding:0 0 8px;">Pay in store by cash or EFTPOS when you collect.</td>
                </tr>
                <tr>
                  <td style="padding:0;vertical-align:top;color:#d5293a;font-weight:bold;">3.</td>
                  <td style="padding:0;">Quote your order reference <strong>${orderRef}</strong> at the counter.</td>
                </tr>
              </table>

              <p style="margin:22px 0 0;font-size:14px;line-height:1.55;color:#4b5563;">
                Questions? Reply to this email or contact
                <a href="mailto:${care}" style="color:#d5293a;text-decoration:none;font-weight:bold;">${care}</a>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 28px;background:#faf7f4;border-top:1px solid #eadfd6;font-family:Arial,Helvetica,sans-serif;">
              <p style="margin:0 0 6px;font-size:14px;font-weight:bold;color:#111827;">Lotus Foreign Exchange Limited</p>
              <p style="margin:0 0 12px;font-size:12px;line-height:1.5;color:#6b7280;">
                ABN 71 108 877 050 · AUSTRAC registered<br />
                Currency exchange and money transfers across Australia, New Zealand and Fiji
              </p>
              <p style="margin:0 0 10px;font-size:12px;">
                <a href="${site}" style="color:#d5293a;text-decoration:none;">${site.replace(/^https:\/\//, '')}</a>
                &nbsp;·&nbsp;
                <a href="${site}/locations" style="color:#d5293a;text-decoration:none;">Locations</a>
                &nbsp;·&nbsp;
                <a href="${site}/privacy/${country}" style="color:#d5293a;text-decoration:none;">Privacy</a>
                &nbsp;·&nbsp;
                <a href="${site}/terms/${country}" style="color:#d5293a;text-decoration:none;">Terms</a>
              </p>
              <p style="margin:0;font-size:11px;color:#9ca3af;">© ${year} Lotus Foreign Exchange Limited. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function buildClickCollectStaffHtml(data: ClickCollectStaffEmailData): string {
  const countryName =
    data.country === 'NZ' ? 'New Zealand' : data.country === 'FJ' ? 'Fiji' : 'Australia'
  const orderRef = escapeHtml(data.orderRef || 'Pending')
  const name = escapeHtml(data.customerName || 'Customer')
  const email = escapeHtml(data.customerEmail || '')
  const phone = escapeHtml(data.customerPhone || '')
  const placed = escapeHtml(data.placed || '')
  const buy = escapeHtml(moneyLabel(data.buyAmount, data.buyCurrency))
  const rate = escapeHtml(data.exchangeRate || '—')
  const total = escapeHtml(moneyLabel(data.totalAmount, data.payCurrency))
  const branchName = escapeHtml(officialBranchName(data.branchName))
  const branchAddress = escapeHtml(data.branchAddress || '')
  const notes = escapeHtml(String(data.notes || '').trim())
  const adminUrl = data.adminUrl
  const telHref = data.customerPhone.replace(/[^\d+]/g, '')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>New Click &amp; Collect order ${orderRef}</title>
</head>
<body style="margin:0;padding:0;background:#f4f1ee;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    New Click &amp; Collect order — ${name} — ${buy} — ${branchName}.
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ee;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #eadfd6;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:22px 28px 16px;border-bottom:3px solid #d5293a;">
              <img src="https://lotusfx.com/images/lotus-logo-horizontal.jpg" alt="Lotus Foreign Exchange" width="220" style="display:block;border:0;height:auto;max-width:220px;" />
            </td>
          </tr>
          <tr>
            <td style="padding:28px 28px 8px;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
              <p style="margin:0 0 10px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#d5293a;font-weight:bold;">Click &amp; Collect · ${escapeHtml(countryName)}</p>
              <h1 style="margin:0 0 8px;font-size:22px;line-height:1.3;font-weight:bold;color:#111827;">New order received</h1>
              <p style="margin:0 0 22px;font-size:15px;line-height:1.55;color:#374151;">A customer has placed a Click &amp; Collect order. Prepare the currency and email them when it is ready to collect.</p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f4;border:1px solid #eadfd6;border-radius:10px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 14px;font-size:13px;font-weight:bold;color:#6b7280;letter-spacing:0.04em;text-transform:uppercase;">Customer</p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;">
                      <tr>
                        <td style="padding:8px 0;color:#6b7280;width:42%;">Name</td>
                        <td style="padding:8px 0;color:#111827;font-weight:bold;">${name}</td>
                      </tr>
                      ${
                        email
                          ? `<tr>
                        <td style="padding:8px 0;color:#6b7280;border-top:1px solid #eadfd6;">Email</td>
                        <td style="padding:8px 0;border-top:1px solid #eadfd6;">
                          <a href="mailto:${email}" style="color:#d5293a;font-weight:bold;text-decoration:none;">${email}</a>
                        </td>
                      </tr>`
                          : ''
                      }
                      ${
                        phone
                          ? `<tr>
                        <td style="padding:8px 0;color:#6b7280;border-top:1px solid #eadfd6;">Phone</td>
                        <td style="padding:8px 0;border-top:1px solid #eadfd6;">
                          <a href="tel:${escapeHtml(telHref || phone)}" style="color:#111827;font-weight:bold;text-decoration:none;">${phone}</a>
                        </td>
                      </tr>`
                          : ''
                      }
                      ${
                        placed
                          ? `<tr>
                        <td style="padding:8px 0;color:#6b7280;border-top:1px solid #eadfd6;">Placed</td>
                        <td style="padding:8px 0;color:#111827;font-weight:bold;border-top:1px solid #eadfd6;">${placed}</td>
                      </tr>`
                          : ''
                      }
                    </table>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;background:#faf7f4;border:1px solid #eadfd6;border-radius:10px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 14px;font-size:13px;font-weight:bold;color:#6b7280;letter-spacing:0.04em;text-transform:uppercase;">Order summary</p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;">
                      <tr>
                        <td style="padding:8px 0;color:#6b7280;width:42%;">Order reference</td>
                        <td style="padding:8px 0;color:#111827;font-weight:bold;">${orderRef}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;color:#6b7280;border-top:1px solid #eadfd6;">They're buying</td>
                        <td style="padding:8px 0;color:#111827;font-weight:bold;border-top:1px solid #eadfd6;">${buy}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;color:#6b7280;border-top:1px solid #eadfd6;">Exchange rate</td>
                        <td style="padding:8px 0;color:#111827;font-weight:bold;border-top:1px solid #eadfd6;">${rate}</td>
                      </tr>
                      <tr>
                        <td style="padding:12px 0 4px;color:#111827;font-weight:bold;border-top:1px solid #eadfd6;font-size:16px;">Amount due in store</td>
                        <td style="padding:12px 0 4px;color:#d5293a;font-weight:bold;border-top:1px solid #eadfd6;font-size:16px;">${total}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;border:1px solid #eadfd6;border-radius:10px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 6px;font-size:13px;font-weight:bold;color:#6b7280;letter-spacing:0.04em;text-transform:uppercase;">Collect from</p>
                    <p style="margin:0 0 4px;font-size:16px;font-weight:bold;color:#111827;">${branchName}</p>
                    ${
                      branchAddress
                        ? `<p style="margin:0;font-size:14px;line-height:1.5;color:#4b5563;">${branchAddress}</p>`
                        : ''
                    }
                  </td>
                </tr>
              </table>
              ${
                notes
                  ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;border:1px solid #eadfd6;border-radius:10px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 6px;font-size:13px;font-weight:bold;color:#6b7280;letter-spacing:0.04em;text-transform:uppercase;">Customer notes</p>
                    <p style="margin:0;font-size:14px;line-height:1.5;color:#374151;">${notes}</p>
                  </td>
                </tr>
              </table>`
                  : ''
              }

              <p style="margin:22px 0 0;">
                <a href="${escapeHtml(adminUrl)}" style="display:inline-block;background:#d5293a;color:#ffffff;font-size:13px;font-weight:bold;text-decoration:none;padding:12px 18px;border-radius:8px;">Open in admin</a>
              </p>
              <p style="margin:12px 0 0;font-size:13px;line-height:1.5;color:#6b7280;">
                Reply to this email to contact the customer directly.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 28px;background:#faf7f4;border-top:1px solid #eadfd6;font-family:Arial,Helvetica,sans-serif;">
              <p style="margin:0 0 6px;font-size:14px;font-weight:bold;color:#111827;">Lotus Foreign Exchange Limited</p>
              <p style="margin:0;font-size:12px;line-height:1.5;color:#6b7280;">Internal order notice · not sent to the customer</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

const RED: [number, number, number] = [213, 41, 58]
const INK: [number, number, number] = [17, 24, 39]
const BODY: [number, number, number] = [55, 65, 81]
const MUTED: [number, number, number] = [107, 114, 128]
const RULE: [number, number, number] = [220, 210, 200]

async function loadLogo(): Promise<{ dataUrl: string; w: number; h: number } | null> {
  try {
    const res = await fetch('/images/lotus-logo-horizontal.jpg')
    if (!res.ok) return null
    const blob = await res.blob()
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result || ''))
      reader.onerror = () => reject(new Error('logo'))
      reader.readAsDataURL(blob)
    })
    const size = await new Promise<{ w: number; h: number }>((resolve) => {
      const img = new Image()
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight })
      img.onerror = () => resolve({ w: 220, h: 48 })
      img.src = dataUrl
    })
    return { dataUrl, ...size }
  } catch {
    return null
  }
}

function receiptFileName(orderRef: string) {
  return `Lotus-FX-receipt-${(orderRef || 'order').replace(/[^\w-]+/g, '')}.pdf`
}

/** Printable A4 receipt: selectable text and real links. Not a screenshot of the email. */
export async function downloadClickCollectReceiptPdf(data: ClickCollectReceiptData) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const left = 18
  const right = pageW - 18
  const width = right - left
  const valueX = right
  let y = 18

  const logo = await loadLogo()
  if (logo) {
    const logoW = 52
    const logoH = (logo.h / logo.w) * logoW
    doc.addImage(logo.dataUrl, 'JPEG', left, y, logoW, logoH)
    y += logoH + 8
  } else {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(...RED)
    doc.text('Lotus Foreign Exchange', left, y + 6)
    y += 14
  }

  doc.setDrawColor(...RED)
  doc.setLineWidth(0.6)
  doc.line(left, y, right, y)
  y += 12

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...RED)
  doc.text('CLICK & COLLECT', left, y)
  y += 8

  doc.setFontSize(18)
  doc.setTextColor(...INK)
  doc.text("We've received your order", left, y)
  y += 10

  const first = data.firstName.trim() || 'there'
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(...BODY)
  doc.text(`Hi ${first},`, left, y)
  y += 7
  const intro = doc.splitTextToSize(
    'Thanks for ordering with Lotus Foreign Exchange. Our team is getting your currency ready. We will email you again when it is ready to collect.',
    width
  )
  doc.text(intro, left, y)
  y += intro.length * 5.2 + 8

  doc.setDrawColor(...RULE)
  doc.setLineWidth(0.3)
  doc.line(left, y, right, y)
  y += 8

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...MUTED)
  doc.text('ORDER', left, y)
  y += 8

  const orderRef = data.orderRef || 'Pending'
  const buy = moneyLabel(data.buyAmount, data.buyCurrency)
  const total = moneyLabel(data.totalAmount, data.payCurrency)
  const rows: Array<{ label: string; value: string; emphasis?: boolean }> = [
    { label: 'Order reference', value: orderRef },
    { label: "You're buying", value: buy },
    { label: 'Exchange rate', value: data.exchangeRate || '—' },
    { label: 'Total to pay in store', value: total, emphasis: true },
  ]
  rows.forEach((row) => {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(...MUTED)
    doc.text(row.label, left, y)
    doc.setFont('helvetica', 'bold')
    if (row.emphasis) {
      doc.setTextColor(...RED)
    } else {
      doc.setTextColor(...INK)
    }
    doc.text(row.value, valueX, y, { align: 'right' })
    y += 7.2
  })

  y += 4
  doc.setDrawColor(...RULE)
  doc.line(left, y, right, y)
  y += 8

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...MUTED)
  doc.text('COLLECT FROM', left, y)
  y += 7
  doc.setFontSize(13)
  doc.setTextColor(...INK)
  const officialName = officialBranchName(data.branchName)
  const nameLines = doc.splitTextToSize(officialName, width)
  doc.text(nameLines, left, y)
  y += nameLines.length * 6.5
  if (data.branchAddress) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(...BODY)
    const addr = doc.splitTextToSize(data.branchAddress, width)
    doc.text(addr, left, y)
    y += addr.length * 5 + 2
  }
  if (data.mapsUrl) {
    y += 3
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...RED)
    doc.textWithLink('Open in Google Maps', left, y, { url: data.mapsUrl })
    const linkW = doc.getTextWidth('Open in Google Maps')
    doc.setDrawColor(...RED)
    doc.setLineWidth(0.2)
    doc.line(left, y + 1.2, left + linkW, y + 1.2)
    y += 8
  }

  y += 2
  doc.setDrawColor(...RULE)
  doc.line(left, y, right, y)
  y += 8

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...MUTED)
  doc.text('WHEN YOU COME IN', left, y)
  y += 8
  const steps = [
    'Bring valid photo ID in the same name as this order.',
    'Pay in store by cash or EFTPOS when you collect.',
    `Quote your order reference ${orderRef} at the counter.`,
  ]
  steps.forEach((step, i) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(...RED)
    doc.text(`${i + 1}.`, left, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...BODY)
    const wrapped = doc.splitTextToSize(step, width - 8)
    doc.text(wrapped, left + 8, y)
    y += wrapped.length * 5.2 + 2.5
  })

  y += 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(...BODY)
  const care = data.careEmail
  doc.text('Questions? Contact ', left, y)
  const prefixW = doc.getTextWidth('Questions? Contact ')
  doc.setTextColor(...RED)
  doc.setFont('helvetica', 'bold')
  doc.textWithLink(care, left + prefixW, y, { url: `mailto:${care}` })

  const site = countrySiteBase(data.country, data.siteBase)
  const year = new Date().getFullYear()
  let footer = 278
  doc.setDrawColor(...RULE)
  doc.setLineWidth(0.3)
  doc.line(left, footer, right, footer)
  footer += 6
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...INK)
  doc.text('Lotus Foreign Exchange Limited', left, footer)
  footer += 5
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...MUTED)
  doc.text('ABN 71 108 877 050  ·  AUSTRAC registered', left, footer)
  footer += 4.5
  doc.setTextColor(...RED)
  doc.textWithLink(site.replace(/^https:\/\//, ''), left, footer, { url: site })
  doc.setTextColor(...MUTED)
  doc.text(`© ${year} Lotus Foreign Exchange Limited`, right, footer, { align: 'right' })

  const blob = doc.output('blob')
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = receiptFileName(data.orderRef)
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1500)
}
