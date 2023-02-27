import { Input, InputRef, InputProps, Form } from 'antd'
import React from 'react'

export interface IInputProps extends InputProps {
  /** 替换正则, 默认/(^\s*)|(\s*$)/g */
  regex?: RegExp | false
  /** form表单name, 默认取Input id */
  formName?: string
}

export type IInputRef = React.Ref<InputRef>

/**
 * IInput
 * 支持失去焦点和回车去除空格
 */
const IInput = React.forwardRef((props: IInputProps, ref: IInputRef) => {
  const { onBlur, onPressEnter, id, regex = /(^\s*)|(\s*$)/g } = props
  const form = Form?.useFormInstance()

  const handleTrim = (e: React.FocusEvent<HTMLInputElement>) => {
    let { value } = e.target

    if (!(typeof regex === 'boolean' && !regex)) {
      value = value.replace(regex, '')
    }
    e.target.value = value
    if (form && id) {
      form?.setFieldsValue({ [id]: value })
    }
    if (e?.type === 'blur' && typeof onBlur === 'function') {
      onBlur(e)
    } else if (e?.type === 'keydown' && typeof onPressEnter === 'function') {
      onPressEnter(e as unknown as React.KeyboardEvent<HTMLInputElement>)
    }
  }

  const handleEnter = (e) => handleTrim(e)

  return (
    <Input
      {...props}
      ref={ref}
      onBlur={handleTrim}
      onPressEnter={handleEnter}
    />
  )
})

export default IInput
