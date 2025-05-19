import Position from '@shared/enums/Position'
import { createRef, useRef } from 'react'

export function autoPosition (self, defaultPosition, source = { align: Position.Top }) {
  if (!self.__autoRef) {
    self.__autoRef = createRef()
    self.__autoRef.current = Object.assign({}, source, { position: defaultPosition })
  }

  return {
    autoRef: self.__autoRef,
    setPosition: position => self.__autoRef.current.position = position
  }
}

function useAutoPosition (defaultPosition, source = { align: Position.Top }) {
  const autoRef = useRef(
    Object.assign({}, source, { position: defaultPosition })
  )

  return {
    autoRef,
    setPosition: position => autoRef.current.position = position
  }
}

export default useAutoPosition
