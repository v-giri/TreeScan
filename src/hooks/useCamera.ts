import { useState, useCallback, useRef } from 'react'

export function useCamera() {
  const [isCameraSupported] = useState(() => !!navigator.mediaDevices?.getUserMedia)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = useCallback(async (videoRef: React.RefObject<HTMLVideoElement | null>): Promise<void> => {
    setCameraError(null)
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera not supported on this device or browser.')
      setHasPermission(false)
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => {/* autoplay may be blocked */})
      }
      setHasPermission(true)
    } catch (err: any) {
      setHasPermission(false)
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission denied. Please allow camera access in your browser settings.')
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera found on this device.')
      } else if (err.name === 'NotReadableError') {
        setCameraError('Camera is in use by another app. Please close it and try again.')
      } else {
        setCameraError(`Camera error: ${err.message || err.name}`)
      }
    }
  }, [])

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
  }, [])

  const capturePhoto = useCallback(async (
    videoRef: React.RefObject<HTMLVideoElement | null>,
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
  ): Promise<File | null> => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return null

    const w = video.videoWidth || 1280
    const h = video.videoHeight || 720
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.drawImage(video, 0, 0, w, h)

    return new Promise(resolve => {
      canvas.toBlob(blob => {
        if (!blob) { resolve(null); return }
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })
        resolve(file)
      }, 'image/jpeg', 0.9)
    })
  }, [])

  return { isCameraSupported, hasPermission, cameraError, startCamera, stopCamera, capturePhoto }
}
