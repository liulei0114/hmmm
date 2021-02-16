import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import _ from 'lodash'
import md5 from 'js-md5'
import ZkTable from 'vue-table-with-tree-grid'
// 1.导入 monment 文件
import moment from 'moment'
import VueQuillEditor from 'vue-quill-editor'

// 通用css normal.css
import 'normalize.css/normalize.css'
import '@/style/index.css'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

import '@/icons/index'

import Quill from 'quill'
import ImageResize from 'quill-image-resize-module' // 引用
import { ImageDrop } from 'quill-image-drop-module' // 注册

// 引入echarts
import * as echarts from 'echarts'
Quill.register('modules/imageDrop', ImageDrop)
Quill.register('modules/imageResize', ImageResize)

Vue.config.productionTip = false
Vue.prototype._ = _
Vue.prototype.$bus = new Vue()
Vue.prototype.$md5 = md5
Vue.prototype.$moment = moment
Vue.prototype.$echarts = echarts

Vue.use(ElementUI)
Vue.use(ZkTable)
Vue.use(VueQuillEditor)

// 3.调用API进行汉化
moment.locale('zh-cn')
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
