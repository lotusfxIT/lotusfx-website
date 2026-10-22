import { NextRequest, NextResponse } from 'next/server'
import { canAccessCountry, canAccessModule, getAdminSession, filterBySessionCountry } from '@/lib/admin-auth'
import { deleteMessage, getMessage, listMessages, saveMessage } from '@/lib/messages'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const session = getAdminSession(request)
  if (!session || !canAccessModule(session, 'messages')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const messages = filterBySessionCountry(await listMessages(), session)
    return NextResponse.json({ messages, canDelete: session.role === 'full' })
  } catch (error) {
    console.error('[admin/messages] list error', error)
    return NextResponse.json({ error: 'Could not load messages' }, { status: 500 })
  }
}

/** Body: { id, status: 'new' | 'handled', note? } or { id, action: 'delete' } */
export async function POST(request: NextRequest) {
  const session = getAdminSession(request)
  if (!session || !canAccessModule(session, 'messages')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json().catch(() => ({}))
  const message = await getMessage(String(body.id || ''))
  if (!message || !canAccessCountry(session, message.country)) {
    return NextResponse.json({ error: 'Message not found' }, { status: 404 })
  }

  if (body.action === 'delete') {
    if (session.role !== 'full') {
      return NextResponse.json({ error: 'Only the full admin can delete messages.' }, { status: 403 })
    }
    await deleteMessage(message.id)
    return NextResponse.json({ success: true, deleted: message.id })
  }

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
