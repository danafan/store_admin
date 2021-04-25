<template>
	<div>
		<div class="tab_box">
			<div class="tab_item" @click="checkTab('/task/push_task')">
				<div class="tab_name" :class="{'active_tab':active_tab == '/task/push_task'}">发布任务</div>
				<div class="line" v-if="active_tab == '/task/push_task'"></div>
			</div>
			<div class="tab_item" @click="checkTab('/task/task_list')">
				<div class="tab_name" :class="{'active_tab':active_tab == '/task/task_list'}">任务列表</div>
				<div class="line" v-if="active_tab == '/task/task_list'"></div>
			</div>
			<div class="tab_item" @click="checkTab('/task/task_order')">
				<div class="tab_name" :class="{'active_tab':active_tab == '/task/task_order'}">任务订单</div>
				<div class="line" v-if="active_tab == '/task/task_order'"></div>
			</div>
			<div class="tab_item" @click="checkTab('/task/rebates_order')">
				<div class="tab_name" :class="{'active_tab':active_tab == '/task/rebates_order'}">返款订单</div>
				<div class="line" v-if="active_tab == '/task/rebates_order'"></div>
			</div>
		</div>
		<router-view></router-view>
	</div>
</template>
<style lang="less" scoped>
.tab_box{
	margin-bottom: 26px;
	border: 1px solid #D7E4E0;
	width: 100%;
	height: 64px;
	display: flex;
	padding-left: 20px;
	padding-right: 20px;
	.tab_item{
		margin-right: 84px;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		.tab_name{
			font-size: 16px;
			color: #999999;
		}
		.active_tab{
			color:#00C391;
		}
		.line{
			position: absolute;
			bottom: 0;
			width: 100%;
			height: 4px;
			background: #00C391;
		}
	}
}
</style>
<script>
	export default{
		data(){
			return{
				active_tab:'/task/task_list',			//默认是订单列表
			}
		},
		watch:{
			$route(to,from){
				this.active_tab = to.path;
				this.$router.push(to.path);
			}
		},
		methods:{
			//切换导航
			checkTab(tab_url){
				this.active_tab = tab_url;
				this.$router.push(tab_url);
			}
		}
	}
</script>














