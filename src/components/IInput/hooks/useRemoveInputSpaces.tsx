import { Form } from 'antd'
import type { InputProps } from 'antd'
import React, { useCallback, useMemo } from 'react'

export interface UseRemoveInputSpacesProps
  extends Partial<Pick<InputProps, 'onBlur' | 'onPressEnter' | 'id'>> {
  /** 替换正则, 默认/(^\s*)|(\s*$)/g */
  regex?: RegExp | false
  /** form表单name, 默认取Input id */
  formName?: string
  /** 回车是否去除空格, 默认true */
  pressEnterFlag?: boolean
  /** onChange */
  onChange?: React.ChangeEventHandler
}

/**
 * 去除input内容首尾空格, 支持失去焦点和回车
 * Antd Form直接使用, 未在Form里的Input通过onChange处理
 */
export default function useRemoveInputSpaces<
  T extends UseRemoveInputSpacesProps = UseRemoveInputSpacesProps
>(props: T): T {
  const {
    onBlur,
    onPressEnter,
    id,
    formName,
    regex = /(^\s*)|(\s*$)/g,
    pressEnterFlag = true,
  } = props
  const form = Form?.useFormInstance()
  const name = formName ?? id
  const isFormItem = !!(form && name)

  const handleTrim = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      let inputValue = e?.target?.value

      if (!(typeof regex === 'boolean' && !regex)) {
        inputValue = inputValue.replace(regex, '')
      }
      if (isFormItem) {
        form?.setFieldsValue({ [name]: inputValue })
      } else {
        e.target.value = inputValue
        props?.onChange?.(e)
      }
      if (e?.type === 'blur' && typeof onBlur === 'function') {
        onBlur(e)
      } else if (e?.type === 'keydown' && typeof onPressEnter === 'function') {
        onPressEnter(e as unknown as React.KeyboardEvent<HTMLInputElement>)
      }
    },
    [form, isFormItem, name, onBlur, onPressEnter, props, regex]
  )

  const handleEnter = useCallback(
    (e) => (pressEnterFlag ? handleTrim(e) : onPressEnter?.(e)),
    [handleTrim, onPressEnter, pressEnterFlag]
  )

  const removeInputSpacesEvent = useMemo(
    () =>
      ({
        onBlur: handleTrim,
        onPressEnter: handleEnter,
      } as unknown as T),
    [handleEnter, handleTrim]
  )

  return removeInputSpacesEvent
}
