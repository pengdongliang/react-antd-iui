import { useContext } from 'react'
import { ConfigContext } from '@/configProvider'
import { ITableInstance } from '../ITable'

/**
 * Get ITable Instance
 */
export default function useITableInstance(): ITableInstance {
  const { iTable } = useContext(ConfigContext)

  return iTable
}
