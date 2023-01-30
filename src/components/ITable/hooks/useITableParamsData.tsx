import { useAntdTable } from 'ahooks'
import { useFetch } from 'use-http'
import { useContext } from 'react'
import type { UseAntdRowItemType, ITablePropsEitherOr } from '../ITable'
import { UseAntdTablePaginationType } from '../ITable'
import { ConfigContext } from '@/configProvider'

export type getTableDataFuncType = (
  pagination: UseAntdTablePaginationType,
  formData: Record<string, unknown>
) => Promise<UseAntdRowItemType>

export interface ITableRequestFieldsType {
  current?: string
  pageSize?: string
  total?: string
  // 列表数据字段
  records?: string
}

export const defaultITableRequestFields: Readonly<ITableRequestFieldsType> = {
  current: 'page',
  pageSize: 'limit',
  total: 'total',
  records: 'list',
}

/**
 * iTable表格请求方式的数据
 * @param props
 */
function useITableParamsData(props: ITablePropsEitherOr) {
  const { getTableData, getTableDataApi, useAntdTableOptions, initParams } =
    props
  let getTableDataPromise: getTableDataFuncType | null = null
  const { isUseHttp, iTableRequestFields } = useContext(ConfigContext)
  const {
    current: currentFieldName,
    pageSize: pageSizeFieldName,
    total: totalFieldName,
    records: recordsFieldName,
  } = iTableRequestFields ?? defaultITableRequestFields
  const { get: httpGet } = useFetch()

  if (getTableData) {
    getTableDataPromise = getTableData
  } else if (getTableDataApi) {
    getTableDataPromise = (
      searchParams: UseAntdTablePaginationType,
      formData: Record<string, unknown>
    ): Promise<UseAntdRowItemType> => {
      const { current, pageSize } = searchParams ?? {}
      const queryParams = {
        [currentFieldName]: current,
        [pageSizeFieldName]: pageSize,
        ...initParams,
        ...formData,
      }
      let urlParams = ''
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          urlParams += `${urlParams ? '&' : ''}${key}=${value}`
        }
      })
      const url = getTableDataApi + (urlParams ? `?${urlParams}` : '')

      if (isUseHttp) {
        return httpGet(url).then((res) => {
          const data = res?.data ?? {}
          return {
            total: data[totalFieldName],
            list: data[recordsFieldName],
          }
        })
      }
      return fetch(url)
        .then((res) => res.json())
        .then((res) => {
          const data = res?.data ?? {}
          return {
            total: data[totalFieldName],
            list: data[recordsFieldName],
          }
        })
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
