import http from './request.js'
let path = {	
	getCaptcha:'login/captcha',					//获取验证码
	login:'login/login',						//登录
	quit:'login/quit',							//退出登录
	getIndexInfo:'index/index',					//获取首页信息
	taskList:'task/tasklist',					//获取任务列表
	getStoreList:'shop/shoplist',				//店铺列表
	editTask:'task/edit',						//修改任务
	endTask:'task/endtask',						//结束任务
	endTasks:'task/endtasks',					//批量结束
	orderList:'order/orderlist',				//任务订单列表
	getOrderInfo:'order/getorderinfo',			//任务详情
	checkOrder:'order/checkorder',				//订单审核
	fileUpload:'task/fileupload',				//上传文件
	fileDel:'task/filedel',						//删除文件
	replaceGoodsImg:'task/replacegoodsimg',		//替换图片
	importTask:'task/importtask',				//发布任务
	batchTaskList:'task/batchtasklist',			//获取批次任务列表
	storereCharge:'ll/storerecharge',			//商户充值
	rechargeRecord:'finance/rechargerecord',	//充值记录
	serialRecord:'finance/serialrecord',		//资金流水
	cancelRelease:'task/cancelrelease',			//取消发布任务
	confirmRelease:'task/confirmrelease',		//确认发布任务
	submitRefund:'refund/submitrefund',			//提交返款结果
	uploadFile:'file/upload',					//上传图片
	deleteFile:'file/delete',					//删除图片
	refundList:'refund/refundlist',				//返款订单列表
	submitVoucher:'refund/submitvoucher',		//提交凭证
	submitRefunds:'refund/submitrefunds',		//批量结束任务

}				
export default{
	//获取验证码
	getCaptcha(params){
		return http.get(path.getCaptcha, params)
	},
	//登录
	login(params){
		return http.post(path.login, params)
	},
	//退出登录
	quit(params){
		return http.post(path.quit, params)
	},
	//获取首页信息
	getIndexInfo(params){
		return http.get(path.getIndexInfo, params)
	},
	//获取任务列表
	taskList(params){
		return http.get(path.taskList, params)
	},
	//获取店铺列表
	getStoreList(params){
		return http.get(path.getStoreList, params)
	},
	//修改任务
	editTask(params){
		return http.post(path.editTask, params)
	},
	//结束任务
	endTask(params){
		return http.post(path.endTask, params)
	},
	//批量结束
	endTasks(params){
		return http.post(path.endTasks, params)
	},
	//任务订单列表
	orderList(params){
		return http.get(path.orderList, params)
	},
	//任务详情
	getOrderInfo(params){
		return http.get(path.getOrderInfo, params)
	},
	//订单审核
	checkOrder(params){
		return http.post(path.checkOrder, params)
	},
	//上传文件
	fileUpload(params){
		return http.post(path.fileUpload, params)
	},
	//删除文件
	fileDel(params){
		return http.post(path.fileDel, params)
	},
	//替换图片
	replaceGoodsImg(params){
		return http.post(path.replaceGoodsImg, params)
	},
	//发布任务
	importTask(params){
		return http.post(path.importTask, params)
	},
	//获取批次任务列表
	batchTaskList(params){
		return http.get(path.batchTaskList, params)
	},
	//商户充值
	storereCharge(params){
		return http.post(path.storereCharge, params)
	},
	//充值记录
	rechargeRecord(params){
		return http.get(path.rechargeRecord, params)
	},
	//资金流水
	serialRecord(params){
		return http.get(path.serialRecord, params)
	},
	//取消发布任务
	cancelRelease(params){
		return http.post(path.cancelRelease, params)
	},
	//确认发布任务
	confirmRelease(params){
		return http.post(path.confirmRelease, params)
	},
	//提交返款结果
	submitRefund(params){
		return http.post(path.submitRefund, params)
	},
	//上传图片
	uploadFile(params){
		return http.post(path.uploadFile, params)
	},
	//删除图片
	deleteFile(params){
		return http.post(path.deleteFile, params)
	},
	//返款订单列表
	refundList(params){
		return http.get(path.refundList, params)
	},
	//提交凭证
	submitVoucher(params){
		return http.post(path.submitVoucher, params)
	},
	//批量结束任务
	submitRefunds(params){
		return http.post(path.submitRefunds, params)
	},
}









