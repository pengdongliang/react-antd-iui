import { useAntdTable } from 'ahooks'
import { useContext, useState } from 'react'
import { AntdTableResult } from 'ahooks/lib/useAntdTable/types'
import type { UseAntdRowItemType, ITablePropsEitherOr } from '../ITable'
import { UseAntdTablePaginationType } from '../ITable'
import { ConfigContext } from '@/configProvider'
import { useRequest } from '@/index'
import {
  filterRequestParams,
  lowerLineToSmallHump,
  smallHumpToLowerLine,
} from '@/utils'

/**
 * 表格请求接口方法类型
 */
export type ITableRequestParamsType = (
  /** 分页数据 */
  pagination: UseAntdTablePaginationType,
  /** 表单数据 */
  formData: Record<string, any>
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
    requestOptions,
    filterRequestValue = true,
    responseDataHandler,
  } = props
  let getTableDataPromise: ITableRequestParamsType | null = null
  const { iTableRequestFields } = useContext(ConfigContext)
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
  const { request } = useRequest()
  const [queryParams, setQueryParams] = useState({})
  const [urlSearchParams, setUrlSearchParams] = useState<string>()

  if (getTableDataApi || typeof getTableData === 'function') {
    getTableDataPromise = (
      searchParams: UseAntdTablePaginationType,
      formData: Record<string, any>
    ): Promise<UseAntdRowItemType> => {
      let extraParams = {}
      const { order, field, column } = searchParams?.sorter ?? {}

      if (order && field) {
        const { sortConfig, sortDirections } = column ?? {}
        const { sortFieldsName = [], orderFieldName } = sortConfig ?? {}
        let sortType = order
        if (!Array.isArray(sortDirections) || !sortDirections.length) {
          sortType = order === 'ascend' ? 'asc' : 'desc'
        }
        let fieldName = field
        try {
          if (orderFieldName) {
            if (typeof orderFieldName === 'function') {
              fieldName = orderFieldName(field)
            } else {
              fieldName =
                orderFieldName === 'lowerLine'
                  ? smallHumpToLowerLine(field)
                  : lowerLineToSmallHump(field)
            }
          }
        } catch (err) {
          fieldName = field
          throw new Error(err as string)
        }
        extraParams = {
          [sortFieldsName[0] ?? 'order']: sortType,
          [sortFieldsName[1] ?? 'orderField']: fieldName,
        }
      }

      const { searchParams: realSearchParams, formData: realFormData } =
        typeof requestParamsHandler === 'function'
          ? requestParamsHandler(searchParams, formData, extraParams)
          : { searchParams, formData }
      const { current, pageSize } = realSearchParams ?? {}
      const paramsData = {
        [currentFieldName]: current,
        [pageSizeFieldName]: pageSize,
        ...initParams,
        ...extraParams,
        ...realFormData,
      }

      const newParamsData = filterRequestParams(paramsData, filterRequestValue)
      setQueryParams(newParamsData)
      setUrlSearchParams(new URLSearchParams(newParamsData).toString())

      const {
        method = 'get',
        params,
        body,
      } = typeof requestOptions === 'function'
        ? requestOptions({ params: newParamsData })
        : { params: newParamsData, body: undefined }

      return (getTableData ?? request)({
        api: getTableDataApi,
        options: {
          method,
          params,
          body,
          filterRequestValue,
        },
      }).then((res) => {
        let data = (dataFieldName ? res[dataFieldName] : res) ?? {}
        if (typeof responseDataHandler === 'function') {
          data = responseDataHandler(data, res)
        }
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
