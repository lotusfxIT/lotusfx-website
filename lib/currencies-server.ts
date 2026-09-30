import path from 'path'
import fs from 'fs'
import type { CurrenciesDenominationsFile } from '@/lib/currencies'
import { normalizeCurrenciesFile } from '@/lib/currencies'
import { readAdminJson, writeAdminJson } from '@/lib/admin-json-store'
import defaultData from '@/data/currencies-denominations.json'

export const CURRENCIES_RELATIVE = 'public/currencies-denominations.json'

const DEFAULT_FILE = normalizeCurrenciesFile(defaultData as CurrenciesDenominationsFile)

function bundledFallback(): CurrenciesDenominationsFile {
  try {
    const file = path.join(process.cwd(), CURRENCIES_RELATIVE)
    if (fs.existsSync(file)) {
      return normalizeCurrenciesFile(JSON.parse(fs.readFileSync(file, 'utf-8')))
    }
  } catch {
    // ignore
  }
  return DEFAULT_FILE
}

export function getDefaultCurrenciesFile(): CurrenciesDenominationsFile {
  return DEFAULT_FILE
}

export async function readCurrenciesFile(): Promise<CurrenciesDenominationsFile> {
  const data = await readAdminJson<CurrenciesDenominationsFile>(
    CURRENCIES_RELATIVE,
    bundledFallback()
  )
  return normalizeCurrenciesFile(data)
}

export async function writeCurrenciesFile(data: CurrenciesDenominationsFile) {
  const next = normalizeCurrenciesFile(data)
  return writeAdminJson(CURRENCIES_RELATIVE, next)
}
