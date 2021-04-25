import axios from './index'

export default {
  post(path, params={}){
    let target = {};
    let store_id = localStorage.getItem("store_id");
    let token = localStorage.getItem("token");
    // let store_id = '15';
    // let token = 'test_token';
    if(!!store_id){
      target.store_id = store_id;
      target.token = token;
    }
    Object.assign(params, target);
    let form = new FormData();
    for(let key of Object.keys(params)){ 
      form.append(key, params[key]);
    }
    return axios.post(`${path}`, form);
  },
  get(path, params={}){
    let target = {};
    let store_id = localStorage.getItem("store_id");
    let token = localStorage.getItem("token");
    // let store_id = '15';
    // let token = 'test_token';
    if(!!store_id){
      target.store_id = store_id;
      target.token = token;
    }
    Object.assign(params, target);
    let arr = [];
    for(let key of Object.keys(params)){
      let kv = `${key}=${params[key]}`;
      arr.push(kv);
    }
    if(arr.length > 0){
      return axios.get(`${path}?${arr.join('&')}`);
    }else{
      return axios.get(`${path}`);
    }
    
  }
}
