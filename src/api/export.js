import { MessageBox,Message } from 'element-ui';

export default{
	exportUp(url){
		MessageBox.confirm('确认导出?', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(() => {
			let req = {};
			let req_arr = url.split('?')[1].split('&');
			req_arr.map(item => {
				req[item.split('=')[0]] = item.split('=')[1];
			})
			let store_id = localStorage.getItem("store_id");
    	    let token = localStorage.getItem("token");
    	    // let store_id = '15';
    	    // let token = 'test_token';
    	    if(!!token){
    	    	req.store_id = store_id;
    	    	req.token = token;
    	    }
    	    let str = '';
    	    let arr = [];
    	    for(let a of Object.keys(req)){
    	    	arr.push(a);
    	    }
    	    let arrSort = arr.sort();
    	    for(let b of arrSort){
    	    	let val = req[b];
    	    	str += `${b}=${val}&`;
    	    }
    	    let open_url = `${location.origin}/store/${url.split('?')[0]}?${str}`;
    	    window.open(open_url);
    	}).catch(() => {
    		Message({
    			type: 'info',
    			message: '取消导出'
    		});          
    	});
    }
}
