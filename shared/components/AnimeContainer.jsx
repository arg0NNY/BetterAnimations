
function AnimeContainer ({ ref, container, children }) {
  if (!container) return children

  return (
    <div
      ref={ref}
      data-ba-container=""
      {...container}
    >
      {children}
    </div>
  )
}

export default AnimeContainer
