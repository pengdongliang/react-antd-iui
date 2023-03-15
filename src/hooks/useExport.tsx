import { useCallback } from 'react'
import { message } from 'antd'
import { exportBlob } from '@/utils'
import { useRequest } from './index'
import type { IRequestProps } from './index'

/**
 * 导出运行函数参数类型
 */
export interface ExportHandlerArgs extends Partial<IRequestProps> {
  /** 成功回调函数 */
  callback?: (args?: Record<string, any>) => void
  /** 导出文件名称 */
  fileName?: string
}

/**
 * 导出钩子props类型
 */
export type UseExportProps = ExportHandlerArgs

/**
 * 导出钩子
 * @param props
 */
function useExport(props?: UseExportProps) {
  const http = useRequest({
    options: {
      responseType: 'blob',
    },
  })
  const { request, ...restProps } = http

  const exportHandler = useCallback(
    async (args?: ExportHandlerArgs) => {
      const {
        api,
        method = 'get',
        params,
        body,
        callback,
        fileName,
      } = { ...props, ...args }
      if (!api) {
        throw new Error('请求地址不能为空')
      }
      const res = await request({ api, options: { method, params, body } })
      if (res instanceof Blob) {
        exportBlob(res, fileName)
        message.success('导出成功')
        if (typeof callback === 'function') callback()
      }
    },
    [props, request]
  )

  return { ...restProps, exportHandler }
}

export default useExport
