import { useState } from 'react'
import { defaultPaginationConfig } from '../config'
import type { PaginationConfigType } from '../config'

/**
 * itable表格分页配置数据
 * @param initPaginationConfig 初始化分页配置
 */
function useITablePaginationConfig(initPaginationConfig: PaginationConfigType) {
  const [paginationConfig, setPaginationConfig] = useState({
    ...defaultPaginationConfig,
    ...initPaginationConfig,
  })

  return { paginationConfig, setPaginationConfig }
}

export default useITablePaginationConfig
