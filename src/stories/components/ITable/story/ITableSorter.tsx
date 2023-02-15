import { Template } from '@/stories/components/ITable/template'

const ITableSorter = Template.bind({})

ITableSorter.args = {
  requestParamsHandler: (searchParams, formData) => {
    /** 手动排序 */
    let extraParams = {}
    const { order, field, column } = searchParams?.sorter ?? {}
    if (order && field && field === 'phone') {
      const { sortFieldsName = [], sortDirections } = column ?? {}
      let sortType = order
      if (!Array.isArray(sortDirections) || !sortDirections.length) {
        sortType = order === 'ascend' ? 'asc' : 'desc'
      }
      extraParams = {
        [sortFieldsName[0]]: undefined,
        [sortFieldsName[1]]: undefined,
        order22: sortType,
        orderField22: field,
      }
    }
    return { searchParams, formData: { ...formData, ...extraParams } }
  },
}

ITableSorter.storyName = '表格排序'

export default ITableSorter
