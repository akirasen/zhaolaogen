<template>
	<view class="content">
		<view class="login-area">
			<view class="title">
				<view class="dash"></view>
				<view class="maintitle">登录</view>
				<view class="input">
					<view class="inputarea">
						<uni-easyinput prefixIcon="person-filled" v-model="identifier" placeholder="输入登录邮箱或用户名"></uni-easyinput>
					</view>
					<view class="inputarea">
						<uni-easyinput @confirm="submitLogin" prefixIcon="locked-filled" type="password" v-model="password" placeholder="请输入密码"></uni-easyinput>
					</view>	
				</view>
				
				<button class="btn" hover-class="btn-hover" @click="submitLogin">登 录</button>
				<button class="btn2" hover-class="btn-hover2" @click="pageGo('../../pages/index/index')">取 消</button>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {				
				identifier:'',
				password:'',				
			};
		},
		methods:{			
			pageGo(url){
				uni.navigateTo({
					url:url
				})
			},			
			async submitLogin(){
				this.sending = true
				const res = await this.$pureRequest({
					url:'api/auth/local',
					Method:"POST",
					data:{
						"identifier":this.identifier,
						"password":this.password
					}
				})
				console.log(res)
				uni.setStorageSync('identifier',this.identifier)
				uni.setStorageSync('jwt',res.data.jwt)
				uni.setStorageSync('user',res.data.user)
				if(res.statusCode == 200){
					this.sending = false
					uni.showToast({
						title:'登陆成功',
						duration:500
					})
					setTimeout(()=>{//0.5秒延迟
						uni.navigateTo({
							url:"/pages/controlPanel/controlPanel"
						})
					},500)
				}else{
					this.sending = false
					uni.showToast({
						title:'登陆失败',
						duration:500
					})
				}
			},//
			async PassportCheck(){
				const res = await this.$pureRequest({
					url:'api/users/me',
					Method:'GET',
					header:{
						'accept':'application/json',
						'Authorization': 'Bearer '+uni.getStorageSync('jwt')
					}
				})
				console.log(res)
				if(res.statusCode == 200){
					uni.showToast({
						title:'已自动登录',
						duration:1000
					})
					uni.setStorageSync('user',res.data)
					setTimeout(()=>{//0.5秒延迟
						uni.navigateTo({
							url:"/pages/controlPanel/controlPanel"
						})
					},1000)
				}
				else if(res.statusCode == 401){
					uni.showToast({
						title:'请重新登录',
						duration:1000
					})
				}
				
			}
		},
		onLoad() {
			if (uni.getStorageSync('jwt')) {
				this.PassportCheck()
			}
			this.identifier = uni.getStorageSync('identifier')
		}
	}
</script>

<style lang="scss">
page{
	background-color: #FFF;
}
.content {
	display: flex;
	flex-direction: column;
	justify-content: center;
	font-family: Helvetica Neue,Arial,PingFang SC,Hiragino Sans GB,Microsoft Yahei,WenQuanYi Micro Hei,sans-serif;
	.sendAudit{
		width: 600rpx;
		background-color: #FFFFFF;
		margin: 0rpx auto;
		.headertitle{
			padding: 20rpx;
			margin: 20rpx;
			font-size: 28rpx;				
			text-align: center;
			letter-spacing: 1rpx;
			span{
				color: #DD524D;
				font-weight: bold;
				font-size: 38rpx;
			};
		}
		.sendbottom{
			width: 540rpx;
			margin: 30rpx auto;
			.confimbtn{
				height: 80rpx;
				background-image: linear-gradient(to right,#DB1F1F, #DD524D);
				border-radius: 20rpx;
				text-align: center;
				line-height: 80rpx;
				font-size: 35rpx;
				color: #FFFFFF;
				margin: 20rpx;
			}			
		}
	}
	.pc-login-area{
		margin-top: 100px;
	}
	
	.login-area {
		z-index: 2;
		display: flex;
		justify-content: center;
		.title {
			margin-top: 40rpx;
			.dash{
				width: 60rpx;
				height: 10rpx;
				border-bottom: 15rpx #DB1F1F dashed;
			}
			.maintitle{
				margin-top: 20rpx;
				font-size: 50rpx;
				color: #000;
				letter-spacing: 5rpx;
			}
			.input{
				width: 600rpx;
				margin-bottom: 30rpx;
				.inputarea{
					margin: 30rpx 0rpx;
					background-color: #fafafc;
					border-radius: 10rpx;
					box-shadow: inset 0 5rpx 10rpx 0 #d2d6ea;
				}
			}
			.btn{
				margin-top: 20rpx;
				background-image: linear-gradient(to right,#DB1F1F, #DD524D);
				color: #fff;
			}
			.btn:hover{
				background-image: linear-gradient(to right,#DD524D, #DB1F1F);
			}
			.btn-hover{
				background-image: linear-gradient(to right,#DD524D, #DB1F1F);
			}
			.btn2{
				margin-top: 20rpx;
				background-image: linear-gradient(to right,#9098a3, #5c6c7c);
				color: #fff;
			}
			.btn2:hover{
				background-image: linear-gradient(to right,#5c6c7c, #262626);
			}
			.btn-hover2{
				background-image: linear-gradient(to right,#5c6c7c, #262626);
			}
		}
		
	}	
}
</style>
