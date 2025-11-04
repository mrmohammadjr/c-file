"use server"

export async function test(formData: FormData) {
  const file = formData.get('file') as File | null
  if (!file) {
    console.log('No file received')
    return
  }
//   console.log(file)

  // read file contents
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
//   console.log(buffer)

  // save to server filesystem (ensure uploads/ exists or create it)
  const fs = await import('fs')
  const path = await import('path')
  const uploadsDir = path.join(process.cwd(), 'uploads')
  await fs.promises.mkdir(uploadsDir, { recursive: true })
  const filePath = path.join(uploadsDir, file.name)
  await fs.promises.writeFile(filePath, buffer)

  console.log('Saved file to', filePath)
  return { fileName: file.name, size: buffer.length, path: filePath }
}