import { TableProps } from 'antd'
import type { RecordType } from './types/global'

/**
 * 分页类型
 */
export interface PaginationConfigType {
  /** 当前页数 */
  current?: number
  /** 每页条数 */
  pageSize?: number
  /** 总数 */
  total?: number
  /** 指定每页可以显示多少条 */
  pageSizeOptions?: number[]
  /** 其它分页props */
  [key: string]: any
}

/**
 * 默认分页配置
 */
export const defaultPaginationConfig: PaginationConfigType = {
  current: 1,
  pageSize: 10,
  total: 0,
  pageSizeOptions: [10, 20, 50, 100],
}

/**
 * 默认antd表格配置
 */
export const defaultTableConfig: TableProps<RecordType> = {
  rowKey: 'id',
  scroll: { x: '100%' },
  tableLayout: 'fixed',
}
