# react-antd-iui

[![NPM version][antd-schema-form-image]][antd-schema-form-url]
[![NPM version][react-image]][react-url]
[![NPM version][react-dom-image]][react-dom-url]
[![NPM version][ant-design-image]][ant-design-url]

[antd-schema-form-image]: https://img.shields.io/npm/v/react-antd-iui.svg?style=flat
[antd-schema-form-url]: https://npmjs.org/package/react-antd-iui

[react-image]: https://img.shields.io/badge/react-%3E=16.8.0-red.svg
[react-url]: https://github.com/facebook/react

[react-dom-image]: https://img.shields.io/badge/react--dom-%3E=16.8.0-red.svg
[react-dom-url]: https://github.com/facebook/react

[ant-design-image]: https://img.shields.io/badge/ant--design-%3E=4-red.svg
[ant-design-url]: https://github.com/ant-design/ant-design

### react-antd常用二次封装组件

## 组件功能

1. [x] [**ITable**](./src/components/ITable/README.md)

### 扩展的属性和方法

#### **ITable**

| 参数                         | 说明                                                  | 类型                                  | 默认值   |
|----------------------------|-----------------------------------------------------|-------------------------------------|-------|
| getTableDataApi            | 请求数据的Api                                            | `string`                            | -     |
| getTableData               | 请求数据的方法, **注意和 `getTableDataApi` 不能同时使用**           | `() => Promise<UseAntdRowItemType>` | -     |
| initPaginationConfig       | 初始化分页数据                                             | `PaginationConfigType`              | -     |
| initParams                 | 初始化表单数据                                             | `InitParamsType`                    | -     |
| blockAutoRequestFlag       | `true`: 阻止初始内置自动请求, `auto` : `initParams` 数据更新后自动请求 | `boolean` / `'auto'`                | false |
| simpleTableFlag            | 简单表格, 只展示表格数据, 适用于展示一些不用请求网络的静态表格                   | `boolean`                           | false |
| useAntdTableOptions        | `useAntdTable` 的配置参数                                | `UseAntdTableOptionsType`           | -     |
| useTableForm               | 使用搜索栏的表单配置参数                                        | `useTableFormType`                  | -     |
| editableConfig             | 编辑表格的配置参数                                           | `EditableConfigType`                | -     |
| editableConfig.editRowFlag | `true` : 编辑行, `false` : 编辑单元格                       | `boolean`                           | false |
| editableConfig.onChange    | 配置了的话保存优先使用                                         | `(args: EditArgumentsType) => void` | -     |
| children                   | 表格与搜索栏之间的插槽                                         | `React.ReactNode`                   | -     |

#### **useTableForm**

| 参数                  | 说明                  | 类型                | 默认值 |
|---------------------|---------------------|-------------------|-----|
| formProps           | 表单 `Form` 的 `props` | `FormProps`       | -   |
| formItemOptions     | 表单 `Form.Item` 配置   | `IFormItemType[]` | -   |
| formItemAppendNodes | 按钮组, 追加到表单按钮后面      | `React.ReactNode` | -   |
| formItemRowNodes    | 表单追加一行元素            | `React.ReactNode` | -   |

#### **IFormItemType**

| 参数            | 说明                       | 类型                | 默认值 |
|---------------|--------------------------|-------------------|-----|
| name          | 表单 `name`                | `string`          | -   |
| formItemProps | 表单 `Form.Item` 的 `props` | `FormItemProps`   | -   |
| itemName      | 表单元素名称                   | `string`          | -   |
| itemProps     | 表单元素的 `props`            | `any`             | -   |
| optionProps   | 表单元素 `option` 的 `props`  | `any`             | -   |
| itemNode      | 表单元素, 如传了优先使用            | `React.ReactNode` | -   |

#### **ConfigProvider 全局配置**

| 参数                  | 说明                               | 类型                        | 默认值                                                                     |
|---------------------|----------------------------------|---------------------------|-------------------------------------------------------------------------|
| isUseHttp           | 是否使用 `use-http` 请求, 否则使用 `fetch` | `boolean`                 | true                                                                    |
| iTableRequestFields | 表格请求字段名                          | `ITableRequestFieldsType` | { current: 'page', pageSize: 'limit', total: 'total', records: 'list' } |
| antdContextOptions  | antd表格全局配置项, **注意上下文顺序**         | `AntdConfigProviderProps` | -                                                                       |

### 使用示例

```typescript jsx
// 手动请求数据
itableRef.current?.run(...params)

// 刷新
itableRef.current?.refresh()

// 自动请求数据
let initParams = {}
setTimeout(() => {
  initParams = { name: 'jack' }
}, 500)
< ITable
initParams = { initParams }
/>

// 简单表格
<ITable
  columns={columns}
  dataSource={dataSource}
  simpleTableFlag
  blockAutoRequestFlag
  // 简单表格, 必须传getTableData或者getTableDataApi, 值随便传, 不会使用到
  getTableData={(pagination, formData) => {
    // eslint-disable-next-line no-console
    console.log('pagination, formData', pagination, formData)
    return Promise.resolve({ total: 1, list: [] })
  }}
/>

// 如果外层样式TableStyled是styled(Table), 使用as="div"
<TableStyled as="div">
  <ITable />
</TableStyled>
```

### 默认配置文件config.ts

| 参数                      | 说明         | 类型                       | 默认值                                                                   |
|-------------------------|------------|--------------------------|-----------------------------------------------------------------------|
| defaultPaginationConfig | 基础分页配置     | `PaginationConfigType`   | {current: 1,pageSize: 10,total: 0,pageSizeOptions: [10, 20, 50, 100]} |
| defaultTableConfig      | 默认antd表格配置 | `TableProps<RecordType>` | {rowKey: 'id', bordered: true, scroll: { x: '100%' } }                |

## LICENSE

MIT
