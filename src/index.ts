export {
  ITable,
  ItableContext,
  IForm,
  IInput,
  useITableInstance,
} from './components'

export type {
  IFormItemType,
  UseTableFormType,
  IFormProps,
  IFormRef,
  ItableContextType,
  EditArgumentsType,
  EditableConfigType,
  UseAntdRowItemType,
  UseAntdTablePaginationType,
  ItableQueryType,
  QueryTypeEitherOr,
  UseAntdTableOptionsType,
  InitParamsType,
  ITableProps,
  ITablePropsEitherOr,
  ITableRef,
  ITableInstance,
  PaginationConfigType,
  ITableRequestParamsType,
  ITableRequestFieldsType,
  UseITableParamsDataResultType,
  EditableType,
  ITableColumnTypes,
  ITableColumnObjTypes,
  SortConfigType,
  IInputProps,
  IInputRef,
} from './components'

export type {
  JSONResponse,
  TableResponseData,
  TableResponse,
  RecordType,
  EitherOr,
  RefType,
} from './components/ITable/types/global'

export { default as ConfigProvider } from './configProvider'
export type { ConfigProviderProps } from './configProvider'
export * from 'ahooks'
export { useRequest as useAHooksRequest } from 'ahooks'
export {
  useExport,
  useTableDelete,
  useRequest,
  useRemoveInputSpaces,
} from './hooks'
export type {
  UseExportProps,
  DeleteHandlerArgs,
  UseTableDeleteProps,
  IRequestProps,
  UseRequestProps,
  ResponseHandlerType,
  RequestHandlerArgs,
  UseRequestOptionsType,
  UseRequestResponseFieldsType,
  UseRemoveInputSpacesProps,
} from './hooks'
