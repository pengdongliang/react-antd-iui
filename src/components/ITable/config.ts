import type { RecordType } from './types/global'
import { ITableProps } from './index'

/**
 * 分页类型
 */
export type PaginationConfigType = ITableProps['pagination']

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
export const defaultTableConfig: ITableProps<RecordType> = {
  rowKey: 'id',
  scroll: { x: '100%' },
  tableLayout: 'fixed',
}
