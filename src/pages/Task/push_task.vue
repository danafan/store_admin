<template>
	<div>
		<el-form size="small">
			<el-form-item label="任务日期" required>
				<el-date-picker
				v-model="create_req.task_date"
				type="date"
				value-format="yyyy-MM-dd"
				placeholder="选择日期">
			</el-date-picker>
		</el-form-item>
		<el-form-item label="是否限制性别" required>
			<el-radio-group v-model="create_req.user_sex">
				<el-radio :label="0">不限制</el-radio>
				<el-radio :label="1">男</el-radio>
				<el-radio :label="2">女</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item label="主图是否打水印" required>
			<el-radio-group v-model="create_req.is_watermark">
				<el-radio :label="1">是</el-radio>
				<el-radio :label="0">否</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item label="超时补单" required>
			<el-radio-group v-model="create_req.is_supplement">
				<el-radio :label="1">是</el-radio>
				<el-radio :label="0">否</el-radio>
			</el-radio-group>
			<el-tooltip class="item" effect="dark" content="任务将在表格内填写的整点时间放出，如果超出当前小时仍未放完，后续是否继续放出补单（系统默认为 是 继续分配）" placement="right-start">
				<el-button type="text" size="small" icon="el-icon-question" circle></el-button>
			</el-tooltip>
		</el-form-item>
		<el-form-item label="上传文件" required>
			<div class="imgBox" v-if="create_req.filename == ''">
				<div class="text">请选择上传文件</div>
				<input type="file" ref="fileUpload" class="upload_file"  accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="uploadFn">
			</div>
			<div class="file_name_box" v-else>
				<div class="file_name">{{create_req.filename}}</div>
				<i class="el-icon-circle-close" @click="deleteFile"></i>
			</div>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="next">下一步</el-button>
		</el-form-item>
	</el-form>
	<!-- 确认发布 -->
	<el-dialog width="80%" title="确认发布" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" :visible.sync="confirmShow">
		<el-table :data="task_data" border style="width: 100%" :header-cell-style="{background:'#DBE9E5',color:'#333333'}">
			<el-table-column width='120' prop="goods_id" label="商品ID" align="center">
			</el-table-column>
			<el-table-column width='150' label="商品图片" align="center">
				<template slot-scope="scope">
					<div class="goods_img_box">
						<img class="goods_img" :src="scope.row.goods_img">
						<el-upload accept=".jpg,.jpeg,.png" :on-success="handleSucess" :action='action_url' :limit="1" :show-file-list="false" :data="req_data">
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
					<div>总数/剩余：{{scope.row.task_total}}/{{scope.row.task_residue_total}}</div>
					<el-button size="small" type="text" @click="lookTask(scope.row.detail)">查看</el-button>
				</template>
			</el-table-column>
			<el-table-column width='120' label="任务状态" align="center">
				<template slot-scope="scope">
					<div v-if="scope.row.status == 0">未确认</div>
					<div v-if="scope.row.status == 1">正常</div>
					<div v-if="scope.row.status == 2">已结束</div>
				</template>
			</el-table-column>
			<el-table-column width="180" label="操作" fixed="right" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="editFun(scope.row)">修改</el-button>
					<div style="color:red" v-if="scope.row.is_repeat == 1">今日有相同任务发布</div>
				</template>
			</el-table-column>
		</el-table>
		<div class="info_box">
			<div class="info_row">
				<div class="item_box info_label">发布数量（条）</div>
				<div class="item_box">{{task_info.task_total}}</div>
			</div>
			<div class="info_row">
				<div class="item_box info_label">佣金（元）</div>
				<div class="item_box">{{task_info.award_total}}</div>
			</div>
			<div class="info_row">
				<div class="item_box info_label">本金（条）</div>
				<div class="item_box">{{task_info.principal_total}}</div>
			</div>
			<div class="info_row">
				<div class="item_box info_label">总计（元）</div>
				<div class="item_box">{{task_info.award_total + task_info.principal_total}}</div>
			</div>
		</div>
		<!-- 修改 -->
		<el-dialog width="30%" title="是否限制性别" :visible.sync="editShow" append-to-body>
			<el-form>
				<el-form-item label="是否限制性别">
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
	<el-dialog title="关键词/任务时间/任务数量 " :visible.sync="show_task_info" append-to-body>
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
	<div slot="footer" class="dialog-footer">
		<el-button size="small" @click="cancelRelease">取 消</el-button>
		<el-button size="small" type="primary" @click="confirmRelease">确认发布</el-button>
	</div>
