import { message } from 'antd'
import { Template } from '@/stories/components/ITable/template'

const ITableEditCol = Template.bind({})

ITableEditCol.args = {
  editableConfig: {
    // column.editable=true回车或失去焦点会执行onChange
    onChange: (record: Record<string, any>) => {
      // eslint-disable-next-line no-console
      console.log('editOnchange', record)
      message.success(JSON.stringify(record?.fieldsValue))
    },
  },
}

ITableEditCol.storyName = '编辑单元格'

export default ITableEditCol
