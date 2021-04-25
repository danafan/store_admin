import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './style/theme/index.css';

Vue.use(ElementUI);

Vue.prototype.captcha = `${location.origin}/store/login/captcha`;		//获取验证码前缀
Vue.prototype.judgmentMoney = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;	//金额正则


new Vue({
  render: h => h(App),
  router
}).$mount('#app')
