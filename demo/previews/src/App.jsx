import Preview from '@shared/preview'
import { useEffect, useState } from 'react'
import Module from '@animation/module'
import data from '@data/modules'
import ModuleKey from '@enums/ModuleKey'
import internalPacks, { PREINSTALLED_PACK_SLUG } from '@packs'
import { getRect } from '@utils/position'

const modules = data.map(m => new Module(m))
const pack = internalPacks[PREINSTALLED_PACK_SLUG]

window.getRect = el => getRect(el, document.querySelector('.BAP__viewport'))
window.getCenter = el => {
  const rect = window.getRect(el)
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  }
}

function App () {
  const [id, setId] = useState(ModuleKey.Servers)
  const [animationKey, setAnimationKey] = useState('fade')
  const [active, setActive] = useState(true)
  const [placeholder, setPlaceholder] = useState(false)

  const module = modules.find(m => m.id === id)
  const animations = pack.animations.filter(a => module.isSupportedBy(a))
  const animation = pack.animations.find(a => a.key === animationKey)

  useEffect(() => {
    if (!animations.find(a => a.key === animationKey))
      setAnimationKey(animations[0]?.key)
  }, [id, animationKey])

  return (
    <div>
      <div style={{ display: 'flex', gap: '.5rem', padding: '1rem' }}>
        <select
          value={id}
          onChange={e => setId(e.target.value)}
        >
          {modules.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        <select
          value={animationKey}
          onChange={e => setAnimationKey(e.target.value)}
        >
          {animations.map(a => (
            <option key={a.key} value={a.key}>{a.name}</option>
          ))}
        </select>
        <label>
          <input
            type="checkbox"
            checked={active}
            onChange={e => setActive(e.target.checked)}
          />
          Active
        </label>
        <label>
          <input
            type="checkbox"
            checked={placeholder}
            onChange={e => setPlaceholder(e.target.checked)}
          />
          Placeholder
        </label>
      </div>
      <Preview
        key={`${id}${active}`}
        id={id}
        modules={modules}
        pack={pack}
        animation={animation}
        active={active}
        placeholder={placeholder}
      />
    </div>
  )
}

export default App
