import { Template } from '@/stories/components/ITable/template'

const ITableSorter = Template.bind({})

ITableSorter.args = {
  getTableData: (args) => {
    const { options } = args ?? {}
    const { params } = options ?? {}
    return fetch(
      `https://randomuser.me/api?${new URLSearchParams(params).toString()}`
    ).then((res) => res.json())
  },
  requestParamsHandler: (searchParams, formData, extraParams) => {
    /** 手动排序 */
    let newExtraParams = extraParams
    const { order, field, column } = searchParams?.sorter ?? {}
    if (order && field && field === 'phone') {
      const { sortFieldsName = [], sortDirections } = column ?? {}
      let sortType = order
      if (!Array.isArray(sortDirections) || !sortDirections.length) {
        sortType = order === 'ascend' ? 'asc' : 'desc'
      }
      newExtraParams = {
        ...extraParams,
        [sortFieldsName[0]]: undefined,
        [sortFieldsName[1]]: undefined,
        order22: sortType,
        orderField22: field,
      }
    }
    return { searchParams, formData: { ...formData, ...newExtraParams } }
  },
}

ITableSorter.storyName = '表格排序'

export default ITableSorter
