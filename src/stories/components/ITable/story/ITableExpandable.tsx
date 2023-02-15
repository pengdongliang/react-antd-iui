import { Template } from '@/stories/components/ITable/template'

const ITableExpandable = Template.bind({})

ITableExpandable.args = {
  expandable: {
    // eslint-disable-next-line react/no-unstable-nested-components
    expandedRowRender: () => <p>111111111111111</p>,
    // 展开行的列位置
    expandIconColumnIndex: 2,
  },
}

ITableExpandable.storyName = '展开行'

export default ITableExpandable
