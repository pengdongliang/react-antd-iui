import dayjs from 'dayjs'
import { Template } from '../template'
import { UseAntdRowItemType, UseAntdTablePaginationType } from '~/src'

const ITableDemos = Template.bind({})

ITableDemos.args = {
  getTableData: (
    searchParams: UseAntdTablePaginationType,
    paramsData: Record<string, unknown>
  ): Promise<UseAntdRowItemType> => {
    let urlParams = ''
    const { current, pageSize } = searchParams
    Object.entries({ ...paramsData, current, pageSize }).forEach(
      ([key, value]) => {
        if (value !== undefined && `${value}` !== '') {
          urlParams += `${urlParams ? '&' : ''}${key}=${encodeURI(`${value}`)}`
        }
      }
    )
    return fetch(
      `https://randomuser.me/api?results=${
        paramsData?.results ?? 10
      }&${urlParams}`
    )
      .then((res) => res.json())
      .then((res) => ({
        total: 100,
        list: res.results,
      }))
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
