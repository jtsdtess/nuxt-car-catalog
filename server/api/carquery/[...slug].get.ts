import type { CarDetails } from '~/types/car'

interface CarQueryResponse {
  Trims?: Array<{
    model_id: string
    model_make_display?: string
    model_name: string
    model_trim: string
    model_body: string
    model_engine_name: string
    model_transmission_name: string
    model_drive_name: string
    model_fuel_name: string
    model_doors: number
    model_seats: number
    model_price_msrp: number
    model_price_invoice: number
    model_mpg_city: number
    model_mpg_hwy: number
    model_mpg_comb: number
  }>
}

export default defineEventHandler(async (event) => {
  // slug может быть строкой 'Toyota/Camry/2020' или массивом
  const slug = event.context.params?.slug || []

  // Если slug строка - разбиваем по /
  let parts: string[]
  if (typeof slug === 'string') {
    parts = slug.split('/')
  } else if (Array.isArray(slug)) {
    // Если массив и первый элемент содержит / - разбиваем
    parts = slug[0]?.includes('/') ? slug[0].split('/') : slug
  } else {
    parts = []
  }

  const [make, model, year] = parts

  if (!make || !model || !year) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required parameters: make, model, year',
    })
  }

  const queryUrl = `https://www.carqueryapi.com/api/0.3/?cmd=getTrims&make=${make}&model=${model}&year=${year}`

  try {
    const response = await $fetch<CarQueryResponse>(queryUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    })

    const trims = response.Trims || []

    if (trims.length === 0) {
      return {
        make,
        model,
        year: Number.parseInt(year, 10),
        trims: [],
      } as CarDetails
    }

    const firstTrim = trims[0]

    return {
      make,
      model,
      year: Number.parseInt(year, 10),
      engine: firstTrim.model_engine_name || undefined,
      transmission: firstTrim.model_transmission_name || undefined,
      drive: firstTrim.model_drive_name || undefined,
      doors: firstTrim.model_doors || undefined,
      seats: firstTrim.model_seats || undefined,
      fuelEconomy: {
        city: firstTrim.model_mpg_city || undefined,
        highway: firstTrim.model_mpg_hwy || undefined,
        combined: firstTrim.model_mpg_comb || undefined,
      },
      price: {
        msrp: firstTrim.model_price_msrp || undefined,
        invoice: firstTrim.model_price_invoice || undefined,
      },
      trims: trims.map(trim => ({
        id: trim.model_id,
        modelDisplayName: trim.model_make_display || '',
        trimName: trim.model_trim,
        bodyTypeName: trim.model_body,
        engineName: trim.model_engine_name,
        transmissionName: trim.model_transmission_name,
        driveTypeName: trim.model_drive_name,
        fuelTypeName: trim.model_fuel_name,
        doors: trim.model_doors,
        seatCount: trim.model_seats,
        msrp: trim.model_price_msrp,
        invoice: trim.model_price_invoice,
        mpgCity: trim.model_mpg_city,
        mpgHwy: trim.model_mpg_hwy,
        mpgCombined: trim.model_mpg_comb,
      })),
    } as CarDetails
  }
  catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch car details from CarQuery API',
    })
  }
})
