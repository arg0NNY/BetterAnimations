
const sizes = {
  xxs: 12,
  xs: 16,
  sm: 18,
  md: 24,
  lg: 32,
  custom: undefined
}

function useIconSize (size = 'md', { width = 24, height = 24 } = {}) {
  return {
    width: sizes[size] ?? width,
    height: sizes[size] ?? height
  }
}

export default useIconSize
