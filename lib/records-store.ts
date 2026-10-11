import fs from 'fs'
import path from 'path'
import { get, list, put } from '@vercel/blob'

/**
 * One private JSON blob per record (orders/, messages/). Private blobs are only
 * readable with the server token, so customer details never become public URLs.
 * Falls back to a local .data/ folder in development.
 */

function blobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN || undefined
}

function localDir(prefix: string) {
  return path.join(process.cwd(), '.data', prefix)
}

function safeId(id: string) {
  return id.replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 80)
}

async function readStream(stream: ReadableStream<Uint8Array>): Promise<string> {
  return new Response(stream).text()
}

export async function saveRecord<T>(prefix: string, id: string, data: T): Promise<void> {
  const key = `${prefix}/${safeId(id)}.json`
  const body = JSON.stringify(data, null, 2)
  const token = blobToken()
  if (token) {
    await put(key, body, {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json; charset=utf-8',
      token,
    })
    return
  }
  const dir = localDir(prefix)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, `${safeId(id)}.json`), body, 'utf-8')
}

export async function getRecord<T>(prefix: string, id: string): Promise<T | null> {
  const key = `${prefix}/${safeId(id)}.json`
  const token = blobToken()
  if (token) {
    try {
      const result = await get(key, { access: 'private', useCache: false, token })
      if (result?.statusCode === 200 && result.stream) {
        return JSON.parse(await readStream(result.stream)) as T
      }
    } catch (error) {
      console.error(`[records] get ${key}:`, error)
    }
    return null
  }
  const file = path.join(localDir(prefix), `${safeId(id)}.json`)
  return fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, 'utf-8')) as T) : null
}

export async function listRecords<T extends { createdAt: string }>(
  prefix: string,
  limit = 300
): Promise<T[]> {
  const token = blobToken()
  let records: T[] = []
  if (token) {
    const keys: string[] = []
    let cursor: string | undefined
    do {
      const page = await list({ prefix: `${prefix}/`, cursor, limit: 1000, token })
      keys.push(...page.blobs.map((b) => b.pathname))
      cursor = page.hasMore ? page.cursor : undefined
    } while (cursor && keys.length < 5000)

    const ids = keys.map((k) => k.slice(prefix.length + 1).replace(/\.json$/, ''))
    for (let i = 0; i < ids.length; i += 20) {
      const batch = await Promise.all(ids.slice(i, i + 20).map((id) => getRecord<T>(prefix, id)))
      records.push(...(batch.filter(Boolean) as T[]))
    }
  } else {
    const dir = localDir(prefix)
    if (fs.existsSync(dir)) {
      records = fs
        .readdirSync(dir)
        .filter((f) => f.endsWith('.json'))
        .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8')) as T)
    }
  }
  return records.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit)
}
