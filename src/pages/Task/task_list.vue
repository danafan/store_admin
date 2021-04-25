<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="店铺名称：">
				<el-select v-model="req.shop_id" clearable placeholder="全部">
					<el-option v-for="item in store_list" :key="item.shop_id" :label="item.shop_name" :value="item.shop_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="任务状态：">
				<el-select v-model="req.status" clearable placeholder="不限">
					<el-option v-for="item in task_status_list" :key="item.task_status_id" :label="item.task_status_name" :value="item.task_status_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="商品ID：">
				<el-input v-model="req.goods_id" placeholder="输入商品ID"></el-input>
			</el-form-item>
			<el-form-item label="任务编号：">
				<el-input v-model="req.task_id" placeholder="输入任务编号"></el-input>
			</el-form-item>
			<el-form-item label="任务日期：">
				<el-date-picker
				v-model="task_date"
				type="daterange"
				align="right"
				unlink-panels
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				value-format="yyyy-MM-dd"
				:picker-options="pickerOptions">
			</el-date-picker>
		</el-form-item>
		<el-form-item label="关键词：">
			<el-input v-model="req.key_word" placeholder="输入关键词"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" size="small" @click="getList">搜索</el-button>
		</el-form-item>
	</el-form>
	<div class="but">
		<div class="but_left">
			<el-button type="primary" size="small" @click="batchOver">批量结束</el-button>
			<div class="task_info">
				<div class="task_info_item">共有数据：{{task_statistics.task_total}}条</div>
				<div class="task_info_item">总任务数：{{task_statistics.task_order_total}}条</div>
				<div class="task_info_item">总剩余任务数：{{task_statistics.task_order_residue_total}}条</div>
			</div>
		</div>
		<el-button type="primary" size="small" @click="exportFile">导出</el-button>
	</div>
	<el-table ref="multipleTable" size="small" :data="dataObj.data" tooltip-effect="dark" border style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#DBE9E5',color:'#333333'}">
		<el-table-column type="selection" width="55" align="center" fixed="left"></el-table-column>
		<el-table-column width='120' prop="task_id" label="任务编号" align="center">
		</el-table-column>
		<el-table-column width='120' prop="goods_id" label="商品ID" align="center">
		</el-table-column>
		<el-table-column width='150' label="商品图片" align="center">
			<template slot-scope="scope">
				<div class="img_box">
					<img class="goods_img" :src="scope.row.goods_img">
					<el-upload v-if="scope.row.status == 1" accept=".jpg,.jpeg,.png" :on-success="handleSucess" :action='action_url' :limit="1" :show-file-list="false" :data='req_data'>
						<el-button size="small" type="text" @click="curRowIndex=scope.$index">更换</el-button>
					</el-upload>
				</div>
			</template>
		</el-table-column>
		<el-table-column width='120' prop="goods_price" label="价格（元）" align="center">
		</el-table-column>
		<el-table-column width='150' prop="shop_name" label="店铺" align="center">
		</el-table-column>
		<el-table-column width='180' prop="task_time" label="任务日期" align="center">
		</el-table-column>
		<el-table-column width='260' show-overflow-tooltip prop="remark" label="备注" align="center">
		</el-table-column>
		<el-table-column width='260' label="关键词/任务时间/任务数量" align="center">
			<template slot-scope="scope">
				<div style="width:100%">
					<div>总数/剩余：{{scope.row.task_total}}/{{scope.row.task_residue_total}}</div>
					<el-button size="small" type="text" @click="lookTask(scope.row.detail)">查看</el-button>
				</div>
			</template>
		</el-table-column>
		<el-table-column width='120' label="任务状态" align="center">
			<template slot-scope="scope">
				<div>{{scope.row.status_name}}</div>
			</template>
		</el-table-column>
		<el-table-column width="180" label="操作" fixed="right" align="center">
			<template slot-scope="scope">
				<el-button type="text" size="small" v-if="scope.row.status == 1" @click="editFun(scope.row)">修改</el-button>
				<el-button type="text" size="small" v-if="scope.row.status == 1" @click="overTask(scope.row.task_id)">结束任务</el-button>
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
<!-- 修改 -->
<el-dialog title="修改" width="30%" :visible.sync="editShow">
	<el-form>
		<el-form-item label="是否限制性别：" label-width="110px">
			<el-radio-group v-model="edit_req.user_sex">
				<el-radio :label="0">不限制</el-radio>
				<el-radio :label="1">男</el-radio>
				<el-radio :label="2">女</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item label="备注：" label-width="110px">
			<el-input
			type="textarea"
			:rows="3"
			v-model="edit_req.remark">
		</el-input>
	</el-form-item>
