import useFetch, { ReqMethods } from 'use-http'
import { useCallback, useContext, useState } from 'react'
import { message } from 'antd'
import { IncomingOptions } from 'use-http/dist/cjs/types'
import { ConfigContext } from '@/configProvider'

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
export type RunHandlerArgs = Partial<UseRequestProps>

/**
 * 响应后的操作类型
 */
export interface ResponseHandlerType {
  /** 成功后处理数据方法 */
  responseDataHandler?: (args?: Record<string, any>) => Promise<any>
  /** 请求成功提示语 */
  responseSuccessText?: string | false
  /** 请求失败提示语 */
  responseErrorText?: string
}

/** 网络请求options类型 */
export type UseRequestOptionsType = IncomingOptions &
  Pick<IRequestProps, 'params' | 'body'>

/**
 * 网络请求props类型
 */
export interface UseRequestProps extends Pick<IRequestProps, 'api'> {
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
function useRequest(props?: UseRequestProps) {
  const { options = {} } = props ?? {}
  const http = useFetch(options)
  const { responseHandler: contextResponseHandler, isUseHttp } =
    useContext(ConfigContext)
  const [loading, setLoading] = useState(false)

  const responseFunc = ({
    responseDataHandler,
    responseSuccessText,
    responseErrorText,
    error,
    response,
    res,
    responseType,
  }) => {
    return new Promise<Record<string, any>>((resolve, reject) => {
      if (response.ok) {
        if (responseType === 'json') {
          if (typeof responseDataHandler === 'function') {
            responseDataHandler(res)
              .then((v) => resolve(v))
              .catch((e) => reject(e))
          } else {
            const { data, code, msg } = res ?? {}
            if (code) {
              if (code === '200' || code === 200) {
                if (responseSuccessText) {
                  message.success(responseSuccessText)
                }
                resolve(data)
              } else {
                message.error(msg || responseErrorText)
                reject(error)
              }
            } else if (res) {
              if (responseSuccessText) {
                message.success(responseSuccessText)
              }
              resolve(res)
            }
          }
        } else {
          resolve(res)
        }
      } else {
        message.error(error?.message || responseErrorText)
        reject(error?.message || responseErrorText)
      }
    })
  }

  const run = useCallback(
    async (args?: RunHandlerArgs) => {
      const realArgs = { ...props, ...args }
      const {
        api: runApi,
        options: runOptions = {},
        responseHandler,
      } = realArgs
      if (!runApi) {
        throw new Error('请求地址不能为空')
      }
      const {
        responseDataHandler,
        responseSuccessText = '请求成功',
        responseErrorText = '请求失败',
      } = { ...contextResponseHandler, ...responseHandler }
      const { method = 'get', body, params } = runOptions
      const { response, error } = http
      let queryParams = ''
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams += `${queryParams ? '&' : ''}${key}=${encodeURI(value)}`
        }
      })
      const url = (queryParams ? `${runApi}?${queryParams}` : runApi) as string
      const responseType = (runOptions?.responseType ??
        options?.responseType ??
        'json') as string
      if (isUseHttp) {
        await http[method](url, body)
        const res = await response[responseType]()
        return responseFunc({
          responseDataHandler,
          responseSuccessText,
          responseErrorText,
          error: undefined,
          response,
          res,
          responseType,
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
            responseDataHandler,
            responseSuccessText,
            responseErrorText,
            error,
            response: res,
            res: await res[responseType](),
            responseType,
          })
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [contextResponseHandler, http, isUseHttp, options, props]
  )

  return { ...http, run, ...(isUseHttp ? {} : { loading }) }
}

export default useRequest
