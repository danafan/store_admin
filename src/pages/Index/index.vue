<template>
	<div>
		<div class="top_box">
			<div class="index_item">
				<img class="item_back_img" src="../../static/index_img_01.png">
				<div class="item_content item_back_img">
					<div>
						<div class="item_title">可用余额</div>
						<div class="item_value">{{indexInfo.usable_balance}}</div>
					</div>
					<div>
						<div class="item_title">任务冻结</div>
						<div class="item_value">{{indexInfo.freeze_balance}}</div>
					</div>
				</div>
			</div>
			<div class="index_item">
				<img class="item_back_img" src="../../static/index_img_02.png">
				<div class="item_content item_back_img">
					<div>
						<div class="item_title">待返款金额</div>
						<div class="item_value">{{indexInfo.refund_amount_total}}</div>
					</div>
					<div>
						<div class="item_title">待返款笔数</div>
						<div class="item_value">{{indexInfo.refund_num_total}}</div>
					</div>
				</div>
			</div>
			<div class="index_item">
				<img class="item_back_img" src="../../static/index_img_03.png">
				<div class="item_content item_back_img">
					<div>
						<div class="item_title">今日任务数</div>
						<div class="item_value">{{indexInfo.today_task_num}}</div>
					</div>
					<div>
						<div class="item_title">今日剩余任务数</div>
						<div class="item_value">{{indexInfo.today_task_residue_num}}</div>
					</div>
				</div>
			</div>
		</div>
		<div class="bottom_box">
			<div class="item_box">
				<div class="botttom_item_title">佣金价格</div>
				<el-table class="table_box" :data="price_list" border :header-cell-style="{'background':'#D7E4E0'}">
					<el-table-column width="147" prop="principal" label="本金（元)(左包含）">
					</el-table-column>
					<el-table-column width="147" prop="award" label="收取佣金（元）">
					</el-table-column>
				</el-table>
			</div>
			<div class="item_box">
				<div class="botttom_item_title">商家店铺</div>
				<el-table class="table_box" :data="store_list" border :header-cell-style="{'background':'#D7E4E0'}">
					<el-table-column width="294" prop="shop_name" label="店铺名称">
					</el-table-column>
				</el-table>
			</div>
		</div>
	</div>
</template>
<style lang="less" scoped>
.top_box{
	display: flex;
	align-items: center;
	justify-content: space-between;
	.index_item{
		position: relative;
		width: 300px;
		height: 225px;
		.item_back_img{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
		.item_content{
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			padding-left: 36px;
			color: #fff;
			.item_title{
				font-size: 18px;
			}
			.item_value{
				font-weight: bold;
				font-size: 26px;
			}
		}
	}
}
.bottom_box{
	margin-top: 34px;
	display: flex;
	.item_box{
		width: 50%;
		.botttom_item_title{
			margin-bottom: 20px;
		}
		.table_box{
			width: 296px;
		}
	}
}
</style>
<script>
	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				indexInfo:{},			//首页信息
				price_list:[],			// 佣金价格列表
				store_list:[],			//商户列表
			}
		},
		created(){
			//获取首页信息
			this.getIndexInfo();
		},
		methods:{
			//获取首页信息
			getIndexInfo(){
				resource.getIndexInfo().then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						this.indexInfo = data;
						this.price_list = data.award_price;
						this.store_list = data.shops;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
		}
	}
</script>
















