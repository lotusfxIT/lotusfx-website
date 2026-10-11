import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/admin-auth'
import { getMessage, listMessages, saveMessage } from '@/lib/messages'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    return NextResponse.json({ messages: await listMessages() })
  } catch (error) {
    console.error('[admin/messages] list error', error)
    return NextResponse.json({ error: 'Could not load messages' }, { status: 500 })
  }
}

/** Body: { id, status: 'new' | 'handled', note? } */
export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json().catch(() => ({}))
  const message = await getMessage(String(body.id || ''))
  if (!message) return NextResponse.json({ error: 'Message not found' }, { status: 404 })
  const status = body.status === 'handled' ? 'handled' : 'new'
  const updated = {
    ...message,
    status,
    handledAt: status === 'handled' ? new Date().toISOString() : undefined,
    note: typeof body.note === 'string' ? body.note.slice(0, 1000) : message.note,
  } as const
  await saveMessage(updated)
  return NextResponse.json({ success: true, message: updated })
}
