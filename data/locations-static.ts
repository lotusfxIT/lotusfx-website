export type StaticLocation = {
  id: string // Google location resource name: accounts/{accountId}/locations/{locationId}
  slug: string // URL-friendly id, e.g. parramatta, mt-druitt
  name: string
  country: 'AU' | 'NZ' | 'FJ'
  region: string // state / region heading
  lat: number
  lng: number
  highlight?: string
}

function slugFromName(name: string): string {
  return name
    .replace(/^Lotus Foreign Exchange - /i, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/\./g, '')
    .replace(/[^a-z0-9-]/g, '')
}

const RAW_LOCATIONS: Omit<StaticLocation, 'slug'>[] = [
  // Australia - New South Wales
  {
    id: 'accounts/104313690701494015090/locations/12518939540817423491',
    name: 'Lotus Foreign Exchange - Wetherill Park',
    country: 'AU',
    region: 'New South Wales',
    lat: 0,
    lng: 0,
  },
  {
    id: 'accounts/104313690701494015090/locations/13130010824798673308',
    name: 'Lotus Foreign Exchange - Blacktown',
    country: 'AU',
    region: 'New South Wales',
    lat: -33.7695673,
    lng: 150.9052951,
  },
  {
    id: 'accounts/104313690701494015090/locations/10906800683040503046',
    name: 'Lotus Foreign Exchange - Chinatown',
    country: 'AU',
    region: 'New South Wales',
    lat: 0,
    lng: 0,
  },
  {
    id: 'accounts/104313690701494015090/locations/10306837760007251929',
    name: 'Lotus Foreign Exchange - Parramatta',
    country: 'AU',
    region: 'New South Wales',
    lat: 0,
    lng: 0,
  },
  {
    id: 'accounts/104313690701494015090/locations/2990282587169411154',
    name: 'Lotus Foreign Exchange - Hurstville',
    country: 'AU',
    region: 'New South Wales',
    lat: 0,
    lng: 0,
  },
  {
    id: 'accounts/104313690701494015090/locations/17773939524151325362',
    name: 'Lotus Foreign Exchange - Liverpool',
    country: 'AU',
    region: 'New South Wales',
    lat: -33.9191276,
    lng: 150.923924,
  },
  {
    id: 'accounts/104313690701494015090/locations/15070626752074033699',
    name: 'Lotus Foreign Exchange - MetCentre',
    country: 'AU',
    region: 'New South Wales',
    lat: 0,
    lng: 0,
  },
  {
    id: 'accounts/104313690701494015090/locations/7342230548875094004',
    name: 'Lotus Foreign Exchange - Miranda',
    country: 'AU',
    region: 'New South Wales',
    lat: 0,
    lng: 0,
  },
  {
    id: 'accounts/104313690701494015090/locations/7256071351166819617',
    name: 'Lotus Foreign Exchange - Mt Druitt',
    country: 'AU',
    region: 'New South Wales',
    lat: -33.7679536,
    lng: 150.8166979,
  },
  {
    id: 'accounts/104313690701494015090/locations/4264840615560438091',
    name: 'Lotus Foreign Exchange - Penrith',
    country: 'AU',
    region: 'New South Wales',
    lat: 0,
    lng: 0,
  },

  // Australia - Queensland
  {
    id: 'accounts/104313690701494015090/locations/3956522009889705838',
    name: 'Lotus Foreign Exchange - Adelaide Street',
    country: 'AU',
    region: 'Queensland',
    lat: 0,
    lng: 0,
  },
  {
    id: 'accounts/104313690701494015090/locations/11183913663340871496',
    name: 'Lotus Foreign Exchange - Australia Fair',
    country: 'AU',
    region: 'Queensland',
    lat: 0,
    lng: 0,
  },
  {
    id: 'accounts/104313690701494015090/locations/17238163346074616114',
    name: 'Lotus Foreign Exchange - Brisbane City',
    country: 'AU',
    region: 'Queensland',
    lat: -27.466967,
    lng: 153.026172,
  },
  {
    id: 'accounts/104313690701494015090/locations/17718169808119934607',
    name: 'Lotus Foreign Exchange - Chermside',
    country: 'AU',
    region: 'Queensland',
    lat: 0,
    lng: 0,
  },
  {
    id: 'accounts/104313690701494015090/locations/13134528577023375876',
    name: 'Lotus Foreign Exchange - Helensvale',
    country: 'AU',
    region: 'Queensland',
    lat: -27.9284825,
    lng: 153.3362113,
  },
  {
    id: 'accounts/104313690701494015090/locations/13056039651780561480',
    name: 'Lotus Foreign Exchange - Mt. Gravatt',
    country: 'AU',
    region: 'Queensland',
    lat: -27.5626731,
    lng: 153.0832353,
  },
  {
    id: 'accounts/104313690701494015090/locations/12935916068449401546',
    name: 'Lotus Foreign Exchange - Noosa Civic',
    country: 'AU',
    region: 'Queensland',
    lat: -26.4154609,
    lng: 153.048332,
  },
  {
    id: 'accounts/104313690701494015090/locations/7995743201165198063',
    name: 'Lotus Foreign Exchange - North lakes',
    country: 'AU',
    region: 'Queensland',
    lat: -27.2400112,
    lng: 153.016219,
  },

  // Australia - Victoria
  {
    id: 'accounts/104313690701494015090/locations/9183586601513351583',
    name: 'Lotus Foreign Exchange - Dandenong Plaza',
    country: 'AU',
    region: 'Victoria',
    lat: 0,
    lng: 0,
  },
  {
    id: 'accounts/104313690701494015090/locations/12031455663408204183',
    name: 'Lotus Foreign Exchange - Swanston Street',
    country: 'AU',
    region: 'Victoria',
    lat: 0,
    lng: 0,
  },

  // Fiji
  {
    id: 'accounts/111995429804675309959/locations/12099479891229954772',
    name: 'Lotus Foreign Exchange - Lautoka',
    country: 'FJ',
    region: 'Western Fiji (Nadi & Lautoka)',
    lat: -17.604691,
    lng: 177.4550644,
  },
  {
    id: 'accounts/111995429804675309959/locations/17180439170280888306',
    name: 'Lotus Foreign Exchange - Cumming Street',
    country: 'FJ',
    region: 'Central Fiji (Suva & surrounds)',
    lat: -18.1380473,
    lng: 178.4264356,
  },
  {
    id: 'accounts/111995429804675309959/locations/9151576832452844804',
    name: 'Lotus Foreign Exchange - Navua Town',
    country: 'FJ',
    region: 'Central Fiji (Suva & surrounds)',
    lat: -18.2232475,
    lng: 178.173043,
  },
  {
    id: 'accounts/111995429804675309959/locations/16585987301565221330',
    name: 'Lotus Foreign Exchange - Ba',
    country: 'FJ',
    region: 'Western Fiji (Nadi & Lautoka)',
    lat: -17.5364405,
    lng: 177.6878099,
  },
  {
    id: 'accounts/111995429804675309959/locations/17851399325064291797',
    name: 'Lotus Foreign Exchange - Vitogo Parade',
    country: 'FJ',
    region: 'Western Fiji (Nadi & Lautoka)',
    lat: 0,
    lng: 0,
  },
  {
    id: 'accounts/111995429804675309959/locations/2836189533728662561',
    name: 'Lotus Foreign Exchange - Sigatoka',
    country: 'FJ',
    region: 'Western Fiji (Nadi & Lautoka)',
    lat: -18.1396822,
    lng: 177.5080967,
  },
  {
    id: 'accounts/111995429804675309959/locations/14707399745036511883',
    name: 'Lotus Foreign Exchange - Namaka',
    country: 'FJ',
    region: 'Western Fiji (Nadi & Lautoka)',
    lat: -17.7619589,
    lng: 177.4530648,
  },
  {
    id: 'accounts/111995429804675309959/locations/5658772464224479119',
    name: 'Lotus Foreign Exchange - Marks Street',
    country: 'FJ',
    region: 'Central Fiji (Suva & surrounds)',
    lat: 0,
    lng: 0,
  },
  {
    id: 'accounts/111995429804675309959/locations/10861798909544988105',
    name: 'Lotus Foreign Exchange - Tavua',
    country: 'FJ',
    region: 'Western Fiji (Nadi & Lautoka)',
    lat: -17.442102,
    lng: 177.864872,
  },
  {
    id: 'accounts/111995429804675309959/locations/8939646972175414169',
    name: 'Lotus Foreign Exchange - Hansons Supermarket',
    country: 'FJ',
    region: 'Western Fiji (Nadi & Lautoka)',
    lat: -18.0635397,
    lng: 178.5135928,
  },
  {
    id: 'accounts/111995429804675309959/locations/18268804620249351806',
    name: 'Lotus Foreign Exchange - Nadi Town',
    country: 'FJ',
    region: 'Western Fiji (Nadi & Lautoka)',
    lat: -17.8020215,
    lng: 177.4156621,
  },
  {
    id: 'accounts/111995429804675309959/locations/2378480200710224769',
    name: 'Lotus Foreign Exchange - Nausori',
    country: 'FJ',
    region: 'Central Fiji (Suva & surrounds)',
    lat: -18.028612,
    lng: 178.5298295,
  },
  {
    id: 'accounts/111995429804675309959/locations/8997314189164008841',
    name: 'Lotus Foreign Exchange - Savusavu',
    country: 'FJ',
    region: 'Northern Fiji (Labasa & Savusavu)',
    lat: -16.779911,
    lng: 179.338111,
  },
  {
    id: 'accounts/111995429804675309959/locations/8265787357391933548',
    name: 'Lotus Foreign Exchange - Tailevu',
    country: 'FJ',
    region: 'Central Fiji (Suva & surrounds)',
    lat: -17.810048,
    lng: 178.5431961,
  },
  {
    id: 'accounts/111995429804675309959/locations/9794402859954568292',
    name: 'Lotus Foreign Exchange - Labasa',
    country: 'FJ',
    region: 'Northern Fiji (Labasa & Savusavu)',
    lat: -16.4288348,
    lng: 179.3763182,
  },
  {
    id: 'accounts/111995429804675309959/locations/3266347126080488003',
    name: 'Lotus Foreign Exchange - Thompson Street',
    country: 'FJ',
    region: 'Central Fiji (Suva & surrounds)',
    lat: -18.1386767,
    lng: 178.4243325,
  },

  // New Zealand
  {
    id: 'accounts/101281606270379913163/locations/4109189402107854349',
    name: 'Lotus Foreign Exchange - Rotorua',
    country: 'NZ',
    region: 'Rotorua',
    lat: -38.1370986,
    lng: 176.2513149,
  },
  {
    id: 'accounts/101281606270379913163/locations/15399220289427396190',
    name: 'Lotus Foreign Exchange - Lynn Mall',
    country: 'NZ',
    region: 'Auckland Region',
    lat: -36.9070494,
    lng: 174.6861742,
  },
  {
    id: 'accounts/101281606270379913163/locations/1055726243448749938',
    name: 'Lotus Foreign Exchange - 32 Queen Street',
    country: 'NZ',
    region: 'Auckland Region',
    lat: 0,
    lng: 0,
  },
  {
    id: 'accounts/101281606270379913163/locations/7871627009262869257',
    name: 'Lotus Foreign Exchange - Papamoa',
    country: 'NZ',
    region: 'Tauranga / Papamoa',
    lat: -37.6991084,
    lng: 176.2827306,
  },
  {
    id: 'accounts/101281606270379913163/locations/4395100152396160095',
    name: 'Lotus Foreign Exchange - Manukau Mall',
    country: 'NZ',
    region: 'Auckland Region',
    lat: -36.9921422,
    lng: 174.8809911,
  },
  {
    id: 'accounts/101281606270379913163/locations/561511754992890497',
    name: 'Lotus Foreign Exchange - 210 Queen Street',
    country: 'NZ',
    region: 'Auckland Region',
    lat: 0,
    lng: 0,
  },
  {
    id: 'accounts/101281606270379913163/locations/5936606656952167782',
    name: 'Lotus Foreign Exchange - Pakuranga',
    country: 'NZ',
    region: 'Auckland Region',
    lat: -36.9128295,
    lng: 174.8718806,
  },
  {
    id: 'accounts/101281606270379913163/locations/9047346141054240249',
    name: 'Lotus Foreign Exchange - Porirua',
    country: 'NZ',
    region: 'Wellington & Porirua',
    lat: 0,
    lng: 0,
  },
  {
    id: 'accounts/101281606270379913163/locations/6996198146849158629',
    name: 'Lotus Foreign Exchange - Northlands Mall',
    country: 'NZ',
    region: 'Christchurch Region',
    lat: -43.4924361,
    lng: 172.6102518,
  },
  {
    id: 'accounts/101281606270379913163/locations/12583915555852293404',
    name: 'Lotus Foreign Exchange - Browns Bay',
    country: 'NZ',
    region: 'Auckland Region',
    lat: -36.7158516,
    lng: 174.7484176,
  },
  {
    id: 'accounts/101281606270379913163/locations/7005436338423933889',
    name: 'Lotus Foreign Exchange - Mt Roskill',
    country: 'NZ',
    region: 'Auckland Region',
    lat: 0,
    lng: 0,
  },
  {
    id: 'accounts/101281606270379913163/locations/6862666539683779092',
    name: 'Lotus Foreign Exchange - Hamilton',
    country: 'NZ',
    region: 'Hamilton',
    lat: 0,
    lng: 0,
  },
  {
    id: 'accounts/101281606270379913163/locations/8623337224900427359',
    name: 'Lotus Foreign Exchange - St Lukes Mall',
    country: 'NZ',
    region: 'Auckland Region',
    lat: -36.8832533,
    lng: 174.7346169,
  },
  {
    id: 'accounts/101281606270379913163/locations/1950226215444274309',
    name: 'Lotus Foreign Exchange - 115 Queen Street',
    country: 'NZ',
    region: 'Auckland Region',
    lat: -36.8462515,
    lng: 174.7659561,
  },
  {
    id: 'accounts/101281606270379913163/locations/2862039614852326464',
    name: 'Lotus Foreign Exchange - Sylvia Park',
    country: 'NZ',
    region: 'Auckland Region',
    lat: 0,
    lng: 0,
  },
  {
    id: 'accounts/101281606270379913163/locations/18017016275765133272',
    name: 'Lotus Foreign Exchange - Hunters Corner',
    country: 'NZ',
    region: 'Auckland Region',
    lat: 0,
    lng: 0,
  },
  {
    id: 'accounts/101281606270379913163/locations/17866897294979530607',
    name: 'Lotus Foreign Exchange - 220 Queen Street',
    country: 'NZ',
    region: 'Auckland Region',
    lat: 0,
    lng: 0,
  },
  {
    id: 'accounts/101281606270379913163/locations/5042273650969157383',
    name: 'Lotus Foreign Exchange - Riccarton',
    country: 'NZ',
    region: 'Christchurch Region',
    lat: 0,
    lng: 0,
  },
]

const seen = new Set<string>()
export const STATIC_LOCATIONS: StaticLocation[] = RAW_LOCATIONS.map((loc) => {
  let slug = slugFromName(loc.name)
  if (seen.has(slug)) {
    let i = 2
    while (seen.has(`${slug}-${i}`)) i++
    slug = `${slug}-${i}`
  }
  seen.add(slug)
  return { ...loc, slug }
})

