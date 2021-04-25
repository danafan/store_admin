<template>
	<div>
		<div class="top_box">
			<div class="balance_title">当前账户余额（元）：{{usable_balance}}</div>
			<el-form size="small" label-width="100px">
				<el-form-item label="充值金额：" required>
					<el-input type="number" v-model="top_up_req.money" placeholder="请输入充值金额"></el-input>
				</el-form-item>
				<el-form-item label="备注：">
					<el-input v-model="top_up_req.remark" placeholder="请输入备注"></el-input>
				</el-form-item>
			</el-form>
			<el-button size="small" type="primary" @click="topUp">确认充值</el-button>
		</div>
		<el-table :data="dataObj.data" border style="width: 100%" :header-cell-style="{background:'#DBE9E5',color:'#333333'}">
			<el-table-column width='220' prop="rcg_id" label="订单编号" align="center">
			</el-table-column>
			<el-table-column prop="rcg_money" label="金额（元）" align="center">
			</el-table-column>
			<el-table-column prop="rcg_time" label="创建时间" align="center">
			</el-table-column>
			<el-table-column prop="finished_time" label="完成时间" align="center">
			</el-table-column>
			<el-table-column label="充值状态" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.status_name}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="failed_reason" label="失败原因" align="center">
			</el-table-column>
			<el-table-column prop="remark" label="备注" align="center">
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
</div>
</template>
<style lang="less" scoped>
.top_box{
	border:1px solid #DDEAE7;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 24px;
	padding-bottom: 24px;
	.balance_title{
		margin-bottom: 24px;
		font-size: 18px;
		color: #38CDA6;
	}
}
</style>
<script>
	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				top_up_req:{
					money:"",					//充值金额
					remark:""					//备注
				},
				req:{
					page:1,
					pagesize:10
				},
				dataObj:{},						//表格数据
				usable_balance:"",
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		methods:{
			//确认充值
			topUp(){
				if(this.top_up_req.money == ''){
					this.$message.warning('请输入充值金额');
				}else if(parseFloat(this.top_up_req.money) < 0){
					this.$message.warning('充值金额不能少于0元');
				}else{
					this.$confirm('确认充值?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						resource.storereCharge(this.top_up_req).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								window.open(res.data.gateway_url);
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
			//获取列表
			getList(){
				resource.rechargeRecord(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
						this.usable_balance = res.data.store.usable_balance;
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
		}
	}
</script>








