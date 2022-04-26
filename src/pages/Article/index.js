import { Link, useNavigate } from 'react-router-dom'
import { Card, Breadcrumb, Form, Button, Radio, DatePicker, Select } from 'antd'
import 'moment/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'
import './index.scss'
import { Table, Tag, Space } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import img404 from '@/assets/error.png'
import { useEffect, useState } from 'react'
import { http } from '@/utils'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'

const { Option } = Select
const { RangePicker } = DatePicker
const Article = () => {
  // // 频道列表管理
  // const [ channelList,setChannelList ] = useState([])
  

  // useEffect(() => {
  //   const loadChannelList = async () => {
  //       const res = await http.get('./channels')
  //       setChannelList(res.data.data.channels)
  //   }
  //   loadChannelList()
  // },[])

  const { channelStore } = useStore()

  // 文章列表数据管理，统一管理数据，将来修改给setList传对象
  const [article, setArticleList] = useState({
    list: [],
    count: 0
  })

  // 文章参数管理
  const [params, setParams] = useState({
    page: 1,
    per_page: 10
  })
 
  // 发送接口请求
  // 如果异步请求函数需要依赖一些数据的变化而重新执行
  // 推荐把它写在内部
  // 统一不抽离函数到外面，只要涉及到异步请求的函数，都放到useEffect内部
  // 本质区别：写在外面每次组件更新都会重新进行函数初始化，这本身就是一次性能消耗
  // 而写到useEffect中，只会在依赖发生变化的时候，函数才会进行重新初始化
  // 避免性能损失
  useEffect(() => {
    async function fetchArticleList() {
      const res = await http.get('/mp/articles', { params })
      const { results, total_count } = res.data.data
      setArticleList({
        list: results,
        count: total_count
      })
    }
    fetchArticleList()
  }, [params])

 

  const onFinish = (values) => {
    console.log(values);
    const { status, channel_id, date } = values
    // 格式化表单数据
    const _params = {}
    if (status !== -1) {
      _params.status = status
    }
    if (channel_id) {
      _params.channel_id = channel_id
    }
    if (date) {
      _params.begin_pubdate = date[0].format('YYYY-MM-DD')
      _params.end_pubdate = date[1].format('YYYY-MM-DD') 
    }
    // 修改params参数 触发接口再次发起
    // 对象的合并是一个整体覆盖
    setParams({
       ...params,
       ..._params
    })
  }

  const data = [
    {
        id: '8218',
        comment_count: 0,
        cover: {
          images:['http://geek.itheima.net/resources/images/15.jpg'],
        },
        like_count: 0,
        pubdate: '2019-03-11 09:00:00',
        read_count: 2,
        status: 2,
        title: 'wkwebview离线化加载h5资源解决方案' 
    }
  ]

  const pageChange = (page) => {
    // 拿到当前页参数 修改params 引起接口更新
    setParams({
      ...params,
      page
    })
  }

  // 删除回调
  const delArticle = async (data) => {
    await http.delete(`/mp/articles/${data.id}`)
    // 更新列表
    setParams({
      page: 1,
      per_page: 10
    })
  }

  // 编辑
  const navigate = useNavigate()
  const goPublish = (data) => {
    navigate(`/publish?id=${data.id}`)
    // console.log(data.id);
  }

  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      width:120,
      render: cover => {
        return <img src={cover.images[0] || img404} width={80} height={60} alt="" />
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 220
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: data => <Tag color="green">审核通过</Tag>
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate'
    },
    {
      title: '阅读数',
      dataIndex: 'read_count'
    },
    {
      title: '评论数',
      dataIndex: 'comment_count'
    },
    {
      title: '点赞数',
      dataIndex: 'like_count'
    },
    {
      title: '操作',
      render: data => {
        return (
          <Space size="middle">
            <Button 
              type="primary" 
              shape="circle" 
              icon={<EditOutlined />} 
              onClick={() => goPublish(data)}
            />
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => delArticle(data)}
            />
          </Space>
        )
      }
    }
  ]

  return (
    <div>
      {/* 筛选区域 */}
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>内容管理</Breadcrumb.Item>
          </Breadcrumb>
        }
        style={{ marginBottom: 20 }}
      >
        <Form onFinish={onFinish} initialValues={{ status: -1 }}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={-1}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={1}>待审核</Radio>
              <Radio value={2}>审核通过</Radio>
              <Radio value={3}>审核失败</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="频道" name="channel_id">
            <Select
              placeholder="请选择文章频道"
              style={{ width: 120 }}
            >
              {channelStore.ChannelList.map(channel => 
                <Option key={channel.id} value={channel.id}>{channel.name}</Option>)}
              {/* {channelList.map(channel => <Option key={channel.id} value={channel.id}>{channel.name}</Option> )} */}
              {/* <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option> */}
            </Select>
          </Form.Item>

          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* 文章列表区域 */}
      <Card title={`根据筛选条件共查询到 ${article.count} 条结果：`}>
        <Table 
          rowKey="id" 
          columns={columns} 
          dataSource={article.list} 
          pagination={{
            // position: ['bottomCenter'],
            // current: params.page,
            total:article.count,
            pageSize: params.per_page,
            onChange: pageChange
          }}
        
        />
      </Card>
    </div>
  )
}

export default observer(Article)