</el-form>
<div slot="footer" class="dialog-footer">
	<el-button size="small" @click="editShow = false">取 消</el-button>
	<el-button size="small" type="primary" @click="editOk">确 定</el-button>
</div>
</el-dialog>
<!-- 查看关键词/任务时间/任务数量 -->
<el-dialog title="关键词/任务时间/任务数量 " :visible.sync="show_task_info">
	<el-collapse v-model="activeName" accordion>
		<el-collapse-item v-for="item in collapse_list" :title="item.keyword" :name="item.keyword">
			<div v-for="i in item.task_info" style="display: flex">
				<div style="margin-right: 30px">任务时间：{{i.start_time}}</div>
				<div style="margin-right: 30px">总数：{{i.task_num}}</div>
				<div>剩余：{{i.residue_num}}</div>
			</div>
		</el-collapse-item>
	</el-collapse>
</el-dialog>
</div>
</template>
<style lang="less" scoped>
.but{
	margin-bottom: 5px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.but_left{
		display: flex;
		align-items: center;
		.task_info{
			display: flex;
			align-items: center;
			font-size: 14px;
			color: #333333;
			.task_info_item{
				margin-left:26px;
			}
		}
	}
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
					status:"",
					goods_id:"",
					task_id:"",
					task_date_start:"",
					task_date_end:"",
					key_word:"",
					page:1,
					pagesize:10
				},
				store_list:[],					//店铺列表
				task_status_list:[{
					task_status_id:'1',
					task_status_name:'正常'
				},{
					task_status_id:'2',
					task_status_name:'已结束'
				}],								//任务状态列表
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
				task_date:[],					//任务时间
				multipleSelection: [],			//选中的行
				dataObj:{},						//表格数据
				task_statistics:{},			//表格上面的数据
				editShow:false,					//修改弹框
				edit_req:{
					task_id:"",
					user_sex:0,
					remark:''
				},								//修改提交的参数
				action_url:`${location.origin}/store/task/fileupload`,
				curRowIndex:null,
				show_task_info:false,			//查看关键词/任务时间/任务数量 弹框
				activeName: '',					//默认展开的下标
				collapse_list:[],				//手风琴列表
				req_data:{},					//上传图片的额外参数
			}
		},
		watch:{
			//任务时间
			task_date:function(n){
				this.req.task_date_start = n && n.length > 0 ? n[0] : "";
				this.req.task_date_end = n && n.length > 0 ? n[1] : "";
			}
		},
		created(){
			let store_id = localStorage.getItem("store_id");
			let token = localStorage.getItem("token");
			this.req_data.store_id = store_id;
			this.req_data.token = token;
			this.task_date[0] = getNowDate('date');
			this.task_date[1] = getNowDate('date');
			this.req.task_date_start = getNowDate('date');
			this.req.task_date_end = getNowDate('date');
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
			//获取任务列表
			getList(){
				resource.taskList(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
						this.task_statistics = res.data.task_statistics;
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
			//批量结束
			batchOver(){
				this.$confirm('结束任务不会结束已经接单的任务订单, 是否结束?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let task_ids = this.multipleSelection.join(',');
					resource.endTasks({task_ids:task_ids}).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.multipleSelection = [];
							//获取列表
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
			//导出
			exportFile(){
				// var arr = [];
				// for(var item in this.req){
				// 	let str = item + '=' + this.req[item];
				// 	arr.push(str);
				// };
				// exportFile.exportUp(`order/orderlistexport?${arr.join('&')}`)
			},
			//查看任务详情
			lookTask(detail){
				this.show_task_info = true;
				this.collapse_list = detail;
			},
			//切换选中行
			handleSelectionChange(val) {
				let selections = val;
				this.multipleSelection = [];
				selections.map(item => {
					this.multipleSelection.push(item.task_id);
				})
			},
			//更换图片
			handleSucess(response){
				let task_id = this.dataObj.data[this.curRowIndex].task_id;
				let filename = response.filename;
				let req = {
					task_id:task_id,
					filename:filename
				}
				resource.replaceGoodsImg(req).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.getList();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//修改
			editFun(row){
				this.edit_req.user_sex = row.user_sex;
				this.edit_req.task_id = row.task_id;
				this.edit_req.remark = row.remark;
				this.editShow = true;
			},
			//确认修改
			editOk(){
				resource.editTask(this.edit_req).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.editShow = false;
						//获取列表
						this.getList();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//结束任务
			overTask(task_id){
				this.$confirm('结束任务不会结束已经接单的任务订单, 是否结束?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.endTask({task_id:task_id}).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.multipleSelection = [];
							//获取列表
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
		}
	}
</script>


















