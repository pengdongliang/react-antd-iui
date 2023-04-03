import { ComponentStory } from '@storybook/react'
import zhCN from 'antd/locale/zh_CN'
import { App, Button, message, Space } from 'antd'
import { Provider as HttpProvider } from 'use-http'
import { ITable } from '@/index'
import ConfigProvider from '@/configProvider'
import 'dayjs/locale/zh-cn'

export const Template: ComponentStory<typeof ITable> = (args) => {
  const apiOptions: any = {
    /** 没网络的时候请求返回了上一次的数据, 原因`use-http`它正在发出另一个http请求时才会重置, 如果有错误，则应在每次请求时重置。 */
    cachePolicy: 'no-cache',
    timeout: 60 * 1000,
    responseType: 'json',
    interceptors: {
      request: async ({ options }: any) => {
        options = {
          ...options,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            ...options.headers,
          },
        }

        if (options.body instanceof FormData) {
          delete options.headers['Content-Type']
        }

        return options
      },
      response: async ({ response }: any) => {
        return response
      },
    },
    onError: (error: any) => {
      const Console = console
      Console.log(error)
    },
    onTimeout() {
      message.error('请求超时')
    },
  }

  return (
    <HttpProvider url="https://randomuser.me" options={apiOptions}>
      <ConfigProvider
        responseHandler={{ successFunc: () => true }}
        antdContextOptions={{ locale: zhCN }}
      >
        <App>
          <ITable {...args}>
            <Space>
              <Button key="add">添加</Button>
              <Button key="syncRefresh">导出</Button>
            </Space>
          </ITable>
        </App>
      </ConfigProvider>
    </HttpProvider>
  )
}
