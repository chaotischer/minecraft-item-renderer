import { promises as fsPromises } from 'fs'
import { join } from 'path'
import type { H3Event } from 'h3'

export default defineEventHandler(async (_event: H3Event) => {
  const defaultItemsPath = join(process.cwd(), 'public', 'default-items')
  
  try {
    const files = await fsPromises.readdir(defaultItemsPath)
    return files.filter((file: string) => file.endsWith('.png'))
  } catch (err) {
    console.error('Error reading default items directory:', err)
    return []
  }
}) 