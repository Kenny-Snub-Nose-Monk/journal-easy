import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getHourStamp() {
  const now = Date.now()
  const hourStamp = now / (60 * 60 * 1000)
  return Math.floor(hourStamp)
}

export const getRandomElement = (list: any) =>
  list[Math.floor(Math.random() * list.length)]
