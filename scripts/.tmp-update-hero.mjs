import fs from 'fs'
import os from 'os'
import path from 'path'

const base = 'https://stafflotusfx.com'
const login = fs.readFileSync(path.join(os.homedir(), 'Desktop', 'LOTUSFX_ADMIN_LOGIN.txt'), 'utf8')
const email = login.match(/Email:\s*(\S+)/)[1]
const password = login.match(/Password:\s*(\S+)/)[1]
const { token } = await (await fetch(`${base}/api/admin/auth`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
})).json()
const auth = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

const stats = await (await fetch(`${base}/api/admin/stats`, { headers: auth })).json()
Object.assign(stats.hero, {
  featureCurrencies: '30+ currencies available',
  featureTransfers: 'Send money to 200+ countries',
  featurePartners: 'Global partners: MoneyGram & Western Union',
  featureTrusted: 'Trusted since 2002',
  featureEwire: 'Lotus eWire transfers between Australia, New Zealand & Fiji',
  featureLiveRates: 'Live rates on our website & app',
})
const r = await (await fetch(`${base}/api/admin/stats`, { method: 'POST', headers: auth, body: JSON.stringify(stats) })).json()
console.log('stats saved:', r.success)

const subtitle =
  'Market-leading exchange rates, no commission on currency exchange, and 50+ locations across Australia, New Zealand and Fiji.'
for (const c of ['AU', 'NZ', 'FJ']) {
  const content = await (await fetch(`${base}/api/content/${c}`)).json()
  content.heroSubtitle = subtitle
  const res = await (await fetch(`${base}/api/content/${c}`, { method: 'POST', headers: auth, body: JSON.stringify(content) })).json()
  console.log(c, 'saved:', res.success, '| flag/rating:', content.flag, content.rating)
}

const live = await (await fetch(`${base}/api/site-stats?t=${Date.now()}`)).json()
console.log('live rating:', live.customerRating, '| bullets:', JSON.stringify(live.hero))
