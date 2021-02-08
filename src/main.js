import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import _ from 'lodash'
import md5 from 'js-md5'
// 1.导入 monment 文件
import moment from 'moment'

// 通用css normal.css
import 'normalize.css/normalize.css'
import '@/style/index.css'

import '@/icons/index'

Vue.config.productionTip = false
Vue.prototype._ = _
Vue.prototype.$bus = new Vue()
Vue.prototype.$md5 = md5
Vue.prototype.$moment = moment

Vue.use(ElementUI)

// 3.调用API进行汉化
moment.locale('zh-cn')
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
