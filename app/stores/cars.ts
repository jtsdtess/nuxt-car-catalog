import { defineStore } from 'pinia'
import type { Car, CarDetails } from '~/types/car'
import { buildCarSlug } from '../utils/carSlug'

// Type alias to avoid esbuild parsing issues with nested generics
type ApiData = Omit<CarDetails, 'id' | 'make' | 'model' | 'year'>
type ApiDataMap = Map<number, ApiData>
type ApiDataEntry = [number, ApiData]

export const useCarsStore = defineStore('cars', () => {
  // Локальные данные из JSON
  const cars = ref<Car[]>([])
  // Данные из внешнего API (CarQuery)
  const apiData = ref<ApiDataMap>(new Map())

  // Loading states
  const loading = ref(false) // для списка
  const apiLoading = ref(false) // для API запроса
  const error = ref<string | null>(null) // общий error
  const apiError = ref<Map<number, string>>(new Map()) // error по конкретному ID
  const apiEmpty = ref<Set<number>>(new Set()) // ID для которых API вернул пустой ответ

  async function fetchCars() {
    if (cars.value.length > 0) {
      return
    }

    loading.value = true
    error.value = null

    try {
      const { data, status } = await useFetch<Car[]>('/api/cars')
      if (status.value === 'success' && data.value) {
        cars.value = data.value
      }
    }
    catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch cars'
    }
    finally {
      loading.value = false
    }
  }

  async function fetchCarDetails(id: number) {
    // Если уже есть данные в API кэше - возвращаем
    if (apiData.value.has(id)) {
      return apiData.value.get(id)
    }

    apiLoading.value = true
    apiError.value.delete(id) // очистить прошлую ошибку
    apiEmpty.value.delete(id) // очистить флаг empty

    try {
      const car = cars.value.find((c: Car) => c.id === id)
      if (!car) {
        throw new Error('Car not found')
      }

      const { data, status } = await useFetch<CarDetails>(`/api/carquery/${car.make}/${car.model}/${car.year}`)

      if (status.value === 'success' && data.value) {
        // Сохраняем только данные из API, без базовых полей из JSON
        const { id: _, make: __, model: ___, year: ____, ...apiOnlyData } = data.value

        // Проверяем есть ли полезные данные
        const hasData = apiOnlyData.engine || apiOnlyData.transmission || apiOnlyData.drive
          || apiOnlyData.doors || apiOnlyData.seats
          || (apiOnlyData.fuelEconomy && (apiOnlyData.fuelEconomy.city || apiOnlyData.fuelEconomy.highway || apiOnlyData.fuelEconomy.combined))
          || (apiOnlyData.price && (apiOnlyData.price.msrp || apiOnlyData.price.invoice))
          || (apiOnlyData.trims && apiOnlyData.trims.length > 0)

        if (hasData) {
          apiData.value.set(id, apiOnlyData)
        } else {
          // API вернул пустой ответ
          apiEmpty.value.add(id)
        }
        return apiOnlyData
      }
    }
    catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Failed to fetch car details'
      apiError.value.set(id, errorMsg)
    }
    finally {
      apiLoading.value = false
    }
  }

  function getCarById(id: number): Car | undefined {
    return cars.value.find((c: Car) => c.id === id)
  }

  function getCarBySlug(slug: string): Car | undefined {
    return cars.value.find((c: Car) => buildCarSlug(c) === slug)
  }

  function getCarApiData(id: number) {
    return apiData.value.get(id)
  }

  function getCarApiError(id: number): string | undefined {
    return apiError.value.get(id)
  }

  function isApiEmpty(id: number): boolean {
    return apiEmpty.value.has(id)
  }

  return {
    cars: readonly(cars),
    apiData: readonly(apiData),
    loading: readonly(loading),
    apiLoading: readonly(apiLoading),
    error: readonly(error),
    apiError: readonly(apiError),
    apiEmpty: readonly(apiEmpty),
    fetchCars,
    fetchCarDetails,
    getCarById,
    getCarBySlug,
    getCarApiData,
    getCarApiError,
    isApiEmpty,
  }
}, {
  persist: {
    key: 'car-catalog-api-data',
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    pick: ['apiData'],
    serializer: {
      deserialize: (value: string) => {
        const parsed = JSON.parse(value) as { apiData?: ApiDataEntry[] }
        return { apiData: new Map(parsed.apiData || []) }
      },
      serialize: (state: unknown) => {
        const s = state as { apiData: ApiDataMap }
        return JSON.stringify({
          apiData: Array.from(s.apiData.entries()),
        })
      },
    },
  },
})
