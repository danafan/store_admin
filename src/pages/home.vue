<template>
	<div class="home_box">
		<div class="home_title">
			<div class="title">商家端</div>
			<div class="user_info">
				<div class="user_name">{{username}}</div>
				<div class="line"></div>
				<div class="loginout" @click="quit">退出</div>
			</div>
		</div>
		<div class="home_content">
			<div class="tab_box">
				<div class="tab_item" @click="checkTab('index')">
					<div class="tab_name" :class="{'active_tab':active_tab_type == 'index'}">首页</div>
					<div class="active_line" v-if="active_tab_type == 'index'"></div>
				</div>
				<div class="tab_item" @click="checkTab('task')">
					<div class="tab_name" :class="{'active_tab':active_tab_type == 'task'}">任务管理</div>
					<div class="active_line" v-if="active_tab_type == 'task'"></div>
				</div>
				<div class="tab_item" @click="checkTab('financial')">
					<div class="tab_name" :class="{'active_tab':active_tab_type == 'financial'}">财务管理</div>
					<div class="active_line" v-if="active_tab_type == 'financial'"></div>
				</div>
			</div>
			<router-view></router-view>
		</div>
	</div>
</template>
<style lang="less" scoped>
.home_box{
	background: linear-gradient(180deg, #00C693 0%, #00966F 100%);
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	padding: 0 24px 24px 24px;
	display: flex;
	flex-direction: column;
	.home_title{
		width: 100%;
		height: 88px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.title{
			font-size: 24px;
			color: #FFFFFF;
			font-weight: bold;
		}
		.user_info{
			display: flex;
			align-items: center;
			.user_img{
				margin-right: 15px;
				width: 24px;
				height: 24px;
			}
			.user_name{
				font-size: 18px;
				color:#FFFFFF;
			}
			.line{
				margin-left: 8px;
				margin-right: 8px;
				border-left: 1px solid #fff;
				height: 13px;
			}
			.loginout{
				font-size: 16px;
				color:#FFFFFF;
			}
		}
	}
	.home_content{
		position: relative;
		border-radius: 8px;
		background: #fff;
		flex: 1;
		width: 100%;
		padding: 0 48px 20px 48px;
		overflow-y: scroll;
		.tab_box{
			display: flex;
			.tab_item{
				margin-right: 100px;
				display: flex;
				flex-direction: column;
				align-items: center;
				height: 80px;
				.tab_name{
					margin-top: 20px;
					margin-bottom: 20px;
					font-size: 18px;
					color: #999999;
				}
				.active_tab{
					color:#00C391;
				}
				.active_line{
					background: #00C391;
					width: 100%;
					height: 2px;
				}
			}
		}
		
	}
	
}
</style>
<script>
	import resource from '../api/resource.js'
	export default{
		data(){
			return{
				active_tab_type:'index',			//默认选中导航
				username:"",	
			}
		},
		created(){
			this.username = localStorage.getItem("username");
			this.$router.push('/index')
		},
		methods:{
			//切换顶部导航
			checkTab(tab_type){
				this.active_tab_type = tab_type;
				this.$router.push(`/${tab_type}`);
			},
			//退出登录
			quit(){
				this.$confirm('确认退出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.quit().then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							localStorage.clear();
							this.$router.replace("/login");
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
























