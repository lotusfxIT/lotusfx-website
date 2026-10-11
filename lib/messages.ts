import crypto from 'crypto'
import { getRecord, listRecords, saveRecord } from '@/lib/records-store'

const PREFIX = 'messages'

export type MessageRecord = {
  id: string
  createdAt: string
  country: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  emailedTo?: string
  emailStatus: 'sent' | 'failed' | 'not-configured'
  status: 'new' | 'handled'
  handledAt?: string
  note?: string
}

export function newMessageId(): string {
  const now = new Date().toISOString()
  return `MSG-${now.slice(0, 10).replace(/-/g, '')}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
}

export const saveMessage = (m: MessageRecord) => saveRecord(PREFIX, m.id, m)
export const getMessage = (id: string) => getRecord<MessageRecord>(PREFIX, id)
export const listMessages = () => listRecords<MessageRecord>(PREFIX)
