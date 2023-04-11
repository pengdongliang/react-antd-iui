import dayjs from 'dayjs'
import { Template } from '../template'
import { UseAntdRowItemType, UseAntdTablePaginationType } from '~/src'

const ITableDemos = Template.bind({})

ITableDemos.args = {
  getTableData: (args): Promise<UseAntdRowItemType> => {
    const { options } = args ?? {}
    const { params } = options ?? {}
    return fetch(
      `https://randomuser.me/api?${new URLSearchParams(params).toString()}`
    ).then((res) => res.json())
  },
  // ref: itableRef,
  blockAutoRequestFlag: false,
  // useAntdTableOptions={{ refreshDeps: [refreshDeps] }}
  // useTableForm: useTableForm,
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
}

ITableDemos.storyName = '表格示例'

export default ITableDemos
