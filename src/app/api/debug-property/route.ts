import { getProperty } from '@/app/actions/property'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' })

  const property = await getProperty(id)
  return NextResponse.json({ property })
}
