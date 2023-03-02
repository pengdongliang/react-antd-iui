import React from 'react'
import { Input } from 'antd'
import type { InputRef } from 'antd'
import type { SearchProps } from 'antd/es/input'
import useRemoveInputSpaces, {
  UseRemoveInputSpacesProps,
} from './hooks/useRemoveInputSpaces'

export type ISearchProps = SearchProps & UseRemoveInputSpacesProps

export type ISearchRef = InputRef

/**
 * ISearch
 */
const ISearch = React.forwardRef<ISearchRef, ISearchProps>((props, ref) => {
  const removeInputSpacesEvent = useRemoveInputSpaces<ISearchProps>(props)

  return <Input.Search {...props} {...removeInputSpacesEvent} ref={ref} />
})

export default ISearch
