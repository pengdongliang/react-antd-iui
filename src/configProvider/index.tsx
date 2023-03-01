import React, { useMemo, useState } from 'react'
import { ConfigProvider as AntdConfigProvider } from 'antd'
import { ConfigProviderProps as AntdConfigProviderProps } from 'antd/es/config-provider'
import { defaultITableRequestFields } from '@/components/ITable/hooks/useITableParamsData'
import type { ITableRequestFieldsType } from '@/components/ITable/hooks/useITableParamsData'
import { ResponseHandlerType } from '@/hooks/useRequest'
import { ITableInstance } from '@/components/ITable'

export interface ConfigProviderProps {
  /** 是否使用use-http请求 */
  isUseHttp?: boolean
  /** 表格请求字段名 */
  iTableRequestFields?: ITableRequestFieldsType
  /** antd表格全局配置项 */
  antdContextOptions?: AntdConfigProviderProps
  /** useRequest请求响应后的操作 */
  responseHandler?: ResponseHandlerType
  /** ITable Instance */
  setITable?: React.Dispatch<ITableInstance>
  /** ITable Instance */
  iTable?: ITableInstance
}

export const ConfigContext = React.createContext<ConfigProviderProps>({})

/**
 * IUI全局上下文配置
 * @param props
 * @constructor
 */
const ConfigProvider: React.FC<React.PropsWithChildren<ConfigProviderProps>> = (
  props
) => {
  const {
    children,
    isUseHttp,
    iTableRequestFields,
    antdContextOptions,
    responseHandler,
  } = props

  const [iTable, setITable] = useState<ITableInstance>()

  const configContextData = useMemo<ConfigProviderProps>(
    () => ({
      isUseHttp: isUseHttp ?? true,
      iTableRequestFields: iTableRequestFields ?? defaultITableRequestFields,
      antdContextOptions,
      responseHandler,
      setITable,
      iTable,
    }),
    [
      isUseHttp,
      iTableRequestFields,
      antdContextOptions,
      responseHandler,
      iTable,
    ]
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
