"use client"
import React, { useState, useCallback, useRef, useEffect } from "react"
import Cropper from "react-easy-crop"
import { getCroppedImg } from "@/utils/imageProcessing"

interface Props {
  imageSrc: string
  aspect?: number
  onCancel: () => void
  onSave: (file: File) => void
  inline?: boolean
}

export default function BlogImageCropper({ imageSrc, aspect = 16 / 9, onCancel, onSave, inline = false }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [localImageSrc, setLocalImageSrc] = useState<string | null>(imageSrc)

  useEffect(() => {
    let objUrl: string | null = null
    let cancelled = false

    const prepareSrc = async () => {
      if (!imageSrc) {
        setLocalImageSrc(imageSrc)
        return
      }

      // If already a blob/data URL, use directly
      if (imageSrc.startsWith('blob:') || imageSrc.startsWith('data:')) {
        setLocalImageSrc(imageSrc)
        return
      }

      try {
        const resp = await fetch(imageSrc)
        const blob = await resp.blob()
        objUrl = URL.createObjectURL(blob)
        if (!cancelled) setLocalImageSrc(objUrl)
      } catch (err) {
        console.error('Failed to fetch image for cropper, using original src', err)
        if (!cancelled) setLocalImageSrc(imageSrc)
      }
    }

    prepareSrc()

    return () => {
      cancelled = true
      if (objUrl) URL.revokeObjectURL(objUrl)
    }
  }, [imageSrc])

  const onCropComplete = useCallback((_: any, croppedAreaPixelsLocal: any) => {
    setCroppedAreaPixels(croppedAreaPixelsLocal)
  }, [])

  const handleSave = useCallback(async () => {
    if (!croppedAreaPixels) return
    try {
      const MAX_W = 1600
      const MAX_H = 900
      const source = localImageSrc || imageSrc
      const blob = await getCroppedImg(source as string, croppedAreaPixels, rotation, MAX_W, MAX_H)
      const file = new File([blob], `blog_${Date.now()}.jpg`, { type: "image/jpeg" })
      onSave(file)
    } catch (err) {
      console.error("Crop save error:", err)
    }
  }, [croppedAreaPixels, imageSrc, localImageSrc, onSave, rotation])

  return (
    <div onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} className={inline ? "fixed inset-0 z-[99999] flex items-center justify-center bg-blur bg-opacity-60 backdrop-blur-sm" : "fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-50"}>
      <div className="bg-white rounded-lg w-[94%] max-w-3xl p-3 sm:p-4 relative mx-2 sm:mx-0">
        <div className="relative h-[50vh] sm:h-[420px] max-h-[80vh] bg-gray-100 overflow-hidden">
          <Cropper
            image={localImageSrc || imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="w-full sm:w-auto flex items-center sm:items-center gap-3">
            <label className="text-sm shrink-0">Zoom</label>
            <input className="w-full sm:w-48" type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
          </div>

          <div className="flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button type="button" onClick={onCancel} className="w-full sm:w-auto px-3 py-2 bg-red-400 hover:bg-red-500 rounded text-sm cursor-pointer">Cancel</button>
            <button type="button" onClick={handleSave} className="w-full sm:w-auto px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm cursor-pointer">Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}


