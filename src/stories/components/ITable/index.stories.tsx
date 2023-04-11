import { ComponentMeta } from '@storybook/react'
import { IForm, ITable } from '@/index'
import { columns, useTableForm } from '@/stories/components/ITable/const/data'

export default {
  title: 'ITable 表格',
  component: ITable,
  subcomponents: { IForm },
  excludeStories: ['Template', /.*Data$/],
  argTypes: {},
  args: {
    getTableDataApi: '/api',
    columns,
    iTableRequestFields: {
      records: 'results',
      total: 'info',
      data: undefined,
      current: 'current',
      pageSize: 'pageSize',
    },
    initParams: { gender: 'lucy', results: 10 },
    initPaginationConfig: { current: 1, pageSize: 5 },
    rowKey: (record) => `${JSON.stringify(record?.id)}${record?.email}`,
    requestOptions: ({ params }) => ({ params }),
    // filterRequestValue: (key, value) => value,
    responseDataHandler: (data, res) => data,
    useTableForm,
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
