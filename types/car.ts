export interface Car {
  id: number
  make: string
  model: string
  year: number
  bodyType?: string
  fuelType?: string
}

export interface CarDetails extends Car {
  trims?: CarTrim[]
  engine?: string
  transmission?: string
  drive?: string
  doors?: number
  seats?: number
  fuelEconomy?: {
    city?: number
    highway?: number
    combined?: number
  }
  price?: {
    msrp?: number
    invoice?: number
  }
}

export interface CarTrim {
  id: string
  modelDisplayName: string
  trimName: string
  bodyTypeName: string
  engineName: string
  transmissionName: string
  driveTypeName: string
  fuelTypeName: string
  doors: number
  seatCount: number
  msrp: number
  invoice: number
  mpgCity: number
  mpgHwy: number
  mpgCombined: number
}

export interface CarFilters {
  make: string
  model: string
  yearFrom: number | null
  yearTo: number | null
  bodyType: string
}

export interface CarQueryParams {
  make?: string
  model?: string
  yearFrom?: string
  yearTo?: string
  bodyType?: string
}
