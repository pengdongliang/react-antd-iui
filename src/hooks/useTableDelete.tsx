import { ModalFuncProps } from 'antd/es/modal'
import { message, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import React, { useCallback } from 'react'
import { useFetch } from 'use-http'
import { IRequestProps } from './index'

/**
 * 删除处理函数参数类型
 */
export interface DeleteHandlerArgs extends Partial<IRequestProps> {
  /** 内容, 默认是否删除 */
  content?: string
  /** 成功回调函数 */
  callback?: (args?: Record<string, any>) => void
}

/**
 * 表格删除钩子props
 */
export interface UseTableDeleteProps extends ModalFuncProps, DeleteHandlerArgs {
  /** 内容, 默认是否删除 */
  content?: string
}

/**
 * 表格删除钩子
 * @param props
 */
function useTableDelete(props?: UseTableDeleteProps | string) {
  let realContent = '是否删除'
  if (typeof props === 'string') {
    realContent = props
  } else {
    const { content: propsContent } = props ?? {}
    realContent = propsContent as string
  }
  const http = useFetch()

  const deleteHandler = useCallback(
    (args: DeleteHandlerArgs) => {
      const realArgs = { ...(typeof props === 'string' ? {} : props), ...args }
      const { api, method = 'delete', params, body, callback } = realArgs
      Modal.confirm({
        title: '删除提示',
        icon: <ExclamationCircleOutlined />,
        okText: '确定',
        okType: 'danger',
        closable: true,
        cancelButtonProps: { style: { display: 'none' } },
        async onOk() {
          const queryParams = new URLSearchParams(params).toString()
          const url = (queryParams ? `${api}?${queryParams}` : api) as string
          const { code, msg } = await http[method](url, body)
          if (code === '200') {
            message.success('删除成功')
            if (callback) callback({ ...params, ...body })
          } else {
            message.error(msg || '删除失败')
          }
        },
        ...(typeof props === 'string' ? {} : props),
        content: args?.content ?? realContent,
      })
    },
    [realContent, props, http]
  )
  return { ...http, deleteHandler }
}

export default useTableDelete
