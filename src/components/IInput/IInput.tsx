import React from 'react'
import { Input } from 'antd'
import type { InputRef, InputProps } from 'antd'
import useRemoveInputSpaces, {
  UseRemoveInputSpacesProps,
} from './hooks/useRemoveInputSpaces'

export type IInputProps = InputProps & UseRemoveInputSpacesProps

export type IInputRef = InputRef

/**
 * IInput
 */
const IInput = React.forwardRef<IInputRef, IInputProps>((props, ref) => {
  const removeInputSpacesEvent = useRemoveInputSpaces(props)

  return <Input {...props} {...removeInputSpacesEvent} ref={ref} />
})

export default IInput
