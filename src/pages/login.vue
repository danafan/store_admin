<template>
	<div class="login_container home_content">
		<img class="back_img" src="../static/login_back.png">
		<div class="login_content">
			<div class="title">登录</div>
			<div class="login_item">
				<div class="item_lable">账户</div>
				<input type="text" v-model="req.username" placeholder="请输入账户">
			</div>
			<div class="login_item">
				<div class="item_lable">密码</div>
				<input type="password" v-model="req.password" placeholder="请输入登录密码">
			</div>
			<div class="login_item">
				<div class="item_lable">验证码</div>
				<input type="text" v-model="req.captcha" placeholder="请输入验证码">
			</div>
			<div class="code_box">
				<img class="code_img" :src="codeUrl">
				<div class="code_text" @click="getCode">看不清，换一张</div>
			</div>
			<el-button class="login" type="primary" @click="login">登录</el-button>
		</div>
	</div>
</template>
<style lang="less" scoped>
.login_container{
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	.back_img{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	.login_content{
		border-radius: 8px;
		background: #fff;
		margin-right: 65px;
		width: 582px;
		height: 610px;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-left: 50px;
		padding-right: 50px;
		.title{
			margin-top: 49px;
			margin-bottom: 28px;
			font-size: 28px;
			color: #00C391;
		}
		.login_item{
			margin-bottom: 24px;
			width: 100%;
			.item_lable{
				margin-bottom: 10px;
				font-size: 16px;
				color: #999990;
			}
			input{
				width: 100%;
				height: 48px;
				background: #F0F0F0;
				border-radius: 4px;
				font-size: 14px;
				padding-left: 16px;
			}
		}
		.code_box{
			width: 100%;
			display: flex;
			align-items: center;
			.code_img{
				border-radius: 4px;
				width: 204px;
				height: 48px;
			}
			.code_text{
				margin-left: 50px;
				font-size: 20px;
				color: #00C391;
			}
		}
		.login{
			width: 140px;
			margin-top: 50px;
		}
	}
}
</style>
<script>
	import resource from '../api/resource.js'
	export default{
		data(){
			return{
				req:{
					username:"",
					password:"",
					captcha:"",
				},
				codeUrl:'',					//验证码前缀
				captcha_url:'',
				i:0
			}
		},
		created(){
			this.captcha_url = this.captcha;
			this.codeUrl = this.captcha;
		},
		methods:{
			//获取验证码
			getCode(){
				this.i += 1;
				this.codeUrl = this.captcha_url + `?i=${this.i}`;	
			},
			//登录
			login(){
				if(this.req.username == ''){
					this.$message.warning('请输入账户名称');
				}else if(this.req.password == ''){
					this.$message.warning('请输入账户密码');
				}else if(this.req.captcha == ''){
					this.$message.warning('请输入验证码');
				}else{
					resource.login(this.req).then(res => {
						if(res.data.code == 1){
							localStorage.setItem("store_id",res.data.data.store_id);
							localStorage.setItem("token",res.data.data.token);
							localStorage.setItem("username",this.req.username);
							this.$message.success("登录成功");
							this.$router.push('/index');
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			}
		}
	}
</script>


































