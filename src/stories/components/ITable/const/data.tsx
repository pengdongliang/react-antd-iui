import { Button, DatePicker, Typography } from 'antd'
import { ITableProps, RecordType } from '@/index'
import { getInRecentDaysQuickAction } from '@/utils'

export const tableData = [
  {
    gender: 'male',
    name: {
      title: 'Mr',
      first: 'Frank-Peter',
      last: 'Bamberger',
    },
    location: {
      street: {
        number: 4982,
        name: 'Gartenstraße',
      },
      city: 'Berka/Werra',
      state: 'Sachsen',
      country: 'Germany',
      postcode: 59179,
      coordinates: {
        latitude: '-51.4016',
        longitude: '-29.9109',
      },
      timezone: {
        offset: '+1:00',
        description: 'Brussels, Copenhagen, Madrid, Paris',
      },
    },
    email: 'frank-peter.bamberger@example.com',
    login: {
      uuid: '407751c8-c08a-4e49-91b2-ebc57c6177b2',
      username: 'sadcat912',
      password: 'anita',
      salt: 'XbIQ5rMM',
      md5: 'c47a938093fdc7aa542d40e7a2488394',
      sha1: '493b49df25bb2c45befb61bc7c27dd884eadf159',
      sha256:
        'e61cf68c5919890a84070ca0202d6bfea174f6a2232a740c6226a17ee9a161fc',
    },
    dob: {
      date: '1984-03-30T10:28:11.898Z',
      age: 38,
    },
    registered: {
      date: '2018-07-05T22:26:22.283Z',
      age: 4,
    },
    phone: '0473-1447124',
    cell: '0176-7086115',
    id: '1',
    picture: {
      large: 'https://randomuser.me/api/portraits/men/34.jpg',
      medium: 'https://randomuser.me/api/portraits/med/men/34.jpg',
      thumbnail: 'https://randomuser.me/api/portraits/thumb/men/34.jpg',
    },
    nat: 'DE',
  },
  {
    gender: 'male',
    name: {
      title: 'Mr',
      first: 'Albert',
      last: 'Sánchez',
    },
    location: {
      street: {
        number: 6810,
        name: 'Calle de Ángel García',
      },
      city: 'Elche',
      state: 'País Vasco',
      country: 'Spain',
      postcode: 64035,
      coordinates: {
        latitude: '-38.5165',
        longitude: '-17.2339',
      },
      timezone: {
        offset: '-2:00',
        description: 'Mid-Atlantic',
      },
    },
    email: 'albert.sanchez@example.com',
    login: {
      uuid: 'ac1ca128-d3e5-400d-aab3-e94238f34ead',
      username: 'ticklishbird294',
      password: 'nikki1',
      salt: 'tkmH9mq6',
      md5: '1d6007c7b23e5d74950be1d423e009a2',
      sha1: 'f4dc74cbd33027553edfa0783fcb61a4bb1461d0',
      sha256:
        'fa6b04498530ddc8e277202f44a98b9d75cc4ef2a034466b4009d48089746671',
    },
    dob: {
      date: '1968-01-11T01:25:19.395Z',
      age: 54,
    },
    registered: {
      date: '2014-11-24T15:39:19.532Z',
      age: 8,
    },
    phone: '983-225-179',
    cell: '641-570-439',
    id: 2,
    picture: {
      large: 'https://randomuser.me/api/portraits/men/19.jpg',
      medium: 'https://randomuser.me/api/portraits/med/men/19.jpg',
      thumbnail: 'https://randomuser.me/api/portraits/thumb/men/19.jpg',
    },
    nat: 'ES',
  },
  {
    gender: 'male',
    name: {
      title: 'Mr',
      first: 'Miguel',
      last: 'Williams',
    },
    location: {
      street: {
        number: 8330,
        name: 'Oak Ridge Ln',
      },
      city: 'Sydney',
      state: 'Tasmania',
      country: 'Australia',
      postcode: 8721,
      coordinates: {
        latitude: '-81.8400',
        longitude: '-102.2533',
      },
      timezone: {
        offset: '-2:00',
        description: 'Mid-Atlantic',
      },
    },
    email: 'miguel.williams@example.com',
    login: {
      uuid: '6a3c5339-2ce6-428c-976f-ecff7134a06b',
      username: 'sadlion798',
      password: 'keisha',
      salt: '5BjEJESH',
      md5: 'e72396cdedc483a89333dcae79250c10',
      sha1: 'ca108a4cfbe0e0bf7386ce1f5474a1b4972c1fe5',
      sha256:
        '58c5be0084595c5e09768327b766eac11b9f8cd9f021203d37277e4eb75a3a86',
    },
    dob: {
      date: '1946-05-13T11:40:39.931Z',
      age: 76,
    },
    registered: {
      date: '2002-06-09T16:53:20.134Z',
      age: 20,
    },
    phone: '06-9109-7509',
    cell: '0451-771-342',
    id: 3,
    picture: {
      large: 'https://randomuser.me/api/portraits/men/78.jpg',
      medium: 'https://randomuser.me/api/portraits/med/men/78.jpg',
      thumbnail: 'https://randomuser.me/api/portraits/thumb/men/78.jpg',
    },
    nat: 'AU',
  },
  {
    gender: 'female',
    name: {
      title: 'Mrs',
      first: 'Mackenzie',
      last: 'Jones',
    },
    location: {
      street: {
        number: 6879,
        name: 'Crawford Street',
      },
      city: 'Porirua',
      state: 'Marlborough',
      country: 'New Zealand',
      postcode: 70246,
      coordinates: {
        latitude: '85.5217',
        longitude: '-41.0851',
      },
      timezone: {
        offset: '+5:45',
        description: 'Kathmandu',
      },
    },
    email: 'mackenzie.jones@example.com',
    login: {
      uuid: 'd9ca1e72-797b-488b-9c00-cbe20fb90f83',
      username: 'organicbutterfly252',
      password: 'celine',
      salt: '9Ibz6tjR',
      md5: '38ab620314b9e12e5d2660a9989388d7',
      sha1: 'd3e0e9c362da36861f7361f3d8721ee57ba438fd',
      sha256:
        '9eb36a7aec53f19ae45e8255c6886df381960b9ce95e9b319d0396927bae3fa3',
    },
    dob: {
      date: '1967-03-01T12:51:45.288Z',
      age: 55,
    },
    registered: {
      date: '2005-09-06T00:53:20.757Z',
      age: 17,
    },
    phone: '(836)-410-1344',
    cell: '(705)-852-4176',
    id: 4,
    picture: {
      large: 'https://randomuser.me/api/portraits/women/43.jpg',
      medium: 'https://randomuser.me/api/portraits/med/women/43.jpg',
      thumbnail: 'https://randomuser.me/api/portraits/thumb/women/43.jpg',
    },
    nat: 'NZ',
  },
]

