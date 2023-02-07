import { TableProps } from 'antd'
import type { RecordType } from './types/global'

export interface PaginationConfigType {
  current?: number
  pageSize?: number
  total?: number
  pageSizeOptions?: number[]
  [key: string]: any
}

// 默认分页配置
export const defaultPaginationConfig: PaginationConfigType = {
  current: 1,
  pageSize: 10,
  total: 0,
  pageSizeOptions: [10, 20, 50, 100],
}

// 默认antd表格配置
export const defaultTableConfig: TableProps<RecordType> = {
  rowKey: 'id',
  scroll: { x: 'max-content' },
}
