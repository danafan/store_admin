<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="店铺名称：">
				<el-select v-model="req.shop_name" clearable placeholder="不限">
					<el-option v-for="item in store_list" :key="item.shop_id" :label="item.shop_name" :value="item.shop_name">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="返款状态：">
				<el-select v-model="req.status">
					<el-option v-for="item in rebates_status_list" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="接单账号：">
				<el-input v-model="req.ww" placeholder="输入接单账号"></el-input>
			</el-form-item>
			<el-form-item label="网店订单号：">
				<el-input v-model="req.order_sn" placeholder="输入网店订单号"></el-input>
			</el-form-item>
			<el-form-item label="批次号：">
				<el-input v-model="req.batch_id" placeholder="输入批次号"></el-input>
			</el-form-item>
			<el-form-item label="任务时间：">
				<el-date-picker
				v-model="date"
				type="datetimerange"
				:picker-options="pickerOptions"
				value-format="yyyy-MM-dd HH:mm:ss"
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				:default-time="['00:00:00', '23:59:59']"
				>
			</el-date-picker>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" size="small" @click="getList">搜索</el-button>
		</el-form-item>
	</el-form>
	<div class="but">
		<el-button type="primary" size="small" @click="settingFun">批量确认返款</el-button>
		<el-button type="primary" size="small" @click="exportFile">导出</el-button>
	</div>
	<el-table :data="dataObj.data" size="small" border style="width: 100%" :header-cell-style="{background:'#DBE9E5',color:'#333333'}" ref="multipleTable" @selection-change="handleSelectionChange">
		<el-table-column type="selection" width="55" align="center" :selectable="checkSelectable" fixed="left"></el-table-column>
		<el-table-column width='220' prop="add_time" label="任务时间" align="center">
		</el-table-column>
		<el-table-column prop="batch_id" label="批次号" align="center">
		</el-table-column>
		<el-table-column width='160' prop="order_sn" label="网店订单编号" align="center">
		</el-table-column>
		<el-table-column width='160' prop="payment_amount" label="实付金额（元）" align="center">
		</el-table-column>
		<el-table-column width='160' prop="refund_amount" label="返款金额（元）" align="center">
		</el-table-column>
		<el-table-column width='160' prop="shop_name" label="任务店铺" align="center">
		</el-table-column>
		<el-table-column width='160' prop="ww" label="旺旺号" align="center">
		</el-table-column>
		<el-table-column width='220' label="收款信息">
			<template slot-scope="scope">
				<div>姓名：{{scope.row.name}}</div>
				<div>银行卡号：{{scope.row.bank_card_number}}</div>
				<div>支付宝号：{{scope.row.alipay_acount}}</div>
			</template>
		</el-table-column>
		<el-table-column width='120' prop="status_name" label="返款状态" align="center">
		</el-table-column>
		<el-table-column label="操作" align="center" width="180" fixed="right">
			<template slot-scope="scope">
				<el-button type="text" size="small" @click="confirmFun(scope.row.refund_id)" v-if="scope.row.status == '0'|| scope.row.status == '1'">确认返款</el-button>
				<el-button type="text" size="small" @click="failureFun(scope.row.refund_id)"v-if="scope.row.status == '0'">返款失败</el-button>
				<el-button type="text" size="small" @click="submit(scope.row.refund_id)" v-if="scope.row.status == '3'">提交凭证</el-button>
			</template>
		</el-table-column>
	</el-table>
	<div class="page">
		<el-pagination
		@size-change="handleSizeChange"
		@current-change="handleCurrentChange"
		:current-page="req.page"
		:pager-count="11"
		:page-sizes="[5, 10, 15, 20]"
		layout="total, sizes, prev, pager, next, jumper"
		:total="dataObj.total"
		>
	</el-pagination>
</div>
<!-- 提交凭证 -->
<el-dialog title="提交凭证" @close="closeCredentialsDialog" :visible.sync="credentialsDialog">
	<el-form size="small">
		<el-form-item label="凭证说明：" required>
			<el-input v-model="remark" style='width: 300px;' placeholder="请输入凭证说明"></el-input>
		</el-form-item>
		<el-form-item label="凭证图片：" required>
			<upload-file @callbackFn="callbackFn" v-if="voucher_img == ''"></upload-file>
			<div class="modalImgBox" @mouseenter="logo_delete = true" @mouseleave="logo_delete = false" v-else>
				<img class="modalImg" :src="voucher_img">
				<div class="modalDelete" v-if="logo_delete == true">
					<img class="deleteImg" src="../../static/deleteImg.png" @click="deteleImg">
				</div>
			</div>
		</el-form-item>
	</el-form>
	<span slot="footer" class="dialog-footer">
		<el-button size="small" @click="credentialsDialog = false">取消</el-button>
		<el-button size="small" type="primary" @click="submitFun">确 定</el-button>
	</span>