export const columns: ITableProps['columns'] = [
  // 注意：每个column设置宽度，在scroll: {x: "100%"}里是正常显示的
  {
    title: 'name',
    dataIndex: ['name', 'last'],
    fixed: true,
    width: 150,
  },
  {
    title: 'email',
    dataIndex: 'email',
    width: 100,
    formItemProps: {
      rules: [{ required: true, message: '请输入邮箱' }],
    },
    tooltip: { placement: 'topRight' },
  },
  {
    title: 'phone',
    dataIndex: 'phone',
    width: 150,
    editable: {
      handleSave: (record: RecordType) => {
        // eslint-disable-next-line no-console
        console.log('editRecord', record)
      },
    },
    align: 'center',
    sorter: true,
    sortConfig: {
      sortFieldsName: ['order11', 'orderField11'],
      /** lowerLine || smallHump || (str: string) => string */
      orderFieldName: (str) => `aaa_${str}`,
    },
    sortDirections: ['descend', 'ascend'],
    showSorterTooltip: false,
  },
  {
    title: 'gender',
    dataIndex: 'gender',
    width: 150,
    editable: true,
    sorter: true,
    sortDirections: ['ascend', 'descend'],
    sortConfig: {
      sortFieldsName: ['order', 'orderField'],
    },
  },
  {
    title: '操作',
    dataIndex: 'opt',
    width: 150,
    fixed: 'right',
    render: () => {
      /** 注意key的使用 */
      return [<Typography.Link key="preview">查看</Typography.Link>]
    },
  },
]

export const useTableForm = {
  formItemOptions: [
    {
      name: 'gender',
      itemName: 'select',
      itemProps: {
        style: { width: '120px' },
        options: [
          {
            value: 'male',
            label: 'male',
          },
          {
            value: 'lucy',
            label: 'Lucy',
          },
          {
            value: 'disabled',
            disabled: true,
            label: 'Disabled',
          },
          {
            value: 'Yiminghe',
            label: 'yiminghe',
          },
        ],
      },
      formItemProps: { initialValue: 'lucy' },
    },
    {
      name: 'name',
      itemName: 'input',
      itemProps: { placeholder: '请输入名称' },
      formItemProps: {
        label: '名称',
        // rules: [{ required: true, message: '请输入名称' }],
      },
    },
    {
      name: 'time',
      itemNode: (
        <DatePicker.RangePicker
          showTime
          style={{ width: '340px' }}
          format="YYYY-MM-DD HH:mm:ss"
          presets={getInRecentDaysQuickAction()}
        />
      ),
    },
  ],
  formItemAppendNodes: (
    <>
      <Button key="add">添加</Button>
      <Button key="syncRefresh">删除</Button>
    </>
  ),
}
