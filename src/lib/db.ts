import Dexie, { type Table } from 'dexie'
import type { ScanRecord } from '@/types/scan'

interface CachedScan {
  id: string
  scanData: ScanRecord
  cachedAt: number
}

interface PendingUpload {
  id: string
  imageBase64: string
  createdAt: number
}

class TreeScanDB extends Dexie {
  cachedScans!: Table<CachedScan, string>
  pendingUploads!: Table<PendingUpload, string>

  constructor() {
    super('TreeScanDB')
    this.version(1).stores({
      cachedScans: 'id, cachedAt',
      pendingUploads: 'id, createdAt',
    })
  }
}

const db = new TreeScanDB()
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

export async function getCachedScan(id: string): Promise<ScanRecord | null> {
  const cached = await db.cachedScans.get(id)
  if (!cached) return null
  if (Date.now() - cached.cachedAt > CACHE_TTL) {
    await db.cachedScans.delete(id)
    return null
  }
  return cached.scanData
}

export async function setCachedScan(id: string, scanData: ScanRecord): Promise<void> {
  await db.cachedScans.put({ id, scanData, cachedAt: Date.now() })
}

export async function getAllCachedScans(): Promise<ScanRecord[]> {
  const now = Date.now()
  const valid = await db.cachedScans.filter(c => now - c.cachedAt < CACHE_TTL).toArray()
  return valid.map(c => c.scanData)
}

export default db
