import React from 'react'
import { Input } from 'antd'
import type { TextAreaRef, TextAreaProps } from 'antd/es/input/TextArea'
import useRemoveInputSpaces, {
  UseRemoveInputSpacesProps,
} from './hooks/useRemoveInputSpaces'

export type ITextAreaProps = TextAreaProps & UseRemoveInputSpacesProps

export type ITextAreaRef = TextAreaRef

/**
 * ITextArea
 */
const ITextArea = React.forwardRef<ITextAreaRef, ITextAreaProps>(
  (props, ref) => {
    const removeInputSpacesEvent = useRemoveInputSpaces<ITextAreaProps>(props)

    return <Input.TextArea {...props} {...removeInputSpacesEvent} ref={ref} />
  }
)

export default ITextArea
