import { useEffect, useState } from 'react'

export const defaultSortOptions = [
  {
    value: 'name',
    label: 'By name',
    compare: (a, b) => a.name.localeCompare(b.name)
  },
  {
    value: 'author',
    label: 'By author',
    compare: (a, b) => a.author.localeCompare(b.author)
  }
]

export const defaultSearchableFields = ['name', 'author', 'description']

function usePackSearch (
  allItems,
  {
    searchableFields = defaultSearchableFields,
    sort: {
      options: sortOptions = defaultSortOptions,
      preference: sortPreference,
      setPreference: setSortPreference
    } = {}
  } = {}
) {
  const [query, setQuery] = useState('')
  const trimmedQuery = query.trim()

  const [sort, setSort] = useState(sortPreference ?? sortOptions[0].value)
  const selectedSort = sortOptions.find(o => o.value === sort)

  useEffect(() => {
    setSortPreference?.(sort)
  }, [sort])

  const items = allItems
    .filter(
      item => !trimmedQuery
        || searchableFields.some(
          field => typeof item[field] === 'string'
            && item[field].toLowerCase().includes(trimmedQuery.toLowerCase())
        )
    )
    .sort(selectedSort?.compare ?? (() => 0))

  return {
    items,
    query,
    setQuery,
    sort,
    setSort,
    selectedSort,
    sortOptions,
    searchableFields
  }
}

export default usePackSearch
