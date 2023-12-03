
function enumirize (values) {
  if (!Array.isArray(values)) return values

  return values.reduce(
    (obj, name, i) => ({ ...obj, [name]: i }),
    {}
  )
}

export default function Enum (values) {
  const raw = enumirize(values)

  return Object.freeze(
    Object.assign(
      raw,
      {
        keys: () => Object.keys(raw),
        values: () => Object.values(raw)
      }
    )
  )
}
