
function AnimeContainer ({ ref, id = '', container, children }) {
  if (!container) return children

  return (
    <div
      ref={ref}
      data-ba-container={id}
      {...container}
    >
      {children}
    </div>
  )
}

export default AnimeContainer
