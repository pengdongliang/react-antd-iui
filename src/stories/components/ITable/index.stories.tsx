import { ComponentMeta } from '@storybook/react'
import { ITable } from '@/index'
import { columns } from '@/stories/components/ITable/const/data'
// import 'antd/es/table/style/css.js'

export default {
  title: 'ITable 表格',
  component: ITable,
  excludeStories: ['Template', /.*Data$/],
  argTypes: {},
  args: {
    getTableDataApi: 'https://randomuser.me/api',
    columns,
    iTableRequestFields: {
      records: 'results',
      total: 'info',
      data: undefined,
      current: 'current',
      pageSize: 'pageSize',
    },
    initParams: { results: 10 },
    initPaginationConfig: { current: 1, pageSize: 5 },
    rowKey: (record) => `${JSON.stringify(record?.id)}${record?.email}`,
  },
} as ComponentMeta<typeof ITable>

export {
  ITableDemos,
  ITableSimple,
  ITableSorter,
  ITableEditRow,
  ITableEditCol,
  ITableExpandable,
} from './story'
