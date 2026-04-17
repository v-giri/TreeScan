import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AnalyzeRequest {
  imageBase64: string
  mimeType: string
  userId: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const respond = (data: object) =>
    new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return respond({ error: 'No authorization header — please log in again.' })
    }

    const { imageBase64, mimeType } = await req.json() as AnalyzeRequest

    const PLANT_ID_KEY = Deno.env.get('PLANT_ID_KEY') || ''
    const GEMINI_KEY = Deno.env.get('GEMINI_KEY') || ''

    if (!PLANT_ID_KEY) return respond({ error: 'Server config error: PLANT_ID_KEY not set.' })
    if (!GEMINI_KEY) return respond({ error: 'Server config error: GEMINI_KEY not set.' })

    // --- Step 1: Plant.id v3 — details as URL query param ---
    const plantIdUrl = 'https://api.plant.id/v3/identification?details=common_names,taxonomy,description&disease_details=common_names,description'
    const plantIdRes = await fetch(plantIdUrl, {
      method: 'POST',
      headers: { 'Api-Key': PLANT_ID_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        images: [`data:${mimeType};base64,${imageBase64}`],
        health: 'all',
        classification_level: 'species',
      }),
    })

    const plantIdText = await plantIdRes.text()
    console.log(`[analyze-plant] Plant.id status: ${plantIdRes.status}`)
    console.log(`[analyze-plant] Plant.id response: ${plantIdText.slice(0, 800)}`)

    if (!plantIdRes.ok) {
      return respond({ error: `Plant.id error (${plantIdRes.status}): ${plantIdText}` })
    }

    const plantIdData = JSON.parse(plantIdText)
    const result = plantIdData.result || {}

    // Classification
    const topSuggestion = result.classification?.suggestions?.[0]
    const scientificName: string = topSuggestion?.name || 'Unknown Plant'
    const commonNames: string[] = topSuggestion?.details?.common_names || []
    const commonName: string = commonNames[0] || scientificName
    const confidence: number = Math.round((topSuggestion?.probability || 0) * 100)
    const family: string = topSuggestion?.details?.taxonomy?.family || 'Unknown family'

    // Health
    const isHealthyProb: number = result.is_healthy?.probability ?? 0.5
    const isHealthy = isHealthyProb > 0.65

    // Diseases — filter out the generic "Healthy plant" entry Plant.id includes
    const diseaseSuggestions = result.disease?.suggestions || []
    console.log(`[analyze-plant] raw disease suggestions: ${JSON.stringify(diseaseSuggestions.slice(0, 5))}`)

    const SKIP_NAMES = ['healthy', 'healthy plant', 'not a plant', 'plant']
    const diseases: string[] = diseaseSuggestions
      .filter((d: { probability: number; name: string }) => {
        if (d.probability < 0.15) return false
        const lc = (d.name || '').toLowerCase().trim()
        return !SKIP_NAMES.includes(lc)
      })
      .map((d: { name: string; probability: number; details?: { common_names?: string[] } }) => {
        const displayName = (d.details?.common_names?.[0]) || d.name || 'Unknown issue'
        return `${displayName} (${Math.round(d.probability * 100)}%)`
      })

    const health = isHealthy ? 'healthy' : diseases.length > 1 ? 'critical' : 'warning'

    console.log(`[analyze-plant] Plant: ${commonName} / ${scientificName}, health: ${health}, diseases: [${diseases.join(', ')}]`)

    // --- Step 2: Gemini for personalised care plan ---
    const prompt = `You are a plant care expert. Analyze this plant health data and provide specific, actionable advice.

Plant identified: ${commonName} (${scientificName})
Identification confidence: ${confidence}%
Health probability: ${Math.round(isHealthyProb * 100)}%
Diseases/Issues detected: ${diseases.length > 0 ? diseases.join(', ') : 'none detected'}

Return ONLY valid JSON (no markdown, no code blocks, no explanations):
{
  "treatments": ["specific treatment step 1 for this plant", "step 2", "step 3", "step 4"],
  "careProfile": {
    "watering": "specific watering frequency for ${commonName}",
    "sunlight": "specific sunlight needs for ${commonName}",
    "soil": "specific soil type for ${commonName}",
    "fertilizer": "specific fertilizer schedule for ${commonName}"
  },
  "summary": "Two specific sentences describing THIS plant's health condition based on the scan.",
  "funFact": "One interesting fact specifically about ${commonName}.",
  "urgency": "${health === 'critical' ? 'high' : health === 'warning' ? 'medium' : 'low'}"
}`

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { response_mime_type: 'application/json', temperature: 0.4 },
        }),
      }
    )

    let geminiData = {
      treatments: [
        `Monitor ${commonName} regularly for changes.`,
        'Ensure proper watering — avoid overwatering.',
        'Provide appropriate light levels.',
        'Check for pests regularly.'
      ],
      careProfile: {
        watering: 'Check soil moisture before watering',
        sunlight: 'Indirect bright light',
        soil: 'Well-draining potting mix',
        fertilizer: 'Monthly during growing season',
      },
      summary: `Your ${commonName} has been analyzed. Health probability is ${Math.round(isHealthyProb * 100)}%.`,
      funFact: `${commonName} is a fascinating plant species.`,
      urgency: health === 'critical' ? 'high' : health === 'warning' ? 'medium' : 'low',
    }

    if (geminiRes.ok) {
      const geminiJson = await geminiRes.json()
      const text = geminiJson.candidates?.[0]?.content?.parts?.[0]?.text
      if (text) {
        try {
          const parsed = JSON.parse(text)
          geminiData = parsed
          console.log('[analyze-plant] Gemini parsed successfully')
        } catch (e) {
          console.error('[analyze-plant] Gemini JSON parse failed:', String(e), '| raw:', text.slice(0, 200))
        }
      } else {
        console.error('[analyze-plant] Gemini empty response:', JSON.stringify(geminiJson).slice(0, 200))
      }
    } else {
      const geminiErr = await geminiRes.text()
      console.error(`[analyze-plant] Gemini error (${geminiRes.status}): ${geminiErr.slice(0, 200)}`)
    }

    return respond({
      commonName,
      scientificName,
      family,
      confidence,
      health,
      problems: diseases,
      treatments: geminiData.treatments || [],
      careProfile: geminiData.careProfile || {},
      summary: geminiData.summary || '',
      funFact: geminiData.funFact || '',
      urgency: geminiData.urgency || 'low',
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[analyze-plant] Unhandled exception:', message)
    return respond({ error: `Server error: ${message}` })
  }
})
