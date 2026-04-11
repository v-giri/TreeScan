import { useState, useCallback, useRef } from 'react'

export function useCamera() {
  const [isCameraSupported] = useState(() => !!navigator.mediaDevices?.getUserMedia)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach(t => t.stop())
      setHasPermission(true)
      return true
    } catch {
      setHasPermission(false)
      return false
    }
  }, [])

  const startCamera = useCallback(async (videoRef: React.RefObject<HTMLVideoElement | null>): Promise<void> => {
    if (!videoRef.current) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      streamRef.current = stream
      videoRef.current.srcObject = stream
      setHasPermission(true)
    } catch {
      setHasPermission(false)
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

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.drawImage(video, 0, 0)

    return new Promise(resolve => {
      canvas.toBlob(blob => {
        if (!blob) {
          resolve(null)
          return
        }
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })
        resolve(file)
      }, 'image/jpeg', 0.9)
    })
  }, [])

  return { isCameraSupported, hasPermission, requestCameraPermission, startCamera, stopCamera, capturePhoto }
}
