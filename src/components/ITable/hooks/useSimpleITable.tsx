import { TablePaginationConfig } from 'antd'
import { ITableProps } from '../ITable'
import type { RecordType } from '../types/global'

/**
 * 简单表格props类型
 */
export interface UseSimpleITablePropsType {
  /** 是否阻止初始自动请求 */
  blockAutoRequestFlag?: boolean | 'auto'
  /** 是否为简单表格 */
  simpleTableFlag?: boolean
  /** 通过props传递过来的表格数据 */
  propsDataSource?: RecordType[]
  /** 表格props */
  tableProps?: ITableProps
  /** props传递过来的分页, 只用到false */
  paginationProps?: TablePaginationConfig | false
}

/**
 * 简单表格处理
 * @param props
 */
function useSimpleITable(props: UseSimpleITablePropsType) {
  const {
    blockAutoRequestFlag,
    simpleTableFlag,
    tableProps,
    propsDataSource,
    paginationProps,
  } = props
  const simpleDataSource =
    blockAutoRequestFlag &&
    simpleTableFlag &&
    Array.isArray(propsDataSource) &&
    propsDataSource.length
      ? propsDataSource
      : tableProps?.dataSource
  const simplePagination =
    simpleTableFlag || paginationProps === false
      ? false
      : tableProps?.pagination
  return { dataSource: simpleDataSource, pagination: simplePagination }
}

export default useSimpleITable
