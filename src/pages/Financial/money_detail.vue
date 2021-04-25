<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="店铺名称：">
				<el-select v-model="req.shop_id" clearable placeholder="全部">
					<el-option v-for="item in store_list" :key="item.shop_id" :label="item.shop_name" :value="item.shop_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="财务类型：">
				<el-select v-model="req.type" clearable placeholder="全部">
					<el-option v-for="item in financial_type_list" :key="item.financial_type_id" :label="item.financial_type_name" :value="item.financial_type_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="资金流水号：">
				<el-input v-model="req.serial_id" placeholder="输入资金流水号"></el-input>
			</el-form-item>
			<el-form-item label="完成时间：">
				<el-date-picker
				v-model="over_date"
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
	<el-table :data="dataObj.data" border style="width: 100%" :header-cell-style="{background:'#DBE9E5',color:'#333333'}">
		<el-table-column width='220' prop="shop_name" label="店铺名称" align="center">
		</el-table-column>
		<el-table-column prop="task_id" label="任务编号" align="center">
		</el-table-column>
		<el-table-column prop="serial_id" label="资金流水号" align="center">
		</el-table-column>
		<el-table-column prop="freeze_money" label="冻结金额（元）" align="center">
		</el-table-column>
		<el-table-column prop="usable_money" label="可用余额（元）" align="center">
		</el-table-column>
		<el-table-column prop="type_name" label="财务类型" align="center">
		</el-table-column>
		<el-table-column prop="happen_time" label="完成时间" align="center">
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
.but{
	margin-bottom: 5px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
.img_box{
	display: flex;
	flex-direction: column;
	align-items: center;
	.goods_img{
		width: 58px;
		height: 60px;
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
					shop_id:"",
					financial_type:"",
					serial_id:"",
					finished_time_start:"",
					finished_time_end:"",
					page:1,
					pagesize:10
				},
				store_list:[],								//店铺列表
				financial_type_list:[{
					financial_type_id:'1',
					financial_type_name:'余额充值'
				},{
					financial_type_id:'2',
					financial_type_name:'发布任务'
				},{
					financial_type_id:'3',
					financial_type_name:'任务完结'
				}],								//财务类型列表
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
				over_date:[],			//完成时间
				dataObj:{},								//表格数据
				
			}
		},
		watch:{
			//任务时间
			over_date:function(n){
				this.req.finished_time_start = n && n.length > 0 ? n[0] : "";
				this.req.finished_time_end = n && n.length > 0 ? n[1] : "";
			}
		},
		created(){
			this.over_date[0] = getNowDate('is_time_start');
			this.over_date[1] = getNowDate('is_time_end');
			this.req.finished_time_start = getNowDate('is_time_start');
			this.req.finished_time_end = getNowDate('is_time_end');
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
				resource.serialRecord(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//导出
			exportFile(){
				var arr = [];
				for(var item in this.req){
					let str = item + '=' + this.req[item];
					arr.push(str);
				};
				exportFile.exportUp(`finance/serialrecordexport?${arr.join('&')}`)
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


















