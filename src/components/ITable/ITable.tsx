import React, {
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useUpdateEffect } from 'ahooks'
import { Space, Table } from 'antd'
import type { TableProps } from 'antd'
import type { GetRowKey } from 'rc-table/es/interface'
import type {
  AntdTableOptions,
  Params as AntdTableParams,
} from 'ahooks/es/useAntdTable/types'
import type { PaginationConfigType } from './config'
import { defaultPaginationConfig } from './config'
import useITableParamsData, {
  ITableRequestFieldsType,
} from './hooks/useITableParamsData'
import useITablePaginationConfig from './hooks/useITablePaginationConfig'
import useSimpleITable from './hooks/useSimpleITable'
import useDefaultItableConfig from './hooks/useDefaultItableConfig'
import IForm from '../IForm/index'
import type { useTableFormType } from '../IForm/index'
import useTableColumns from './hooks/useTableColumns'
import type { useTableColumnsPropsType } from './hooks/useTableColumns'
import { TableContainerStyled } from '@/components/ITable/styled'
import type { EitherOr, RecordType, RefType } from './types/global'

export interface ItableContextType {
  iFormRef?: RefType
  rowKey?: string | GetRowKey<RecordType>
  editingRowKey?: string
  setEditingRowKey?: (key: string) => void
}

export const ItableContext = React.createContext<ItableContextType>({})

export interface EditArgumentsType {
  record: RecordType
  fieldValue: any
  fieldName: string | number
  fieldsValue: { [k: string]: any }
}

export type EditableConfigType =
  | {
      onChange: (args: EditArgumentsType) => void
      editRowFlag?: boolean
    }
  | boolean

export type UseAntdRowItemType = {
  total: number
  list: any[]
}

export interface UseAntdTablePaginationType {
  current: number
  pageSize: number
  sorter?: any
  filter?: any
  extra?: any
}

export type ItableQueryType = {
  // 获取数据接口地址，比获取表格数据方法优先
  getTableDataApi: string
  // 获取表格数据方法, 返回一个Promise
  getTableData: (
    pagination: UseAntdTablePaginationType,
    formData: Record<string, unknown>
  ) => Promise<UseAntdRowItemType>
}

export type QueryTypeEitherOr = EitherOr<
  ItableQueryType,
  'getTableDataApi',
  'getTableData'
>

export type UseAntdTableOptionsType = AntdTableOptions<
  UseAntdRowItemType,
  AntdTableParams
>

export interface InitParamsType {
  [k: string]: any
}

export interface ITableProps extends TableProps<RecordType> {
  ref?: RefType
  // useAntd使用的options
  useAntdTableOptions?: UseAntdTableOptionsType
  // 初始化分页配置
  initPaginationConfig?: PaginationConfigType
  // 初始参数, 分页初始参数不要放里面
  initParams?: InitParamsType
  // 是否阻止初始自动请求
  blockAutoRequestFlag?: boolean | 'auto'
  // 是否是简单表格, 不请求数据和分页, 使用传过来的数据
  simpleTableFlag?: boolean
  // 使用搜索栏的表单配置参数
  useTableForm?: useTableFormType
  // 编辑表格的配置参数
  editableConfig?: EditableConfigType
  // 表格请求字段名
  iTableRequestFields?: ITableRequestFieldsType
  // 是否在最左边显示序列号, 从多少开始, 默认从1开始
  serialNumber?: boolean | number
  [k: string]: any
}

export type ITablePropsEitherOr = QueryTypeEitherOr & ITableProps

const ITable: React.FC<ITablePropsEitherOr> = React.forwardRef(
  (props: ITablePropsEitherOr, ref: RefType) => {
    const {
      columns,
      useAntdTableOptions,
      initPaginationConfig = defaultPaginationConfig,
      initParams,
      blockAutoRequestFlag,
      simpleTableFlag,
      useTableForm,
      editableConfig,
      serialNumber = true,
    } = props
    const [editingRowKey, setEditingRowKey] = useState('')
    const iFormRef: RefType = useRef(null)
    // 分页
    const { paginationConfig } = useITablePaginationConfig(initPaginationConfig)
    // 数据处理
    const defaultParams = useMemo(
      () => [{ ...paginationConfig }, { ...initParams }],
      [paginationConfig, initParams]
    )
    const onBefore = (params: AntdTableParams) => {
      if (
        editingRowKey &&
        (editableConfig as Exclude<EditableConfigType, boolean>)?.editRowFlag
      ) {
        setEditingRowKey('')
      }
      if (typeof useAntdTableOptions?.onBefore === 'function') {
        useAntdTableOptions?.onBefore(params)
      }
    }
    const realUseAntdTableOptions = {
      onBefore,
      ...useAntdTableOptions,
      defaultParams,
      manual: blockAutoRequestFlag,
      ...(useTableForm ? { form: iFormRef?.current?.formRef } : {}),
    } as UseAntdTableOptionsType
    const usetableParamsData = useITableParamsData({
      ...props,
      useAntdTableOptions: realUseAntdTableOptions,
    })
    const { tableProps } = usetableParamsData
    const run = useCallback(
      (args = {}) => {
        const { current, pageSize } = paginationConfig
        usetableParamsData.run({ current, pageSize }, { ...args })
      },
      [paginationConfig, usetableParamsData]
    )

    useImperativeHandle(ref, () => ({
      ...usetableParamsData,
      run,
    }))

    useUpdateEffect(() => {
      if (blockAutoRequestFlag === 'auto') run(initParams)
    }, [initParams])

    // 简单表格
    const useSimpleITableData = useSimpleITable({
      blockAutoRequestFlag,
      simpleTableFlag,
      tableProps,
      propsDataSource: props?.dataSource as RecordType[],
    })
    // 默认antd表格配置
    const defaultItableConfig = useDefaultItableConfig(props)

    let rowKey = props.rowKey || defaultItableConfig.rowKey
    if (typeof rowKey === 'function') rowKey = ''

    // 处理表格columns
    const { realColumns, components } = useTableColumns({
      columns,
      editableConfig,
      serialNumber,
    } as useTableColumnsPropsType)

    // 是否编辑表格
    const editableData = useMemo(() => {
      if (!editableConfig) return {}
      return {
        components,
        rowClassName: () => 'itable-editable-row',
      }
    }, [editableConfig, components])

    const ItableContextData: ItableContextType = useMemo(
      () => ({
        iFormRef,
        rowKey,
        editingRowKey,
        setEditingRowKey,
      }),
      [rowKey, editingRowKey]
    )

    return (
      <ItableContext.Provider value={ItableContextData}>
        <Space direction="vertical" style={{ display: 'flex' }}>
          {useTableForm ? (
            <IForm
              {...usetableParamsData?.search}
              initParams={initParams}
              useTableForm={useTableForm}
              columns={columns}
              ref={iFormRef}
            />
          ) : null}
          {props.children}
          <TableContainerStyled>
            <Table
              {...defaultItableConfig}
              {...editableData}
              {...props}
              {...tableProps}
              {...useSimpleITableData}
              columns={realColumns}
            />
          </TableContainerStyled>
        </Space>
      </ItableContext.Provider>
    )
  }
)

ITable.displayName = 'ITable'

export default ITable
