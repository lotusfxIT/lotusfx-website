import fs from 'fs'

const coords = {
  'Lotus Foreign Exchange - Wetherill Park': [-33.848305, 150.8996],
  'Lotus Foreign Exchange - Chinatown': [-33.878029, 151.204011],
  'Lotus Foreign Exchange - Parramatta': [-33.813553, 151.00342],
  'Lotus Foreign Exchange - Hurstville': [-33.959682, 151.09985],
  'Lotus Foreign Exchange - MetCentre': [-33.86477, 151.206776],
  'Lotus Foreign Exchange - Miranda': [-34.03415, 151.10236],
  'Lotus Foreign Exchange - Penrith': [-33.750546, 150.69444],
  'Lotus Foreign Exchange - Adelaide Street': [-27.467666, 153.025491],
  'Lotus Foreign Exchange - Australia Fair': [-27.970743, 153.415017],
  'Lotus Foreign Exchange - Chermside': [-27.385965, 153.031],
  'Lotus Foreign Exchange - Dandenong Plaza': [-37.988117, 145.21445],
  'Lotus Foreign Exchange - Swanston Street': [-37.817731, 144.971407],
  'Lotus Foreign Exchange - Vitogo Parade': [-17.598539, 177.465672],
  'Lotus Foreign Exchange - Marks Street': [-18.135982, 178.442814],
  'Lotus Foreign Exchange - 32 Queen Street': [-36.844956, 174.766943],
  'Lotus Foreign Exchange - 210 Queen Street': [-36.848837, 174.765597],
  'Lotus Foreign Exchange - Porirua': [-41.135414, 174.84048],
  'Lotus Foreign Exchange - Mt Roskill': [-36.90296, 174.74228],
  'Lotus Foreign Exchange - Hamilton': [-37.78454, 175.27705],
  'Lotus Foreign Exchange - Sylvia Park': [-36.92369, 174.836196],
  'Lotus Foreign Exchange - Hunters Corner': [-36.970471, 174.861429],
  'Lotus Foreign Exchange - 220 Queen Street': [-36.849304, 174.765469],
  'Lotus Foreign Exchange - Riccarton': [-43.529762, 172.59978],
}

let src = fs.readFileSync('./data/locations-static.ts', 'utf8')
let updated = 0

for (const [name, [lat, lng]] of Object.entries(coords)) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(
    `(name: '${escaped}',\\s*country: '[A-Z]{2}',\\s*region: '[^']+',\\s*)lat: 0,\\s*lng: 0,`
  )
  const next = src.replace(re, (_, p1) => {
    updated++
    return `${p1}lat: ${lat},\n    lng: ${lng},`
  })
  if (next === src) console.log('NO MATCH', name)
  src = next
}

fs.writeFileSync('./data/locations-static.ts', src)
console.log('updated', updated)

const still = [...src.matchAll(/name: '([^']+)'[\s\S]*?lat: 0,\s*lng: 0,/g)].map((m) => m[1])
console.log('still missing', still.length, still)
