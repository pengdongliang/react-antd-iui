import { useAntdTable } from 'ahooks'
import { useFetch } from 'use-http'
import { useContext, useState } from 'react'
import { AntdTableResult } from 'ahooks/lib/useAntdTable/types'
import type { UseAntdRowItemType, ITablePropsEitherOr } from '../ITable'
import { UseAntdTablePaginationType } from '../ITable'
import { ConfigContext } from '@/configProvider'

/**
 * 表格请求接口方法类型
 */
export type ITableRequestParamsType = (
  /** 分页数据 */
  pagination: UseAntdTablePaginationType,
  /** 表单数据 */
  formData: Record<string, unknown>
) => Promise<UseAntdRowItemType>

/**
 * 表格自定义字段类型
 */
export interface ITableRequestFieldsType {
  /** 当前页数字段 */
  current?: string
  /** 每页条数字段 */
  pageSize?: string
  /** 总数字段 */
  total?: string
  /** 列表数据字段 */
  records?: string
  /** 列表数据外层 */
  data?: string
}

/**
 * 数据钩子返回的类型
 */
export interface UseITableParamsDataResultType
  extends AntdTableResult<any, any> {
  /** 请求的所有参数对象 */
  queryParams: Record<string, any>
  /** 请求的所有url参数 */
  urlSearchParams: string
}

/**
 * 默认表格请求字段
 */
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
