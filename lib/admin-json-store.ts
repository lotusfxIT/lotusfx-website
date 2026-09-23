import fs from 'fs'
import path from 'path'
import { head, put } from '@vercel/blob'

export type PersistResult =
  | { ok: true; method: 'fs' | 'blob' }
  | { ok: false; error: string; data: unknown }

function hasBlobToken() {
  return !!process.env.BLOB_READ_WRITE_TOKEN
}

function localPath(relativePath: string) {
  return path.join(process.cwd(), relativePath)
}

/** Read JSON from Vercel Blob (production) or local filesystem (dev). */
export async function readAdminJson<T>(relativePath: string, fallback: T): Promise<T> {
  const blobPath = relativePath.replace(/^public\//, '')

  if (hasBlobToken()) {
    try {
      const meta = await head(blobPath)
      const res = await fetch(meta.url, { cache: 'no-store' })
      if (res.ok) {
        return (await res.json()) as T
      }
    } catch {
      // Fall through to filesystem / defaults
    }
  }

  try {
    const file = localPath(relativePath)
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf-8')) as T
    }
  } catch (error) {
    console.error(`[admin-json] read ${relativePath}:`, error)
  }

  return fallback
}

/** Write JSON to Blob when available, otherwise filesystem. */
export async function writeAdminJson(
  relativePath: string,
  data: unknown
): Promise<PersistResult> {
  const blobPath = relativePath.replace(/^public\//, '')
  const body = JSON.stringify(data, null, 2)

  if (hasBlobToken()) {
    try {
      await put(blobPath, body, {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'application/json',
      })
      // Best-effort local mirror for builds / downloads
      try {
        const file = localPath(relativePath)
        fs.mkdirSync(path.dirname(file), { recursive: true })
        fs.writeFileSync(file, body, 'utf-8')
      } catch {
        // ignore local mirror failures on serverless
      }
      return { ok: true, method: 'blob' }
    } catch (error) {
      console.error(`[admin-json] blob write ${relativePath}:`, error)
      return {
        ok: false,
        error: `Blob write failed: ${error instanceof Error ? error.message : 'unknown error'}`,
        data,
      }
    }
  }

  try {
    const file = localPath(relativePath)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, body, 'utf-8')
    return { ok: true, method: 'fs' }
  } catch (error) {
    console.error(`[admin-json] fs write ${relativePath}:`, error)
    return {
      ok: false,
      error:
        'Could not save on this server (Vercel filesystem is read-only). Create a Vercel Blob store for this project (Storage → Blob → Create), then redeploy — or save on localhost and commit the JSON file.',
      data,
    }
  }
}
