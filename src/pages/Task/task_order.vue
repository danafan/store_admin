<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="店铺名称：">
				<el-select v-model="req.shop_name" clearable placeholder="全部">
					<el-option v-for="item in store_list" :key="item.shop_id" :label="item.shop_name" :value="item.shop_name">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="订单状态：">
				<el-select v-model="req.status">
					<el-option v-for="item in order_status_list" :key="item.order_status_id" :label="item.order_status_name" :value="item.order_status_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="接单账号：">
				<el-input v-model="req.ww" placeholder="输入接单账号"></el-input>
			</el-form-item>
			<el-form-item label="任务编号：">
				<el-input v-model="req.task_id" placeholder="输入任务编号"></el-input>
			</el-form-item>
			<el-form-item label="网店订单号：">
				<el-input v-model="req.tb_order_sn" placeholder="输入网店订单号"></el-input>
			</el-form-item>
			<el-form-item label="商品ID：">
				<el-input v-model="req.goods_id" placeholder="输入商品ID"></el-input>
			</el-form-item>
			<el-form-item label="接单时间：">
				<el-date-picker
				v-model="create_order_date"
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
		<el-button type="primary" size="small" @click="exportFile">导出</el-button>
	</div>
	<el-table :data="dataObj.data" size="small" border style="width: 100%" :header-cell-style="{background:'#DBE9E5',color:'#333333'}">
		<el-table-column width='220' prop="apply_time" label="接单时间" align="center">
		</el-table-column>
		<el-table-column prop="task_id" label="任务编号" align="center">
		</el-table-column>
		<el-table-column width='160' prop="tb_order_sn" label="网店订单编号" align="center">
		</el-table-column>
		<el-table-column width='160' prop="usertask_id" label="系统订单编号" align="center">
		</el-table-column>
		<el-table-column width='160' prop="goods_id" label="商品ID" align="center">
		</el-table-column>
		<el-table-column width='150' prop="pay_money" label="实付金额（元）" align="center">
		</el-table-column>
		<el-table-column width='150' prop="store_pre_award" label="预估佣金（元）" align="center">
		</el-table-column>
		<el-table-column prop="shop_name" label="任务店铺" align="center">
		</el-table-column>
		<el-table-column width='160' prop="ww" label="旺旺号" align="center">
		</el-table-column>
		<el-table-column prop="status_name" label="订单状态" align="center">
		</el-table-column>
		<el-table-column label="操作" align="center" width="180" fixed="right">
			<template slot-scope="scope">
				<el-button type="text" size="small" @click="auditFun(scope.row.usertask_id)" v-if="scope.row.status == 1">审核</el-button>
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
<!-- 任务审核 -->
<el-dialog title="任务审核" @close="closeDialog" :visible.sync="auditDialog" width="40%">
	<div class="info_row">接单时间：{{orderInfo.apply_time}}</div>
	<div class="info_row">网店订单编号：{{orderInfo.tb_order_sn}}</div>
	<div class="info_row">旺旺号：{{orderInfo.tb_order_sn}}</div>
	<div class="info_row">商品ID：{{orderInfo.goods_id}}</div>
	<div class="info_row goods_img_row">
		<div>商品图片：</div>
		<img class="goods_img" :src="orderInfo.goods_img">
	</div>
	<el-form size="small">
		<el-form-item label="实付金额：" required>
			<el-input v-model="payment_amount" type="number" style='width: 300px' placeholder="请输入实付金额"><template slot="append">元</template></el-input>
		</el-form-item>
		<el-form-item label="拒绝原因：" >
			<el-input v-model="reason" type="text" style='width: 300px;' placeholder="最多10个字"></el-input>
		</el-form-item>
	</el-form>
	<span slot="footer" class="dialog-footer">
		<el-button size="small" @click="submitAudit('1')">拒绝</el-button>
		<el-button size="small" type="primary" @click="submitAudit('2')">通过</el-button>
	</span>
</el-dialog>
</div>
</template>
<style lang="less" scoped>
.but{
	margin-bottom: 5px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
.info_row{
	margin-bottom: 10px;
}
.goods_img_row{
	display:flex;
	align-items: flex-start;
	.goods_img{
		width: 120px;
		height: 120px;
	}
}
</style>
<script>
	import resource from '../../api/resource.js'
	import exportFile from '../../api/export.js'
	import {getNowDate} from '../../api/date.js'
	export default{
		data(){
			return{
				req:{
					shop_name:"",
					status:"0",
					ww:"",
					task_id:"",
					tb_order_sn:"",
					goods_id:"",
					apply_time_start:"",
					apply_time_end:"",
					page:1,
					pagesize:10
				},
				store_list:[],								//店铺列表
				order_status_list:[{
					order_status_id:'0',
					order_status_name:'不限'
				},{
					order_status_id:'1',
					order_status_name:'待审核'
				},{
					order_status_id:'2',
					order_status_name:'已完成'
				},{
					order_status_id:'3',
					order_status_name:'已取消'
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
				create_order_date:[],			//接单时间
				dataObj:{},						//表格数据
				auditDialog:false,				//任务审核弹框
				orderInfo:{},					//任务详情
				usertask_id:"",					//点击的任务id
				payment_amount:"",				//实付金额
				reason:"",						//拒绝原因
			}
		},
		watch:{
			//任务时间
			create_order_date:function(n){
				this.req.apply_time_start = n && n.length > 0 ? n[0] : "";
				this.req.apply_time_end = n && n.length > 0 ? n[1] : "";
			}
		},
		created(){
			this.create_order_date[0] = getNowDate('is_time_start');
			this.create_order_date[1] = getNowDate('is_time_end');
			this.req.apply_time_start = getNowDate('is_time_start');
			this.req.apply_time_end = getNowDate('is_time_end');
			//获取列表
			this.getList();
			//获取店铺列表
			this.getStoreList();
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
				resource.orderList(this.req).then(res => {
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
			//审核
			auditFun(usertask_id){
				this.usertask_id = usertask_id;
				resource.getOrderInfo({usertask_id:this.usertask_id}).then(res => {
					if(res.data.code == 1){
						this.auditDialog = true;
						this.orderInfo = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//关闭审核弹框
			closeDialog(){
				this.orderInfo = {};
				this.payment_amount = "";
				this.reason = "";
			},
			//审核
			submitAudit(check_type){
				if(this.payment_amount == ''){
					this.$message.warning('请输入实付金额');
				}else if(!this.judgmentMoney.test(this.payment_amount)){
					this.$message.warning('请输入正确的金额');
				}else{
					let req = {
						usertask_id:this.usertask_id,
						check_type:check_type,
						payment_amount:this.payment_amount,
						reason:this.reason
					}
					resource.checkOrder(req).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.auditDialog = false;
							//获取列表
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
				exportFile.exportUp(`order/orderlistexport?${arr.join('&')}`)
			}
		}
	}
</script>


















