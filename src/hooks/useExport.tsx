import { useFetch } from 'use-http'
import { useCallback } from 'react'
import { exportBlob } from '@/utils'
import { IRequestProps } from './index'

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
function useExport(props: UseExportProps) {
  const http = useFetch({
    responseType: 'blob',
  })

  const exportHandler = useCallback(
    async (args: ExportHandlerArgs) => {
      const {
        api,
        method = 'get',
        params,
        body,
        callback,
        fileName,
      } = { ...props, ...args }
      const { response } = http
      const queryParams = new URLSearchParams(params).toString()
      const url = (queryParams ? `${api}?${queryParams}` : api) as string
      const res = await http[method](url, body)
      if (response.ok && res instanceof Blob) {
        exportBlob(res, fileName)
        if (callback) callback()
      }
    },
    [props, http]
  )

  return { ...http, exportHandler }
}

export default useExport
