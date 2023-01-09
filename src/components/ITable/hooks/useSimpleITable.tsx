import type { RecordType } from '../types/global'

export interface useSimpleITablePropsType {
  blockAutoRequestFlag?: boolean | 'auto'
  simpleTableFlag?: boolean
  propsDataSource?: RecordType[]
  tableProps?: {
    [key: string]: any
  }
}

/**
 * 简单表格处理
 * @param props
 */
function useSimpleITable(props: useSimpleITablePropsType) {
  const { blockAutoRequestFlag, simpleTableFlag, tableProps, propsDataSource } =
    props
  const simpleDataSource =
    blockAutoRequestFlag &&
    simpleTableFlag &&
    Array.isArray(propsDataSource) &&
    propsDataSource.length
      ? propsDataSource
      : tableProps?.dataSource
  const simplePagination = simpleTableFlag ? false : tableProps?.pagination
  return { dataSource: simpleDataSource, pagination: simplePagination }
}

export default useSimpleITable
