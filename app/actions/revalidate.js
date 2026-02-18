'use server'

import { revalidatePath } from 'next/cache'

export async function revalidatePathAction(path, type) {
  try {
    revalidatePath(path, type)
    console.log(`Revalidated path: ${path} (type: ${type || 'default'})`)
  } catch (error) {
    console.error(`Failed to revalidate path: ${path}`, error)
  }
}
