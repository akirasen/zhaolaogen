import uView from '@/uni_modules/uview-ui'
Vue.use(uView)
import { comRequest } from './util/api.js'
Vue.prototype.$comRequest = comRequest
import { pureRequest } from './util/api.js'
Vue.prototype.$pureRequest = pureRequest
import { graphqlRequest } from './util/api.js'
Vue.prototype.$graphqlRequest = graphqlRequest
import { userAgentCheck } from './util/api.js'
Vue.prototype.$userAgentCheck = userAgentCheck
import { dataEncryptPublic } from './util/api.js'
Vue.prototype.$dataEncryptPublic = dataEncryptPublic
import { dataDecryptPublic } from './util/api.js'
Vue.prototype.$dataDecryptPublic = dataDecryptPublic
import { dataSha1 } from './util/api.js'
Vue.prototype.$dataSha1 = dataSha1



import App from './App'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif