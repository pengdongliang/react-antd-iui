import useFetch, { ReqMethods } from 'use-http'
import { useCallback, useContext, useState } from 'react'
import { message } from 'antd'
import { IncomingOptions } from 'use-http/dist/cjs/types'
import { ConfigContext } from '@/configProvider'
import { filterRequestParams } from '@/utils'

export interface IRequestProps {
  /** 请求地址 */
  api?: string
  /** 请求方式 */
  method?: keyof ReqMethods<any>
  /** 请求url参数 */
  params?: Record<string, any>
  /** 请求body */
  body?: Record<string, any>
}

/**
 * 运行处理函数参数类型
 */
export type RequestHandlerArgs = Partial<UseRequestProps>

/**
 * 响应字段类型 {code, data, msg, successReturn}
 */
export interface UseRequestResponseFieldsType {
  /** 响应code, 默认code */
  code?: string
  /** 响应成功后返回的字段, 否则返回整个res, 默认空 */
  data?: string
  /** 响应信息, 默认msg */
  msg?: string
}

/**
 * 响应后的操作类型
 */
export interface ResponseHandlerType {
  /** 成功后处理数据方法 */
  responseDataHandler?: (res?: Record<string, any>) => Promise<any>
  /** 请求成功提示语 */
  responseSuccessText?: string
  /** 请求失败提示语 */
  responseErrorText?: string
  /** 响应字段 */
  responseFields?: UseRequestResponseFieldsType
  /** 响应判断是否成功的方法, 默认['200', 200].includes(code) */
  successFunc?: (res?: Record<string, any>) => boolean
}

/** 网络请求options类型 */
export type UseRequestOptionsType = IncomingOptions &
  Pick<IRequestProps, 'params' | 'body'> & {
    /** 过滤请求参数值, 默认过滤`undefined和""` */
    filterRequestValue?: true | ((key: string, value: any) => any)
  }

/**
 * 网络请求props类型
 */
export interface UseRequestProps {
  api?: IRequestProps['api']
  /** fetch options 增加了params, 修改body为对象 */
  options?: UseRequestOptionsType
  /** 响应后的操作 */
  responseHandler?: ResponseHandlerType
}

/**
 * 网络请求，使用参考 `Fetch` 和 `use-http` 文档, 支持全局和使用时处理响应结果
 * 全局上下文配置 `isUseHttp = true` 使用 `use-http` 请求， 否则使用 `Fetch`
 * @param props
 */
function useRequest(props?: string | UseRequestProps) {
  const { options = {} } = typeof props === 'string' ? {} : props ?? {}
  const http = useFetch(options)
  const [loading, setLoading] = useState(false)
  const { responseHandler: contextResponseHandler, isUseHttp } =
    useContext(ConfigContext)

  const defaultSuccessFunc = (res) => {
    const { code } = res
    return ['200', 200].includes(code)
  }

  const responseFunc = useCallback(
    ({ realResponseHandler, error, response, res, responseType, method }) => {
      return new Promise<Record<string, any>>((resolve, reject) => {
        const {
          responseDataHandler,
          responseSuccessText,
          responseErrorText = '请求失败',
          responseFields,
          successFunc = defaultSuccessFunc,
        } = realResponseHandler
        if (response.ok) {
          if (responseType === 'json') {
            if (typeof responseDataHandler === 'function') {
              responseDataHandler(res)
                .then((v) => resolve(v))
                .catch((e) => reject(e))
            } else {
              const {
                code: codeFieldName = 'code',
                data: dataFieldName,
                msg: msgFieldName = 'msg',
              } = responseFields ?? {}
              if (res) {
                const code = res[codeFieldName]
                const data = res[dataFieldName]
                const msg = res[msgFieldName]
                if (successFunc({ ...res, code, data, msg })) {
                  if (responseSuccessText) {
                    message.success(responseSuccessText)
                  }
                  resolve(data ?? res)
                } else {
                  if (responseErrorText) message.error(msg || responseErrorText)
                  reject(error)
                }
              } else {
                if (responseErrorText) message.error(responseErrorText)
                reject(error)
              }
            }
          } else {
            resolve(res)
          }
        } else {
          if (error?.message || responseErrorText) {
            message.error(error?.message || responseErrorText)
          }
          reject(error?.message || responseErrorText)
        }
      })
    },
    []
  )

  const request = useCallback(
    async (args?: string | RequestHandlerArgs) => {
      const realArgs = {
        ...(typeof props === 'string' ? { api: props } : props),
        ...(typeof args === 'string' ? { api: args } : args),
      }
      const {
        api: requestApi,
        options: requestOptions = {},
        responseHandler,
      } = realArgs
      if (!requestApi) {
        throw new Error('请求地址不能为空')
      }
      const realResponseHandler = {
        ...contextResponseHandler,
        ...responseHandler,
      }
      const {
        method = 'get',
        body,
        params,
        filterRequestValue,
      } = requestOptions
      const { response, error } = http
      const queryParams = new URLSearchParams(
        filterRequestParams(params, filterRequestValue)
      ).toString()
      const url = (
        queryParams ? `${requestApi}?${queryParams}` : requestApi
      ) as string
      const responseType = (requestOptions?.responseType ??
        options?.responseType ??
        'json') as string
      if (isUseHttp) {
        await http[method](url, body)
        const res = await response[responseType]()
        return responseFunc({
          realResponseHandler,
          error,
          response,
          res,
          responseType,
          method,
        })
      }
      setLoading(true)
      return fetch(url, {
        ...(options as RequestInit),
        method,
        ...(body ? { body: JSON.stringify(body) } : {}),
      })
        .then(async (res) => {
          return responseFunc({
            realResponseHandler,
            error: undefined,
            response: res,
            res: await res[responseType](),
            responseType,
            method,
          })
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [contextResponseHandler, http, isUseHttp, options, props, responseFunc]
  )
  return { ...http, request, loading: isUseHttp ? http?.loading : loading }
}

export default useRequest
