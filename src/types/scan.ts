export type HealthStatus = 'healthy' | 'warning' | 'critical'
export type UrgencyLevel = 'low' | 'medium' | 'high'

export interface CareProfile {
  watering: string
  sunlight: string
  soil: string
  fertilizer: string
  season: string
}

export interface ScanResult {
  commonName: string
  scientificName: string
  family: string
  confidence: number
  health: HealthStatus
  problems: string[]
  treatments: string[]
  careProfile: CareProfile
  summary: string
  funFact: string
  urgency: UrgencyLevel
}

export interface ScanRecord {
  id: string
  user_id: string
  image_url: string | null
  common_name: string
  scientific_name: string
  family: string
  confidence: number
  health_status: HealthStatus
  problems: string[]
  treatments: string[]
  care_profile: CareProfile
  summary: string
  fun_fact: string
  urgency: UrgencyLevel
  created_at: string
}

export interface GardenItem {
  id: string
  user_id: string
  scan_id: string
  nickname: string | null
  notes: string | null
  saved_at: string
  scan?: ScanRecord
}
