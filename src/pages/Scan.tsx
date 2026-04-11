import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, Camera } from 'lucide-react'
import { BottomNav } from '@/components/ui/BottomNav'
import { Button } from '@/components/ui/Button'

type TabType = 'camera' | 'upload'

export function Scan() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('upload')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleAnalyze = () => {
    if (!selectedFile) return
    // Navigate to result page with mock ID for now
    navigate('/result/demo')
  }

  return (
    <motion.div
      className="min-h-screen bg-cream pb-28"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="px-4 md:px-8 max-w-screen-md mx-auto pt-14 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 bg-white rounded-[12px] shadow-card flex items-center justify-center"
          aria-label="Go back"
        >
          <ArrowLeft size={16} className="text-plant-dark" />
        </button>
        <h1 className="font-serif text-[22px] text-plant-dark">Identify Plant</h1>
      </div>

      {/* Tab Switcher */}
      <div className="mx-4 md:max-w-screen-md md:mx-auto bg-white rounded-[14px] p-1 flex gap-0.5 shadow-card mb-4">
        {(['upload', 'camera'] as TabType[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-[10px] text-xs font-semibold capitalize transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === tab ? 'bg-sage-deep text-white' : 'text-plant-light'
            }`}
          >
            {tab === 'upload' ? <Upload size={14} /> : <Camera size={14} />}
            {tab === 'upload' ? 'Upload Photo' : 'Camera'}
          </button>
        ))}
      </div>

      <div className="px-4 md:max-w-screen-md md:mx-auto space-y-4">
        {activeTab === 'camera' ? (
          /* Camera View Placeholder */
          <div className="bg-sage-deep rounded-[28px] h-56 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-5 border-2 border-white/40 rounded-[16px] pointer-events-none" />
            <span className="text-5xl mb-3">🌿</span>
            <p className="text-white/70 text-xs">Point camera at your plant</p>
            <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-6">
              <div className="w-9 h-9 bg-white/15 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">⚡</span>
              </div>
              <button className="w-14 h-14 bg-white rounded-full shadow-fab flex items-center justify-center"
                onClick={() => alert('Camera capture coming in Phase 2!')}>
                <div className="w-12 h-12 border-2 border-sage-deep rounded-full" />
              </button>
              <div className="w-9 h-9 bg-white/15 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">🔄</span>
              </div>
            </div>
          </div>
        ) : (
          /* Upload Zone */
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => !preview && fileInputRef.current?.click()}
            className={`bg-white border-2 border-dashed border-sage-light rounded-[28px] flex flex-col items-center justify-center p-8 transition-colors cursor-pointer ${preview ? 'p-0 overflow-hidden' : ''}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            {preview ? (
              <div className="relative w-full">
                <img src={preview} alt="Selected plant" className="w-full h-56 object-cover rounded-[26px]" />
                <button
                  onClick={e => { e.stopPropagation(); setPreview(null); setSelectedFile(null) }}
                  className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 text-xs font-semibold text-plant-dark shadow-card"
                >
                  Change
                </button>
              </div>
            ) : (
              <>
                <span className="text-4xl mb-3">📷</span>
                <p className="text-sm font-semibold text-plant-dark mb-1">Upload a photo</p>
                <p className="text-xs text-plant-light text-center">Drag & drop or tap to select<br/>JPG, PNG, WebP · Max 10MB</p>
              </>
            )}
          </div>
        )}

        {/* Divider */}
        {activeTab === 'camera' && (
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-cream-2" />
            <span className="text-xs text-plant-light">or upload a photo</span>
            <div className="flex-1 h-px bg-cream-2" />
          </div>
        )}

        {/* Tips */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { emoji: '☀️', tip: 'Good lighting helps accuracy' },
            { emoji: '🎯', tip: 'Center the plant in frame' },
            { emoji: '📏', tip: 'Show leaves & stem clearly' },
          ].map(t => (
            <div key={t.tip} className="bg-mint rounded-[14px] p-3 flex flex-col items-center gap-2 text-center">
              <span className="text-xl">{t.emoji}</span>
              <p className="text-[10px] text-plant-mid leading-tight">{t.tip}</p>
            </div>
          ))}
        </div>

        {/* Analyze CTA */}
        <Button
          onClick={handleAnalyze}
          disabled={!selectedFile && activeTab === 'upload'}
          fullWidth
        >
          🔍 Analyze Plant
        </Button>
      </div>

      <BottomNav />
    </motion.div>
  )
}
