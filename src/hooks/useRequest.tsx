import useFetch, { ReqMethods } from 'use-http'
import { useCallback, useContext } from 'react'
import { message } from 'antd'
import { RecordType } from '~/src'
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
  responseDataHander?: (args?: Record<string, any>) => Promise<any>
  /** 请求成功提示语 */
  responseSuccessText?: string
  /** 请求失败提示语 */
  responseErrorText?: string
}

/**
 * 网络请求props类型
 */
export interface UseRequestProps extends Pick<IRequestProps, 'api'> {
  /** fetch options 增加了params, 修改body为对象 */
  options?: Omit<RequestInit, 'body'> & Pick<IRequestProps, 'params' | 'body'>
  /** 响应后的操作 */
  responseHandler?: ResponseHandlerType
}

/**
 * 网络请求
 * @param props
 */
function useRequest(props: UseRequestProps) {
  const { options = {} } = props
  const http = useFetch(options)
  const { responseHandler: contextResponseHandler } = useContext(ConfigContext)

  const run = useCallback(
    async (args: RunHandlerArgs) => {
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
        responseDataHander,
        responseSuccessText = '请求成功',
        responseErrorText = '请求失败',
      } = { ...contextResponseHandler, ...responseHandler }
      const { method = 'get', body, params } = runOptions
      const { response, error } = http
      const queryParams = new URLSearchParams(params).toString()
      const url = (queryParams ? `${runApi}?${queryParams}` : runApi) as string
      const res = await http[method](url, body)
      return new Promise<RecordType>((resolve, reject) => {
        if (response.ok) {
          if (typeof responseDataHander === 'function') {
            responseDataHander(res)
              .then((v) => resolve(v))
              .catch((e) => reject(e))
          } else {
            const { data, code, msg } = res
            if (code === '200' || code === 200) {
              message.success(responseSuccessText)
              resolve(data)
            } else {
              message.error(msg || responseErrorText)
              reject(error)
            }
          }
        } else {
          message.error(error.message || responseErrorText)
          reject(error.message)
        }
      })
    },
    [contextResponseHandler, http, props]
  )

  return { ...http, run }
}

export default useRequest
