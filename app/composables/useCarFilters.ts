export interface CarFilters {
  search: string
  make: string
  yearFrom: number | null
  yearTo: number | null
}

export function useCarFilters() {
  const route = useRoute()
  const router = useRouter()

  const search = ref('')
  const make = ref('')
  const yearFrom = ref<number | null>(null)
  const yearTo = ref<number | null>(null)
  const isRestoring = ref(true)

  function syncToUrl() {
    const query: Record<string, string | undefined> = {}

    if (search.value)
      query.search = search.value
    if (make.value)
      query.make = make.value
    if (yearFrom.value)
      query.yearFrom = String(yearFrom.value)
    if (yearTo.value)
      query.yearTo = String(yearTo.value)

    router.replace({ query })
  }

  function restoreFromUrl() {
    const query = route.query

    if (query.search)
      search.value = String(query.search)
    if (query.make)
      make.value = String(query.make)
    if (query.yearFrom)
      yearFrom.value = Number(query.yearFrom)
    if (query.yearTo)
      yearTo.value = Number(query.yearTo)
  }

  function reset() {
    search.value = ''
    make.value = ''
    yearFrom.value = null
    yearTo.value = null
    syncToUrl()
  }

  watch([search, make, yearFrom, yearTo], () => {
    if (isRestoring.value) return
    syncToUrl()
  })

  onMounted(() => {
    restoreFromUrl()
    isRestoring.value = false
  })

  return {
    search,
    make,
    yearFrom,
    yearTo,
    reset,
  }
}
