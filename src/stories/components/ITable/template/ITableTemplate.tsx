import { ComponentStory } from '@storybook/react'
import zhCN from 'antd/locale/zh_CN'
import { App } from 'antd'
import { ITable } from '@/index'
import ConfigProvider from '@/configProvider'

export const Template: ComponentStory<typeof ITable> = (args) => (
  <ConfigProvider
    responseHandler={{ successFunc: () => true }}
    isUseHttp={false}
    antdContextOptions={{ locale: zhCN }}
  >
    <App>
      <ITable {...args} />
    </App>
  </ConfigProvider>
)
