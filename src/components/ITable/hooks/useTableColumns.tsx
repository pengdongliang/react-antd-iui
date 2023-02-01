import { useMemo } from 'react'
import type {
  ITableProps,
  EditableConfigType,
  EditArgumentsType,
} from '../ITable'
import EditableRow from '../components/EditableRow'
import EditableCell from '../components/EditableCell'
import type { RecordType } from '../types/global'

export type editableType =
  | {
      handleSave: (args: EditArgumentsType) => void
    }
  | boolean

export type ITableColumnTypes = (Exclude<
  ITableProps['columns'],
  undefined
>[number] & {
  editable?: editableType
  dataIndex?: string
})[]

export interface useTableColumnsPropsType {
  columns: ITableColumnTypes
  editableConfig?: EditableConfigType
  serialNumber?: boolean | number
}

/**
 * 表格columns处理
 * @param props
 */
function useTableColumns(props: useTableColumnsPropsType): {
  realColumns: ITableColumnTypes
  components: any
} {
  const { columns, editableConfig = {}, serialNumber } = props

  const realColumns = useMemo(() => {
    const { onChange, editRowFlag } = editableConfig as Exclude<
      EditableConfigType,
      boolean
    >
    const mapCol = columns?.map((col) => {
      const { editable } = col
      if (!onChange || !editable) {
        return col
      }
      const { handleSave } = editable as Exclude<editableType, boolean>
      const changeHandler = editRowFlag ? onChange : handleSave || onChange
      return {
        ...col,
        onCell: (record: RecordType, rowIndex) => {
          return {
            ...col,
            record,
            rowIndex,
            changeHandler,
            editRowFlag,
          }
        },
      }
    })
    if (
      Array.isArray(mapCol) &&
      mapCol.length &&
      (serialNumber === 0 || serialNumber)
    ) {
      mapCol.unshift({
        title: '序号',
        dataIndex: 'serial$number',
        width: 62,
        render: (text, record, index) => {
          return index + (typeof serialNumber === 'number' ? serialNumber : 1)
        },
      })
    }
    return mapCol
  }, [columns, editableConfig, serialNumber]) as ITableColumnTypes

  const components = useMemo(() => {
    return editableConfig
      ? {
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }
      : {}
  }, [editableConfig])

  return { realColumns, components }
}

export default useTableColumns
