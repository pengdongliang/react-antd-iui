import React from 'react'
import { Input } from 'antd'
import type { InputRef } from 'antd'
import type { PasswordProps } from 'antd/es/input'
import useRemoveInputSpaces, {
  UseRemoveInputSpacesProps,
} from './hooks/useRemoveInputSpaces'

export type IPasswordProps = PasswordProps & UseRemoveInputSpacesProps

export type IPasswordRef = InputRef

/**
 * IPassword
 */
const IPassword = React.forwardRef<IPasswordRef, IPasswordProps>(
  (props, ref) => {
    const removeInputSpacesEvent = useRemoveInputSpaces<IPasswordProps>(props)

    return <Input.Password {...props} {...removeInputSpacesEvent} ref={ref} />
  }
)

export default IPassword
