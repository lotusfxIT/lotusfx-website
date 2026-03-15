// Centralized statistics configuration
// Edit these values in one place and they'll update everywhere across the website

export const STATS = {
  // Customer counts by country
  customers: {
    fiji: '260,000+',
    australia: '100,000+',
    newZealand: '200,000+',
    total: '560,000+', // Sum of all countries
  },

  // Branch counts by country
  branches: {
    fiji: '16',
    australia: '20',
    newZealand: '18',
    total: '54', // Sum of all countries
  },

  // Other key statistics
  yearsOfExcellence: '15+',
  totalTransferred: '$2.4B+',
  
  // Contact emails by country
  emails: {
    fiji: 'fjcustomercare@lotusfx.com',
    australia: 'aucustomercare@lotusfx.com',
    newZealand: 'nzcustomercare@lotusfx.com',
  },

  // Business hours by country
  businessHours: {
    fiji: 'Mon-Fri: 9am-5pm FJT',
    australia: 'Mon-Fri: 9am-5pm AEST',
    newZealand: 'Mon-Fri: 9am-5pm NZST',
  },
}

// Helper function to get country-specific stats
export function getCountryStats(country: 'fiji' | 'australia' | 'newZealand') {
  return {
    customers: STATS.customers[country],
    branches: STATS.branches[country],
    email: STATS.emails[country],
    businessHours: STATS.businessHours[country],
  }
}

