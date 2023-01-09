import { defaultTableConfig } from '../config'

/**
 * 默认antd表格配置处理
 * @param props
 */
function useDefaultItableConfig(
  props: typeof defaultTableConfig
): typeof defaultTableConfig {
  return { ...defaultTableConfig, ...props }
}

export default useDefaultItableConfig
