import { message } from 'antd'
import { Template } from '@/stories/components/ITable/template'

const ITableEditRow = Template.bind({})

ITableEditRow.args = {
  editableConfig: {
    editRowFlag: true,
    onChange: (record: Record<string, any>) => {
      // eslint-disable-next-line no-console
      console.log('editOnchange', record)
      message.success(JSON.stringify(record?.fieldsValue))
    },
  },
}

ITableEditRow.storyName = '编辑行'

export default ITableEditRow
