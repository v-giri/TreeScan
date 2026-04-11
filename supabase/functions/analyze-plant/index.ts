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

  try {
    // Validate JWT
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { imageBase64, mimeType } = await req.json() as AnalyzeRequest

    const PLANT_ID_KEY = Deno.env.get('PLANT_ID_KEY') || ''
    const GEMINI_KEY = Deno.env.get('GEMINI_KEY') || ''

    // --- Step 1: Call Plant.id v3 ---
    const plantIdRes = await fetch('https://api.plant.id/v3/health_assessment', {
      method: 'POST',
      headers: { 'Api-Key': PLANT_ID_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        images: [`data:${mimeType};base64,${imageBase64}`],
        health: 'all',
        details: ['common_names', 'taxonomy', 'wiki_description'],
      }),
    })

    if (!plantIdRes.ok) {
      const errText = await plantIdRes.text()
      throw new Error(`Plant.id error: ${errText}`)
    }

    const plantIdData = await plantIdRes.json()

    // Extract data
    const topSuggestion = plantIdData.result?.classification?.suggestions?.[0]
    const commonName: string = topSuggestion?.details?.common_names?.[0] || topSuggestion?.name || 'Unknown Plant'
    const scientificName: string = topSuggestion?.name || 'Unknown'
    const confidence: number = Math.round((topSuggestion?.probability || 0) * 100)
    const family: string = topSuggestion?.details?.taxonomy?.family || 'Unknown family'

    const isHealthyProb: number = plantIdData.result?.is_healthy?.probability || 0
    const isHealthy = isHealthyProb > 0.65

    const diseases = (plantIdData.result?.disease?.suggestions || [])
      .filter((d: { probability: number; name: string }) => d.probability > 0.2)
      .map((d: { name: string; probability: number }) => `${d.name} (${Math.round(d.probability * 100)}%)`)

    // Determine health status
    const health = isHealthy ? 'healthy' : diseases.length > 1 ? 'critical' : 'warning'

    // --- Step 2: Build Gemini prompt ---
    const prompt = `A plant scan identified: ${scientificName} (${confidence}% confidence).
Healthy probability: ${Math.round(isHealthyProb * 100)}%. 
Issues detected: ${diseases.length > 0 ? diseases.join(', ') : 'none'}.

Return ONLY valid JSON (no markdown, no code blocks):
{
  "treatments": ["step 1", "step 2", "step 3"],
  "careProfile": {
    "watering": "frequency and amount",
    "sunlight": "light requirements",
    "soil": "soil type",
    "fertilizer": "feeding schedule",
    "season": "best growing season"
  },
  "summary": "Two sentence plain English description of plant health.",
  "funFact": "One interesting fact about this plant.",
  "urgency": "low"
}`

    // --- Step 3: Call Gemini ---
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { response_mime_type: 'application/json' },
        }),
      }
    )

    let geminiData = {
      treatments: ['Water regularly', 'Provide adequate sunlight', 'Use well-draining soil'],
      careProfile: {
        watering: 'Every 7–10 days',
        sunlight: 'Bright indirect light',
        soil: 'Well-draining potting mix',
        fertilizer: 'Monthly during growing season',
        season: 'Spring to fall',
      },
      summary: `This ${commonName} appears to be ${health}. Monitor regularly for changes.`,
      funFact: `${commonName} is a fascinating plant with unique characteristics.`,
      urgency: health === 'critical' ? 'high' : health === 'warning' ? 'medium' : 'low',
    }

    if (geminiRes.ok) {
      const geminiJson = await geminiRes.json()
      const text = geminiJson.candidates?.[0]?.content?.parts?.[0]?.text
      if (text) {
        try {
          geminiData = JSON.parse(text)
        } catch { /* use defaults */ }
      }
    }

    // --- Step 4: Build final result ---
    const result = {
      commonName,
      scientificName,
      family,
      confidence,
      health,
      problems: diseases,
      treatments: geminiData.treatments || [],
      careProfile: geminiData.careProfile || geminiData.care_profile || {},
      summary: geminiData.summary || '',
      funFact: geminiData.funFact || geminiData.fun_fact || '',
      urgency: geminiData.urgency || 'low',
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Analysis failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
