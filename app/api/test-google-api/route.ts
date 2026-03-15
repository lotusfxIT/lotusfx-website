import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test if we can reach Google APIs at all
    const testResponse = await fetch('https://www.googleapis.com/discovery/v1/apis', {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!testResponse.ok) {
      return NextResponse.json({ 
        error: 'Cannot reach Google APIs',
        status: testResponse.status,
        details: await testResponse.text()
      }, { status: testResponse.status })
    }

    const discoveryData = await testResponse.json()
    
    // Look for My Business related APIs
    const myBusinessApis = discoveryData.items?.filter((api: any) => 
      api.name?.toLowerCase().includes('mybusiness') || 
      api.name?.toLowerCase().includes('business')
    ) || []

    return NextResponse.json({
      message: 'Google APIs are reachable',
      myBusinessApis: myBusinessApis.map((api: any) => ({
        name: api.name,
        title: api.title,
        version: api.version,
        discoveryRestUrl: api.discoveryRestUrl
      })),
      totalApis: discoveryData.items?.length || 0
    })

  } catch (error) {
    return NextResponse.json({ 
      error: 'Error testing Google APIs',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
