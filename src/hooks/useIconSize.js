
const sizes = {
  xxs: 12,
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
  custom: undefined,
  refresh_sm: 20
}

function useIconSize (size = 'md', { width = 24, height = 24 } = {}) {
  return {
    width: sizes[size] ?? width,
    height: sizes[size] ?? height
  }
}

export default useIconSize
