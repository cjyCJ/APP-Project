import Vue from 'vue'
import App from './App'
import router from './router'
// 引入css样式全局控制
import './assets/css/global.css'
// 引入element-ui
// import ElementUI from 'element-ui'

// 引入“图标库”css样式文件
import './assets/fonts/iconfont.css'
// 引入眼睛字体图标
import './assets/font2/iconfont.css'
// 引入svg
import './icons'
// 引入axios
import axios from 'axios'

// 给当前项目引入 tree型的table表格
import ZkTable from 'vue-table-with-tree-grid'

// 引入nprogress模块
import NProgress from 'nprogress'
// 引入nprogress模块需要的css样式
// import 'nprogress/nprogress.css'

// 给ElementUI做按需导入配置
import {
  Pagination,
  Dialog,
  Menu,
  Submenu,
  MenuItem,
  Input,
  Checkbox,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  Button,
  Table,
  TableColumn,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Tree,
  Alert,
  Icon,
  Row,
  Col,
  Upload,
  Card,
  Steps,
  Step,
  Cascader,
  Container,
  Header,
  Aside,
  Main,
  MessageBox,
  Message
} from 'element-ui'

Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tooltip)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Alert)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Upload)
Vue.use(Card)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Cascader)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)

Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message

// 把tree型table注册给vue
Vue.use(ZkTable)

// 给axios做配置(访问根地址、Vue之$http成员)
axios.defaults.baseURL = 'http://127.0.0.1:8765/api/private/v1/'
// 给axios配置"请求拦截器"，在其中绑定token
axios.interceptors.request.use(
  function(config) {
    // 设置开始进度条
    NProgress.start()
    var token = window.sessionStorage.getItem('token')
    config.headers.Authorization = token
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)
// axios的“响应拦截器”
axios.interceptors.response.use(
  function(response) {
    // 结束进度条的显示
    NProgress.done()
    return response
  },
  function(error) {
    return Promise.reject(error)
  }
)

Vue.prototype.$http = axios

// 给Vue注册全部的element-ui的标签组件 和 事件方法组件
// Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
