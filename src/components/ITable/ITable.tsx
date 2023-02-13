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
  UseITableParamsDataResultType,
} from './hooks/useITableParamsData'
import useITablePaginationConfig from './hooks/useITablePaginationConfig'
import useSimpleITable from './hooks/useSimpleITable'
import useDefaultItableConfig from './hooks/useDefaultItableConfig'
import IForm from '../IForm/index'
import type { UseTableFormType } from '../IForm/index'
import useTableColumns from './hooks/useTableColumns'
import type { UseTableColumnsPropsType } from './hooks/useTableColumns'
import { TableContainerStyled } from '@/components/ITable/styled'
import type { EitherOr, RecordType, RefType } from './types/global'
import { IFormRefType } from '@/components/IForm/IForm'

/**
 * 表格上下文类型
 */
export interface ItableContextType {
  /** 搜索栏Form Ref */
  iFormRef?: RefType
  /** 表格行key */
  rowKey?: string | GetRowKey<RecordType>
  /** 编辑行Key */
  editingRowKey?: string
  /** 设置编辑行Key */
  setEditingRowKey?: (key: string) => void
}

export const ItableContext = React.createContext<ItableContextType>({})

/**
 * 编辑回调方法的参数
 */
export interface EditArgumentsType {
  /** 当前行数据 */
  record: RecordType
  /** 当前编辑的值 */
  fieldValue: any
  /** 当前编辑的字段名 */
  fieldName: string | number
  /** 编辑行的行表单数据 */
  fieldsValue: { [k: string]: any }
}

/**
 * 编辑配置类型
 */
export type EditableConfigType =
  | {
      onChange: (args: EditArgumentsType) => void
      editRowFlag?: boolean
    }
  | boolean

/**
 * 数据类型
 */
export type UseAntdRowItemType = {
  total: number
  list: any[]
}

/**
 * 分页数据
 */
export interface UseAntdTablePaginationType {
  current: number
  pageSize: number
  sorter?: any
  filter?: any
  extra?: any
}

export type ItableQueryType = {
  /** 获取数据接口地址，比获取表格数据方法优先 */
  getTableDataApi: string
  /** 获取表格数据方法, 返回一个Promise */
  getTableData: (
    pagination: UseAntdTablePaginationType,
    formData: Record<string, unknown>
  ) => Promise<UseAntdRowItemType>
}

/**
 * 获取数据参数类型
 */
export type QueryTypeEitherOr = EitherOr<
  ItableQueryType,
  'getTableDataApi',
  'getTableData'
>

/**
 * 表格options
 */
export type UseAntdTableOptionsType = AntdTableOptions<
  UseAntdRowItemType,
  AntdTableParams
>

export interface InitParamsType {
  [k: string]: any
}

/**
 * ITable Ref类型
 */
export type ITableRef = React.Ref<
  UseITableParamsDataResultType & {
    dataSource?: Record<string, any>[]
  }
>

/**
 * 表格props类型初始
 */
export interface ITableProps extends TableProps<RecordType> {
  /** useAntd使用的options */
  useAntdTableOptions?: UseAntdTableOptionsType
  /** 初始化分页配置 */
  initPaginationConfig?: PaginationConfigType
  /** 初始参数, 分页初始参数不要放里面 */
  initParams?: InitParamsType
  /** 是否阻止初始自动请求 */
  blockAutoRequestFlag?: boolean | 'auto'
  /** 是否是简单表格, 不请求数据和分页, 使用传过来的数据 */
  simpleTableFlag?: boolean
  /** 使用搜索栏的表单配置参数 */
  useTableForm?: UseTableFormType
  /** 编辑表格的配置参数 */
  editableConfig?: EditableConfigType
  /** 表格请求字段名 */
  iTableRequestFields?: ITableRequestFieldsType
  /** 是否在最左边显示序列号, 从多少开始, 默认从1开始 */
  serialNumber?: boolean | number
  /** 在请求之前额外处理请求参数 */
  requestParamsHandler?: (
    searchParams: UseAntdTablePaginationType,
    formData: Record<string, unknown>
  ) => {
    /** 分页数据 */
    searchParams: UseAntdTablePaginationType
    /** 表单数据 */
    formData: Record<string, unknown>
  }
  /** 传入getTableDataApi时使用的请求方式, 默认为get请求 */
  getTableDataRequestMethod?: 'get' | 'post'
}

/**
 * 表格props类型
 */
export type ITablePropsEitherOr = QueryTypeEitherOr & ITableProps

const ITable = React.forwardRef(
  (props: ITablePropsEitherOr, ref: ITableRef) => {
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
      pagination: paginationProps,
    } = props
    const [editingRowKey, setEditingRowKey] = useState('')
    const iFormRef: IFormRefType = useRef(null)
    /** 分页 */
    const { paginationConfig } = useITablePaginationConfig(initPaginationConfig)
    /** 数据处理 */
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
      dataSource:
        Array.isArray(usetableParamsData?.data?.list) &&
        usetableParamsData?.data?.list?.length
          ? usetableParamsData?.data?.list
          : useSimpleITableData?.dataSource,
    }))

    useUpdateEffect(() => {
      if (blockAutoRequestFlag === 'auto') run(initParams)
    }, [initParams])

    /** 简单表格 */
    const useSimpleITableData = useSimpleITable({
      blockAutoRequestFlag,
      simpleTableFlag,
      tableProps,
      propsDataSource: props?.dataSource as RecordType[],
      paginationProps,
    })
    /** 默认antd表格配置 */
    const defaultItableConfig = useDefaultItableConfig(props)

    let rowKey = props.rowKey || defaultItableConfig.rowKey
    if (typeof rowKey === 'function') rowKey = ''

    /** 处理表格columns */
    const { realColumns, components } = useTableColumns({
      columns,
      editableConfig,
      serialNumber,
    } as UseTableColumnsPropsType)

    /** 是否编辑表格 */
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