</el-dialog>
</div>
</template>
<style lang="less" scoped>
.but{
	margin-bottom: 5px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.modalImgBox{
	left: 100px;
	position: relative;
	width: 120px;
	height: 120px;
	.modalDelete{
		background: rgba(0,0,0,.6);
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display:flex;
		align-items: center;
		justify-content: center;
		.deleteImg{
			display:block;
			width: 30px;
			height: 30px;
		}
	}
	.modalImg{
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
	}
}

</style>
<script>
	import resource from '../../api/resource.js'
	import exportFile from '../../api/export.js'
	import uploadFile from '../../components/upload_file.vue'
	import {getNowDate} from '../../api/date.js'
	export default{
		data(){
			return{
				req:{
					shop_name:"",
					status:"",
					ww:"",
					order_sn:"",
					batch_id:"",
					task_time_start:"",
					task_time_end:"",
					page:1,
					pagesize:10
				},
				store_list:[],								//店铺列表
				rebates_status_list:[{
					id:'0',
					name:'待返款'
				},{
					id:'1',
					name:'返款失败'
				},{
					id:'2',
					name:'返款成功'
				},{
					id:'3',
					name:'用户未收到'
				},{
					id:'4',
					name:'凭证已上传'
				}],								//订单状态列表
				pickerOptions: {
					shortcuts: [{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}]
				},
				date:[],						//任务时间
				dataObj:{},						//表格数据
				credentialsDialog:false,		//提交凭证
				refund_id:"",					//点击的id
				remark:"",						//凭证说明
				url:"",
				filename:'',
				voucher_img:"",					//图片名
				logo_delete:false,				//删除框
				multipleSelection:[]
			}
		},
		watch:{
			//任务时间
			create_order_date:function(n){
				this.req.task_time_start = n && n.length > 0 ? n[0] : "";
				this.req.task_time_end = n && n.length > 0 ? n[1] : "";
			}
		},
		created(){
			this.date[0] = getNowDate('is_time_start');
			this.date[1] = getNowDate('is_time_end');
			this.req.task_time_start = getNowDate('is_time_start');
			this.req.task_time_end = getNowDate('is_time_end');
			//获取店铺列表
			this.getStoreList();
			//获取列表
			this.getList();
		},
		methods:{
			//获取店铺列表
			getStoreList(){
				resource.getStoreList().then(res => {
					if(res.data.code == 1){
						this.store_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取列表
			getList(){
				resource.refundList(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//分页
			handleSizeChange(val) {
				this.req.pagesize = val;
				//获取列表
				this.getList();
			},
			handleCurrentChange(val) {
				this.req.page = val;
				//获取列表
				this.getList();
			},
			//确认返款
			confirmFun(refund_id){
				this.$confirm('已给该用户返款?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let req = {
						refund_id:refund_id,
						refund_type:'2'
					}
					resource.submitRefund(req).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.getList();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消'
					});          
				});
			},
			//返款失败
			failureFun(refund_id){
				this.$prompt('失败原因', '返款失败', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({ value }) => {
					if(!value){
						this.$message.warning('请输入失败原因');
					}else{
						let req = {
							refund_id:refund_id,
							refund_type:'1',
							remark:value
						}
						resource.submitRefund(req).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.getList();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消'
					});       
				});
			},
			//关闭提交凭证的弹框
			closeCredentialsDialog(){
				this.remark = "";						//凭证说明
				this.url = "";
				this.filename = "";
				this.voucher_img = "";					//图片名
			},
			//提交凭证
			submit(refund_id){
				this.refund_id = refund_id;
				this.credentialsDialog = true;
			},
			//上传文件
			callbackFn(callRes){
				let req = {
					file:callRes.files[0]
				}
				resource.uploadFile(req).then(res => {
					if(res.data.code == 1){
						this.url = res.data.data.url;
						this.filename = res.data.data.filename;
						this.voucher_img = this.url + this.filename;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//删除文件
			deteleImg(){
				resource.deleteFile({filename:this.filename}).then(res => {
					if(res.data.code == 1){
						this.url = "";
						this.filename = "";
						this.voucher_img = "";					//图片名
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//提交凭证
			submitFun(){
				if(this.remark == ''){
					this.$message.warning('请输入凭证说明');
				}else if(this.voucher_img == ''){
					this.$message.warning('请上传凭证图片');
				}else{
					let req = {
						refund_id:this.refund_id,
						voucher_img:this.filename,
						remark:this.remark
					}
					resource.submitVoucher(req).then(res => {
						if(res.data.code == 1){
							this.$message.success('操作成功');
							this.credentialsDialog = false;
							this.getList();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//导出
			exportFile(){
				var arr = [];
				for(var item in this.req){
					let str = item + '=' + this.req[item];
					arr.push(str);
				};
				exportFile.exportUp(`refund/refundlistexport?${arr.join('&')}`)
			},
			//批量确认返款
			settingFun(){
				if(this.multipleSelection.length == 0){
					this.$message.warning('至少勾选一条')
				}else{
					this.$confirm('已给该用户返款?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						resource.submitRefunds({refund_ids:this.multipleSelection.join(',')}).then(res => {
							if(res.data.code == 1){
								this.$message.success('操作成功');
								this.getList();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '取消'
						});          
					});
					
				}
			},
			//切换选中行
			handleSelectionChange(val) {
				let selections = val;
				this.multipleSelection = [];
				selections.map(item => {
					this.multipleSelection.push(item.refund_id);
				})
			},
			//当前行是否可以勾选
			checkSelectable(row,index){ 
				let flag = false;
				if(row.status == '0'){
					flag = true;
				}
				return flag
			},
		},
		components:{
			uploadFile
		}
	}
</script>


















