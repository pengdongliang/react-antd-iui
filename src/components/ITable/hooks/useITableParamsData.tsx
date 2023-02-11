import { useAntdTable } from 'ahooks'
import { useFetch } from 'use-http'
import { useContext, useState } from 'react'
import { AntdTableResult } from 'ahooks/lib/useAntdTable/types'
import type { UseAntdRowItemType, ITablePropsEitherOr } from '../ITable'
import { UseAntdTablePaginationType } from '../ITable'
import { ConfigContext } from '@/configProvider'

export type ITableRequestParamsType = (
  pagination: UseAntdTablePaginationType,
  formData: Record<string, unknown>
) => Promise<UseAntdRowItemType>

export interface ITableRequestFieldsType {
  current?: string
  pageSize?: string
  total?: string
  // 列表数据字段
  records?: string
  // 列表数据外层
  data?: string
}

export interface UseITableParamsDataResultType
  extends AntdTableResult<any, any> {
  queryParams: Record<string, any>
  urlSearchParams: string
}

export const defaultITableRequestFields: Readonly<ITableRequestFieldsType> = {
  current: 'page',
  pageSize: 'limit',
  total: 'total',
  records: 'list',
  data: 'data',
}

/**
 * iTable表格请求方式的数据
 * @param props
 */
function useITableParamsData(
  props: ITablePropsEitherOr
): UseITableParamsDataResultType {
  const {
    getTableData,
    getTableDataApi,
    useAntdTableOptions,
    initParams,
    iTableRequestFields: propsITableRequestFields,
    requestParamsHandler,
  } = props
  let getTableDataPromise: ITableRequestParamsType | null = null
  const { isUseHttp, iTableRequestFields } = useContext(ConfigContext)
  const {
    current: currentFieldName,
    pageSize: pageSizeFieldName,
    total: totalFieldName,
    records: recordsFieldName,
    data: dataFieldName,
  } = {
    ...defaultITableRequestFields,
    ...iTableRequestFields,
    ...propsITableRequestFields,
  }
  const { get: httpGet } = useFetch()
  const [queryParams, setQueryParams] = useState({})
  const [urlSearchParams, setUrlSearchParams] = useState<string>()

  if (getTableData) {
    getTableDataPromise = getTableData
  } else if (getTableDataApi) {
    getTableDataPromise = (
      searchParams: UseAntdTablePaginationType,
      formData: Record<string, unknown>
    ): Promise<UseAntdRowItemType> => {
      const { searchParams: realSearchParams, formData: realFormData } =
        typeof requestParamsHandler === 'function'
          ? requestParamsHandler(searchParams, formData)
          : { searchParams, formData }
      const { current, pageSize } = realSearchParams ?? {}
      const paramsData = {
        [currentFieldName]: current,
        [pageSizeFieldName]: pageSize,
        ...initParams,
        ...realFormData,
      }
      const paramsFilted = {}
      let urlParams = ''
      Object.entries(paramsData).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          urlParams += `${urlParams ? '&' : ''}${key}=${encodeURI(value)}`
          paramsFilted[key] = value
        }
      })
      setQueryParams(paramsFilted)
      setUrlSearchParams(urlParams)
      const url = getTableDataApi + (urlParams ? `?${urlParams}` : '')

      if (isUseHttp) {
        return httpGet(url).then((res) => {
          const data = (dataFieldName ? res[dataFieldName] : res) ?? {}
          return {
            total: data[totalFieldName],
            list: data[recordsFieldName],
          }
        })
      }
      return fetch(url)
        .then((res) => res.json())
        .then((res) => {
          const data = (dataFieldName ? res[dataFieldName] : res) ?? {}
          return {
            total: data[totalFieldName],
            list: data[recordsFieldName],
          }
        })
    }
  }

  const tableParamsData = useAntdTable(
    getTableDataPromise as ITableRequestParamsType,
    {
      ...useAntdTableOptions,
    }
  )

  return { ...tableParamsData, queryParams, urlSearchParams }
}

export default useITableParamsData
