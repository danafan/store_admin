import axios from 'axios'
import router from '../router/index.js'
import { Message,Loading } from 'element-ui';
const baseURL = `${location.origin}/store/`;
// 创建axios实例，可以自定义配置
const instance = axios.create({
  baseURL,
});
let loading;
let loadCount = 0;
let loadingArray=[]; 

function startLoading() {
  loadCount++;
  loading = Loading.service({
    target: '.home_content',
    lock: true,
    text: '拼命加载中...',
    background: 'rgba(0, 0, 0, 0.3)',
    spinner: 'el-icon-loading'
  })
  loadingArray.push(loading)
}

function endLoading() {
  loadCount--;
  if (!loadCount) { 
    loadingArray.forEach(item =>item.close()) 
  } 
}

instance.interceptors.request.use(
  config => {
    startLoading();
    return config
  },error => {
    endLoading()
   return Promise.reject(error)
 })

instance.interceptors.response.use(response => {
  endLoading()
  switch (response.data.code) {
    case 101:
    localStorage.clear();
    router.replace("/login");
    break;
    case 102:
    localStorage.clear();
    router.replace("/login");
    break;
    case 103:
    localStorage.clear();
    router.replace("/login");
    break;
  }
  return response;
},function (error) {
  endLoading()
  if (error.response) {
    switch (error.response.status) {
      case 404:
      window.alert('参数错误');
      break;
      case 500:
      window.alert('服务器故障');
      break;
      case 504:
      window.alert('没有网络');
      break;
    }
  }
});

export default instance;