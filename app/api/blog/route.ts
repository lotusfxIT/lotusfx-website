import { NextResponse } from 'next/server'

// Sample blog posts - in production, these would come from a database
const SAMPLE_POSTS = [
  {
    id: '1',
    title: 'How to Get the Best Currency Exchange Rates',
    slug: 'best-currency-exchange-rates',
    excerpt: 'Learn insider tips and tricks to maximize your money when exchanging currencies.',
    content: `
      <h2>Understanding Exchange Rates</h2>
      <p>Currency exchange rates fluctuate constantly based on market conditions. Here are key factors that affect rates:</p>
      <ul>
        <li>Supply and demand in the forex market</li>
        <li>Interest rate differentials between countries</li>
        <li>Economic indicators and inflation rates</li>
        <li>Political stability and economic news</li>
      </ul>
      
      <h2>Tips for Better Rates</h2>
      <p>1. <strong>Exchange during business hours</strong> - Rates are typically better during peak trading hours.</p>
      <p>2. <strong>Avoid airport exchanges</strong> - Airport rates are usually 10-15% worse than city rates.</p>
      <p>3. <strong>Compare providers</strong> - Different providers offer different rates. Always compare before exchanging.</p>
      <p>4. <strong>Exchange larger amounts</strong> - Bulk exchanges often come with better rates.</p>
      <p>5. <strong>Monitor the market</strong> - Use rate tracking tools to find the best time to exchange.</p>
      
      <h2>When to Exchange</h2>
      <p>The best time to exchange currency depends on your specific situation, but generally:</p>
      <ul>
        <li>Exchange when rates are favorable for your currency pair</li>
        <li>Avoid exchanging during major economic announcements</li>
        <li>Consider locking in rates if you're planning a trip months in advance</li>
      </ul>
    `,
    author: 'John Smith',
    publishedAt: '2024-01-15',
    image: '/images/blog-1.jpg',
    category: 'Tips',
    readTime: 5,
    metaDescription: 'Discover proven strategies to get the best currency exchange rates and save money on international transactions.',
  },
  {
    id: '2',
    title: 'International Money Transfer Guide',
    slug: 'international-money-transfer-guide',
    excerpt: 'Everything you need to know about sending money internationally safely and affordably.',
    content: `
      <h2>Methods of International Money Transfer</h2>
      <p>There are several ways to send money internationally, each with its own advantages:</p>
      
      <h3>Bank Transfers</h3>
      <p>Traditional but often expensive. Banks typically charge high fees and offer poor exchange rates.</p>
      
      <h3>Money Transfer Services</h3>
      <p>Companies like Western Union and MoneyGram offer fast transfers but with higher fees.</p>
      
      <h3>Online Transfer Services</h3>
      <p>Modern solutions like Wise and Remitly offer competitive rates and lower fees.</p>
      
      <h2>Safety Tips</h2>
      <ul>
        <li>Always verify recipient details before sending</li>
        <li>Use established, regulated services</li>
        <li>Keep transaction records for your records</li>
        <li>Be aware of daily transfer limits</li>
      </ul>
    `,
    author: 'Sarah Johnson',
    publishedAt: '2024-01-10',
    image: '/images/blog-2.jpg',
    category: 'Guide',
    readTime: 7,
    metaDescription: 'Complete guide to international money transfers with safety tips and cost-saving strategies.',
  },
  {
    id: '3',
    title: 'Currency Exchange for Travelers',
    slug: 'currency-exchange-travelers',
    excerpt: 'Smart currency exchange strategies for your next international trip.',
    content: `
      <h2>Before You Travel</h2>
      <p>Preparation is key to getting good exchange rates while traveling:</p>
      <ul>
        <li>Research the currency and current exchange rates</li>
        <li>Notify your bank of your travel dates</li>
        <li>Exchange some currency before you leave</li>
        <li>Carry multiple payment methods</li>
      </ul>
      
      <h2>While Traveling</h2>
      <p>Use ATMs in the destination country for better rates than exchanging cash at the airport.</p>
      <p>Credit cards are often the best option for large purchases, but watch out for foreign transaction fees.</p>
    `,
    author: 'Mike Chen',
    publishedAt: '2024-01-05',
    image: '/images/blog-3.jpg',
    category: 'Travel',
    readTime: 4,
    metaDescription: 'Essential currency exchange tips for travelers to save money and avoid common mistakes.',
  },
]

export async function GET() {
  try {
    // In production, fetch from database
    // const posts = await db.blogPosts.findAll()
    
    return NextResponse.json({
      posts: SAMPLE_POSTS,
      total: SAMPLE_POSTS.length,
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

