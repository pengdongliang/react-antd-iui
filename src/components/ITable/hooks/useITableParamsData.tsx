import { useAntdTable } from 'ahooks'
import type { UseAntdRowItemType, ITablePropsEitherOr } from '../ITable'
import { UseAntdTablePaginationType } from '../ITable'

export type getTableDataFuncType = (
  pagination: UseAntdTablePaginationType,
  formData: Record<string, unknown>
) => Promise<UseAntdRowItemType>

/**
 * iTable表格请求方式的数据
 * @param props
 */
function useITableParamsData(props: ITablePropsEitherOr) {
  const { getTableData, getTableDataApi, useAntdTableOptions, initParams } =
    props
  let getTableDataPromise: getTableDataFuncType | null = null

  if (getTableData) {
    getTableDataPromise = getTableData
  } else if (getTableDataApi) {
    getTableDataPromise = (
      searchParams: UseAntdTablePaginationType,
      formData: Record<string, unknown>
    ): Promise<UseAntdRowItemType> => {
      const { current, pageSize } = searchParams ?? {}
      // TODO 更换为getTableDataApi
      let query = `page=${current}&size=${pageSize}`
      const queryParams = {
        ...initParams,
        ...formData,
      }
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value) {
          query += `&${key}=${value}`
        }
      })

      return fetch(`https://randomuser.me/api?results=55&${query}`)
        .then((res) => res.json())
        .then((res) => ({
          total: res.info.results,
          list: res.results,
        }))
    }
  }

  const tableParamsData = useAntdTable(
    getTableDataPromise as getTableDataFuncType,
    {
      ...useAntdTableOptions,
    }
  )

  return tableParamsData
}

export default useITableParamsData
