import { useEffect, useState } from 'react'

function usePagination (allItems, pageSize, dependencies = []) {
  const [page, setPage] = useState(1)
  const offset = (page - 1) * pageSize
  const items = allItems.slice(offset, offset + pageSize)

  useEffect(
    () => setPage(1),
    dependencies
  )
  useEffect(() => {
    if (items.length === 0 && page > 1) setPage(1)
  }, [items.length, page])

  return {
    page,
    setPage,
    offset,
    items
  }
}

export default usePagination
