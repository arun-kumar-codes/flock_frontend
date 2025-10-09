export async function getCroppedImg(imageSrc: string, pixelCrop: any, rotation = 0, maxW?: number, maxH?: number) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  const maxSize = Math.max(image.width, image.height)
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2))

  canvas.width = safeArea
  canvas.height = safeArea

  ctx.translate(safeArea / 2, safeArea / 2)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.translate(-safeArea / 2, -safeArea / 2)
  ctx.drawImage(image, (safeArea - image.width) / 2, (safeArea - image.height) / 2)

  const data = ctx.getImageData(0, 0, safeArea, safeArea)

  // set canvas to final desired crop size
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.putImageData(data, Math.round(0 - (safeArea / 2 - image.width / 2) - pixelCrop.x), Math.round(0 - (safeArea / 2 - image.height / 2) - pixelCrop.y))

  // Optional resize to max dims
  if (maxW || maxH) {
    const targetW = maxW || canvas.width
    const targetH = maxH || canvas.height
    const ratio = Math.min(1, targetW / canvas.width, targetH / canvas.height)
    if (ratio < 1) {
      const resizedCanvas = document.createElement('canvas')
      resizedCanvas.width = Math.round(canvas.width * ratio)
      resizedCanvas.height = Math.round(canvas.height * ratio)
      const rctx = resizedCanvas.getContext('2d')!
      rctx.drawImage(canvas, 0, 0, resizedCanvas.width, resizedCanvas.height)
      return await new Promise<Blob>((resolve) => {
        resizedCanvas.toBlob((file) => {
          if (file) resolve(file)
        }, 'image/jpeg')
      })
    }
  }

  return await new Promise<Blob>((resolve) => {
    canvas.toBlob((file) => {
      if (file) resolve(file)
    }, 'image/jpeg')
  })
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => resolve(img))
    img.addEventListener('error', (err) => reject(err))
    img.setAttribute('crossOrigin', 'anonymous')
    img.src = url
  })
}