</el-dialog>
</div>
</template>
<style lang="less" scoped>
.imgBox{
	background: #fff;
	display: flex;
	align-items:center;
	justify-content:center;
	width: 106px;
	height: 30px;
	border-radius: 2px;
	border: 1px solid #E0E0E0;
	position: relative;
	.text{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		text-align: center;
		height: 100%;
		line-height: 30px;
		font-size: 13px;
		color: #666666;
	}
	.upload_file {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}
}
.file_name_box{
	display: flex;
	align-items: center;
	border-radius: 2px;
	border: 1px solid #E0E0E0;
	width: 206px;
	height: 30px;
	padding-left: 10px;
	padding-right: 10px;
	.file_name{
		margin-right: 10px;
		width: 100%;
		text-align: center;
		height: 100%;
		line-height: 30px;
		font-size: 13px;
		color: #666666;
	}
}
.goods_img_box{
	display: flex;
	flex-direction: column;
	align-items: center;
	.goods_img{
		width: 58px;
		height: 60px;
	}
	.imgBox{
		position: relative;
		width: 50px;
		height: 20px;
		.text{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			font-size: 14px;
			color: #00C391;
		}
		.upload_file {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			opacity: 0;
		}
	}
}
.info_box{
	margin-top: 24px;
	.info_row{
		display: flex;
		.info_label{
			background: #F0FFFB;
		}
		.item_box{
			border: 1px solid #D7E4E0;
			width: 148px;
			text-align: center;
			height: 40px;
			line-height: 40px;
			color:#333333;
			font-size: 14px;
		}
	}
}
</style>
<script>
	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				create_req:{
					task_date:"",
					user_sex:0,
					is_watermark:1,
					is_supplement:1,
					filename:""
				},
				confirmShow:false,				//确认发布最外层弹框
				task_data:[],					//表格数据
				task_info:{},					//底部表格
				editShow:false,					//内部修改弹框
				edit_req:{
					task_id:"",
					user_sex:0,
					remark:""
				},								//修改某一个任务
				batch_no:"",					//批次号
				okShow:false,					//确认发布
				action_url:`${location.origin}/store/task/fileupload`,
				curRowIndex:null,
				show_task_info:false,			//查看关键词/任务时间/任务数量 弹框
				activeName: '',					//默认展开的下标
				collapse_list:[],				//手风琴列表
				req_data:{},					//上传图片的额外参数
			}
		},
		created(){
			let store_id = localStorage.getItem("store_id");
			let token = localStorage.getItem("token");
			this.req_data.store_id = store_id;
			this.req_data.token = token;
		},
		methods:{
			// 上传文件
			uploadFn(){
				if (this.$refs.fileUpload.files.length > 0) {
					var file = this.$refs.fileUpload.files[0];
					resource.fileUpload({file:file}).then(res => {
						if(res.data.code == 1){
							//上传文件
							this.create_req.filename = res.data.filename;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//删除文件
			deleteFile(){
				resource.fileDel({filename:this.create_req.filename}).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						//上传文件
						this.create_req.filename = '';
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//下一步
			next(){
				if(this.create_req.task_date == ''){
					this.$message.warning('请选择任务日期');
				}else if(this.create_req.filename == ''){
					this.$message.warning('请上传文件');
				}else{
					resource.importTask(this.create_req).then(res => {
						if(res.data.code == 1){
							this.batch_no = res.data.batch_no;
							//获取批次任务列表
							this.batchTaskList()
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}	
			},
			//获取批次任务列表
			batchTaskList(){
				resource.batchTaskList({batch_no:this.batch_no}).then(res => {
					if(res.data.code == 1){
						this.task_data = res.data.data;
						this.task_info = res.data.task_info;
						this.confirmShow = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//更换图片
			handleSucess(response){
				let task_id = this.task_data[this.curRowIndex].task_id;
				let filename = response.filename;
				let req = {
					task_id:task_id,
					filename:filename
				}
				resource.replaceGoodsImg(req).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.batchTaskList();
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
						this.batchTaskList();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//查看任务详情
			lookTask(detail){
				this.show_task_info = true;
				this.collapse_list = detail;
			},
			//取消发布
			cancelRelease(){
				resource.cancelRelease({batch_no:this.batch_no}).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.editShow = false;
						this.confirmShow = false;
						this.create_req = {
							task_date:"",
							user_sex:0,
							is_watermark:1,
							is_supplement:1,
							filename:""
						};
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//确认发布
			confirmRelease(){
				resource.confirmRelease({batch_no:this.batch_no}).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.editShow = false;
						this.confirmShow = false;
						this.create_req = {
							task_date:"",
							user_sex:0,
							is_watermark:1,
							is_supplement:1,
							filename:""
						};
						this.$router.push('/task/task_list')
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
		}
	}
</script>