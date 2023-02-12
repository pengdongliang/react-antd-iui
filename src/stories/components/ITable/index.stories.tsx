import { ComponentMeta } from '@storybook/react'
import dayjs from 'dayjs'
import { ITable, UseAntdRowItemType, UseAntdTablePaginationType } from '@/index'
import { columns } from '@/stories/components/ITable/const/data'
// import 'antd/es/table/style/css.js'

export default {
  title: 'ITable 表格',
  component: ITable,
  excludeStories: ['Template', /.*Data$/],
  argTypes: {},
  args: {
    getTableDataApi: 'https://randomuser.me/api',
    getTableData: (
      searchParams: UseAntdTablePaginationType,
      paramsData: Record<string, unknown>
    ): Promise<UseAntdRowItemType> => {
      let urlParams = ''
      const { current, pageSize } = searchParams
      Object.entries({ ...paramsData, current, pageSize }).forEach(
        ([key, value]) => {
          if (value !== undefined && `${value}` !== '') {
            urlParams += `${urlParams ? '&' : ''}${key}=${encodeURI(
              `${value}`
            )}`
          }
        }
      )
      return fetch(
        `https://randomuser.me/api?results=${
          paramsData?.results ?? 5
        }&${urlParams}`
      )
        .then((res) => res.json())
        .then((res) => ({
          total: 100,
          list: res.results,
        }))
    },
    columns,
    simpleTableFlag: false,
    initParams: { results: 10 },
    initPaginationConfig: { current: 1, pageSize: 5 },
    // initParams: initParams,
    // ref: itableRef,
    blockAutoRequestFlag: false,
    // dataSource={dataSource}
    // simpleTableFlag
    // useAntdTableOptions={{ refreshDeps: [refreshDeps] }}
    // useTableForm: useTableForm,
    iTableRequestFields: {
      records: 'results',
      total: 'info',
      data: undefined,
      current: 'current',
      pageSize: 'pageSize',
    },
    editableConfig: {
      editRowFlag: true,
      onChange: (record: Record<string, any>) => {
        // eslint-disable-next-line no-console
        console.log('editOnchange', record)
      },
    },
    expandable: {
      // eslint-disable-next-line react/no-unstable-nested-components
      expandedRowRender: () => <p>111111111111111</p>,
      // 展开行的列位置
      expandIconColumnIndex: 2,
    },
    requestParamsHandler: (
      searchParams: UseAntdTablePaginationType,
      formData: Record<string, unknown>
    ) => {
      const [startTime, endTime]: any = formData?.ersda ?? []
      const newParams =
        startTime && endTime
          ? {
              startTime: dayjs(startTime).format('YYYY-MM-DD HH:mm:ss'),
              endTime: dayjs(endTime).format('YYYY-MM-DD HH:mm:ss'),
              ersda: undefined,
            }
          : {}
      return {
        searchParams,
        formData: { ...formData, ...newParams, results: 5 },
      }
    },
    // rowSelection: {
    //   type: 'checkbox',
    //   ...rowSelection,
    // },
    rowKey: (record) => `${JSON.stringify(record?.id)}${record?.email}`,
  },
} as ComponentMeta<typeof ITable>

export { ITableDemos, ITableSimple } from './story'
