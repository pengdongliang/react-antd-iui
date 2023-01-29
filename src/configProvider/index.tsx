import React, { useMemo } from 'react'
import { ConfigProvider as AntdConfigProvider } from 'antd'
import { ConfigProviderProps as AntdConfigProviderProps } from 'antd/es/config-provider'
import { defaultITableRequestFields } from '@/components/ITable/hooks/useITableParamsData'
import type { ITableRequestFieldsType } from '@/components/ITable/hooks/useITableParamsData'

export interface configContextType {
  // 是否使用use-http请求
  isUseHttp?: boolean
  // 表格请求字段名
  iTableRequestFields?: ITableRequestFieldsType
  // antd表格全局配置项
  antdContextOptions?: AntdConfigProviderProps
}

export const ConfigContext = React.createContext<configContextType>({})

export interface ConfigProviderProps extends configContextType {
  children: React.ReactNode
}

const ConfigProvider: React.FC<ConfigProviderProps> = (props) => {
  const { children, isUseHttp, iTableRequestFields, antdContextOptions } = props
  const configContextData = useMemo(
    () => ({
      isUseHttp: isUseHttp ?? true,
      iTableRequestFields: iTableRequestFields ?? defaultITableRequestFields,
      antdContextOptions,
    }),
    [isUseHttp, iTableRequestFields, antdContextOptions]
  )

  return (
    <AntdConfigProvider {...antdContextOptions}>
      <ConfigContext.Provider value={configContextData}>
        {children}
      </ConfigContext.Provider>
    </AntdConfigProvider>
  )
}

export default ConfigProvider
