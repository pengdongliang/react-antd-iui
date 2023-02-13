import { ReqMethods } from 'use-http'

export interface IRequestProps {
  /** 请求地址 */
  api: string
  /** 请求方式 */
  method?: keyof ReqMethods<any>
  /** 请求url参数 */
  params?: Record<string, any>
  /** 请求body */
  body?: Record<string, any>
}
