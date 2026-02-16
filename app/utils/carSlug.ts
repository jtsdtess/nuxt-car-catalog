import type { Car } from '~/types/car'

// Minimal RU->EN transliteration for URL-safe slugs.
const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'sch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
}

function transliterate(input: string): string {
  return Array.from(input).map((char) => CYRILLIC_TO_LATIN[char] ?? char).join('')
}

export function slugifyPart(input: string): string {
  return transliterate(input.trim().toLowerCase())
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function buildCarSlug(car: Pick<Car, 'make' | 'model' | 'year'>): string {
  const make = slugifyPart(car.make)
  const model = slugifyPart(car.model)
  const year = String(car.year).trim()
  return [make, model, year].filter(Boolean).join('-')
}

export function parseCarSlug(slug: string): { make: string; model: string; year: number } | null {
  const normalized = slug.trim().toLowerCase()
  const match = normalized.match(/^(.*)-(\d{4})$/)

  if (!match) {
    return null
  }

  const [, base, yearPart] = match
  const year = Number(yearPart)

  if (!Number.isFinite(year)) {
    return null
  }

  const parts = base.split('-').filter(Boolean)
  if (parts.length < 2) {
    return null
  }

  return {
    make: parts[0],
    model: parts.slice(1).join('-'),
    year,
  }
}
