import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/assets/iconfont/iconfont.css' // 引入阿里巴巴的fonticon
import '@/permission' // permission control
import '../mock' // simulation data
import VCharts from 'v-charts'

/* 飞来飞去的粒子特效，但是兼容性有问题 */
/* import VueParticles from 'vue-particles'  
Vue.use(VueParticles) */

Vue.use(VCharts)

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
