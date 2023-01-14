<template>
	<view class="content" style="width: 750rpx;">		
		<view v-if="showCountDown" style="top:30rpx;right:30rpx;position: absolute;z-index: 299;background-color: rgba(0,0,0,0.7);
		color: #FFF;padding: 10rpx 20rpx;border-radius: 20rpx;"
		@tap="showVideo=false;showCountDown=false">
			跳过{{startCountDown&&countdown>0?countdown:''}}
		</view>
		<view v-if="showVideo&&!developMode" style="display: flex;">				
			<view v-if="showPost" @click="videoPlay()" style="position: absolute;z-index: 99;">
				<view style="display: flex;">
					<view class="red-dot" style="position: absolute;z-index: 199;margin:600rpx 275rpx;width:200rpx;
					  height:200rpx;border-radius:150rpx;background:#DB1F1F;">
					  <view style="width: 120rpx;line-height: 60rpx;margin:35rpx auto 0;color: gold;font-size: 60rpx;font-weight: bold;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
						点击参与
					  </view>
					</view>
					<image style="background:#fe7048;width: 750rpx;min-height: 1333rpx;" mode="widthFix" :src="post[randomNum].postImg"></image>
				</view>
			</view>
			<view style="">
				<video @click="unMuted()" :autoplay="true" :muted="muted" @ended="videoEnd()" style="background-color: #fe7048;margin-top: 0rpx;width:750rpx;height:1333rpx;" :controls="false" :poster="post[randomNum].postImg" :src="post[randomNum].video"  @play="onVideoPlay()" id="video" object-fit="cover"></video>
			</view>
			<view style="position: absolute;z-index: -99"><u-count-down ref="countDown" :autoStart="false" :time="post[randomNum].duration * 1000" format="ss" @change="onCountdownChange"></u-count-down></view>
		</view>
		
		<view v-if="isWechatPage" style="position: fixed;bottom: 0rpx;z-index: 199;
		background-image: linear-gradient(to bottom,rgba(0,0,0,0), rgba(0,0,0,0.8), rgba(0,0,0,0.9));
		width: 750rpx;height: 200rpx;display: flex;flex-direction: column;align-items: center;justify-content: center;">
			<wx-open-launch-weapp id="launch-btn" username="跳转小程序原始ID" path="跳转小程序页面路径">
				<script type="text/wxtag-template">	
					<style>
						.btn {
							border-radius: 10px;  
							margin-top: 20px;
							height: 30px;  
							font-size: 18px; 
							margin: 0 0px;
							border: none !important;  
							color: #401010;  
							background:#F0AD4E;
							
						}
					</style>
						<button class="btn" type="default">
							去微信小程序体验完整功能			
						</button>  
				</script>
			</wx-open-launch-weapp>
		</view>
		<view v-if="!showVideo||developMode" style="margin: 0 10px; border-radius: 8px; box-sizing: border-box; display: flex; flex-direction: column;">
			<view @tap="showPostPic = true" style="align-self: center;font-size: 27rpx;display: flex;top: 600rpx;right: 30rpx;
			position: absolute;z-index: 99;
			padding: 0 10rpx 0 5rpx;margin:0 5rpx;font-weight: bold;line-height: 40rpx;
			background-color: #03a54a;color:#FFF;border: 5rpx #401010 solid;height: 40rpx;text-align: center;border-radius: 20rpx;">
				<u-icon color="#FFF" size="28rpx" name="share"></u-icon>
				分享
			</view>
			<image style="width: 750rpx;" mode="widthFix" :src="bgImg.topImg"></image>			
			<view class="noteBG" :style="'background-image:url('+bgImg.bgImg+') ;'">
				<view style="width: 550rpx;margin: 0 auto;word-break: break-all;">
					<u-notice-bar :text="'寻找人数最多的兔窝群~~当前已有'+eventSetting.groupInCircleCount+'个粉丝群加入'+eventSetting.zodiac+'圈，可领取更多福利>>'" color="#fe7048" mode="closable" speed="50" @click="showEventInfo = true"></u-notice-bar>
					<view v-if="logined" style="font-size: 32rpx;color: #333;margin-top: 10rpx;">
						Hello，{{$dataDecryptPublic(userinfo.salutation)}}{{$dataDecryptPublic(userinfo.zodiac) == eventSetting.zodiac?'，记得那也是一个'+$dataDecryptPublic(userinfo.zodiac):'，记得那是一个'+$dataDecryptPublic(userinfo.zodiac)}}年，您出生{{$dataDecryptPublic(userinfo.birthplace)=="新德阳人"?"了，欢迎您，新德阳人。":"在"+$dataDecryptPublic(userinfo.birthplace)+'。'}}
					</view>
					<view style="font-size: 32rpx;color: #333;margin-top: 10rpx;">
						这个春节，德阳市民通将通过线上粉丝群发放总额超过<view style="display: inline-block;color:#fe7048;margin: 0 5rpx;font-weight: bold;">10万元</view>的微信立减金和消费券红包，更有电影票、年货、购物卡等超多福利等您来抢。
					</view>
					
					<view v-if="userinfo.zhaolaogen" style="border-bottom: #ccc dashed 2rpx;padding-bottom: 20rpx;margin-bottom: 20rpx;">
						<view style="width: 550rpx;margin: 30rpx auto 0rpx;display: flex;justify-content: space-between;">
							<view style="font-size: 22rpx;width: 60rpx;height: 60rpx;color:#DB1F1F;border: #DB1F1F 5rpx solid;border-radius: 20rpx;line-height: 30rpx;font-weight: bold;text-align: center;align-self: center;margin: 0 5rpx;padding: 2rpx;">
								您加入的
							</view>
							<view style="width: 80rpx">
								<view v-if="userinfo.zhaolaogen.joinedCircle" style="font-size: 16rpx;color: #DB1F1F;background-color: #FFD554;z-index: 99;position: absolute;
								border: 3rpx #DB1F1F solid;display: inline-block;padding: 0 5rpx;border-radius: 10rpx 0 0 0;">
									已入圈
								</view>
								<view v-else style="font-size: 16rpx;color: #DB1F1F;background-color: #FFD554;z-index: 99;position: absolute;
								border: 3rpx #DB1F1F solid;display: inline-block;padding: 0 5rpx;border-radius: 10rpx 0 0 0;">
									{{userinfo.zhaolaogen.rank!==0?'排名'+userinfo.zhaolaogen.rank:'99名外'}}
								</view>
								<image mode="aspectFill" style="width: 80rpx;height: 80rpx;border-radius: 10rpx;" :src="userinfo.zhaolaogen.groupAvator||eventSetting.groupAvator[Math.floor(Math.random()*eventSetting.groupAvator.length)]"></image>
							</view>
							<view style="align-self: center;width: 400rpx;">
								<view style="text-align: center;width:400rpx;font-weight: bold;color: #401010;display: flex;">
									<view style="display: inline-block;padding: 0 5rpx;color: #ccc;font-weight: 300;">[{{userinfo.zhaolaogen.id}}]</view>
									<u-tooltip :text="userinfo.zhaolaogen.weChatGroupName.length>11?userinfo.zhaolaogen.weChatGroupName.substr(0,10)+'...':userinfo.zhaolaogen.weChatGroupName" :buttons="['编号：'+userinfo.zhaolaogen.id+'，群名称：'+userinfo.zhaolaogen.weChatGroupName]" :showCopy="false" color="#401010" overlay></u-tooltip>
								</view>
								<view style="text-align: center;margin: 0 auto;width: 380rpx;color: #777;font-size:30rpx;justify-content: space-between;display: flex;">
									<view v-if="userinfo.zhaolaogen.joinedCircle==true" style="font-size: 25rpx;">
										<uni-dateformat format="yyyy/MM/dd" :date="userinfo.zhaolaogen.joinCircleDate" :threshold="[0,604800000]"></uni-dateformat>
										入圈
									</view>
									<view v-else style="font-size: 25rpx;">
										<view @tap="isApp?showInvit = true:showPostPic = true" style="align-self: center;font-size: 27rpx;display: flex;padding: 0 10rpx 0 5rpx;margin:0 5rpx;font-weight: bold;line-height: 35rpx;background-color: #DB1F1F;color:#FFF;border: 5rpx #401010 solid;height: 35rpx;text-align: center;border-radius: 20rpx;">
											<u-icon color="#FFF" size="28rpx" name="share"></u-icon>
											去邀请
										</view>										
									</view>
									<view style="display: flex">
										<u-icon size="36rpx" name="user"></u-icon>
										<view style="padding: 0 5rpx;">	
											<u-tooltip :text="userinfo.zhaolaogen.rabbitConut" :buttons="['群内属'+eventSetting.zodiac+'的人数'+userinfo.zhaolaogen.rabbitConut+'人']" :showCopy="false" color="#fe7048" overlay></u-tooltip>
										</view>
									</view>
									<view style="display: flex">
										<u-icon color="#5c6c7c" size="36rpx" name="account"></u-icon>
										<view style="padding: 0 5rpx;">
											<u-tooltip :text="userinfo.zhaolaogen.userCount" :buttons="['群人数'+userinfo.zhaolaogen.userCount+'人']" :showCopy="false" color="#5c6c7c" overlay></u-tooltip>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view v-if="isApp&&showInvit" style="display: flex;margin:10rpx;">
							<view @tap="showPostPic = true" style="align-self: center;font-size: 27rpx;display: flex;padding: 0 10rpx 0 5rpx;margin:0 5rpx;font-weight: bold;line-height: 40rpx;background-color: #FFD554;color:#401010;border: 5rpx #401010 solid;height: 40rpx;text-align: center;border-radius: 20rpx;">
								<u-icon color="#401010" size="28rpx" name="photo"></u-icon>
								生成海报
							</view>
							<view v-if="isApp" @tap="onclickshare()" style="align-self: center;font-size: 27rpx;display: flex;padding: 0 10rpx 0 5rpx;margin:0 5rpx;font-weight: bold;line-height: 40rpx;background-color: #03a54a;color:#FFF;border: 5rpx #401010 solid;height: 40rpx;text-align: center;border-radius: 20rpx;">
								<u-icon color="#FFF" size="28rpx" name="share"></u-icon>
								链接分享
							</view>
							<view @tap="showInvit = false" style="margin-left: 10rpx;">
								<u-icon color="#333" top="1" size="40rpx" name="close"></u-icon>
							</view>
						</view>
						<view v-if="userinfo.zhaolaogen.joinedCircle" style="font-size: 18rpx;color: #777777;text-align: center;margin-top: 20rpx;">
							<view style="display: flex;margin: 0 60rpx;">
								<view style="align-self: center;">
									已加入兔圈并解锁所有福利
								</view>
								<view @tap="showEventInfo = true" style="font-size: 20rpx;display: inline-block;padding: 0 5rpx;margin:0 15rpx;font-weight: bold;line-height: 40rpx;background-color: #fe7048;color:#FFF;border: 5rpx #401010 solid;height: 40rpx;text-align: center;border-radius: 20rpx;">
									查看福利
								</view>
							</view>
						</view>
						<view v-else style="font-size: 18rpx;color: #777777;text-align: center;margin-top: 20rpx;">
							朋友入群后分享此页面让TA确认报名后，活动人数才会增加
						</view>
					</view>
					<view class="index-con"></view>
					<view v-if="logined&&showGruopQR&&sending&&!userinfo.zhaolaogen" style="font-size: 33rpx;font-weight: bold;margin: 20rpx auto 0;line-height: 70rpx;background-color: #fe7048;color:#FFF;border: 5rpx #401010 solid;width: 500rpx;height: 70rpx;text-align: center;border-radius: 50rpx;">
						我已加入{{groupID}}群，点此确认群号
					</view>
					<view :class="inputChangeIn3?'red-dot':''" @tap="checkGroupID(groupID)" v-if="logined&&showGruopQR&&!sending&&!userinfo.zhaolaogen" style="font-size: 33rpx;font-weight: bold;margin: 20rpx auto 0;line-height: 70rpx;background-color: #fe7048;color:#FFF;border: 5rpx #401010 solid;width: 500rpx;height: 70rpx;text-align: center;border-radius: 50rpx;">
						我已加入{{groupID}}群，点此确认群号
					</view>
					<view v-if="logined&&showGruopQR&&!userinfo.zhaolaogen" style="width: 620rpx;margin: 10rpx auto 0;display: flex;">
						<view :class="inputChangeIn3?'':'red-dot'" style="align-self: center;margin:0 10rpx;display: inline-block;padding: 0 10rpx;
						  height:50rpx;border-radius:20rpx;">
						  <view style="display: inline-block;padding: 0 0 0 10rpx;line-height: 50rpx;margin:0rpx auto 0;color: #fe7048;font-size: 27rpx;font-weight: bold;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
							输入群名中的数字：
						  </view>
						</view>
						<u--input @blur="inputStopChange()" @change="inputChange()" color="#401010" type="number" inputAlign="center" placeholder="请输入群号" border="surround" v-model="groupID" ></u--input>
						<view @click="showExample = true" style="align-self: center;font-size: 27rpx;display: inline-block;padding: 0 10rpx;margin:0 10rpx;font-weight: bold;line-height: 50rpx;background-color: #FFD554;color:#401010;border: 5rpx #401010 solid;height: 50rpx;text-align: center;border-radius: 20rpx;">
							查看示例
						</view>
						<u-popup :closeable="true" :show="showChooseConfimed" mode="bottom" @close="closeChooseConfimed()">
							<view style="height: 300rpx;">		
								<view style="width: 600rpx;margin:50rpx 75rpx 0rpx;text-align: center;font-size: 28rpx;">
									您即将加入<text style="font-weight: 600">{{groupName}}</text>，编号“{{groupID}}”，加入以后不可更改，请确认
								</view>	
								<view style="margin:50rpx 30rpx;justify-content: space-between;display: flex;flex-wrap:wrap;">
									
									<view @tap="closeChooseConfimed()" style="display: flex;background-color: #5c6c7c;font-weight: 600;border-radius: 20rpx;margin: 10rpx; padding: 8rpx 20rpx;color: #FFF;">
										<text style="padding-right: 10rpx;font-size: 28rpx;">取消</text>
										<u-icon name="close" color="#FFF"></u-icon>
									</view>
									<view v-if="sending" style="display: flex;font-weight: 600;background-color: #fe7048;border-radius: 20rpx;margin: 10rpx; padding: 8rpx 20rpx;color: #FFF;">
										<text style="padding-right: 10rpx;font-size: 28rpx;">确认群号</text>
										<u-icon name="checkmark" color="#FFF"></u-icon>
									</view>
									<view v-else @tap="sendChooseConfimed(groupID)" style="display: flex;font-weight: 600;background-color: #fe7048;border-radius: 20rpx;margin: 10rpx; padding: 8rpx 20rpx;color: #FFF;">
										<text style="padding-right: 10rpx;font-size: 28rpx;">确认群号</text>
										<u-icon name="checkmark" color="#FFF"></u-icon>
									</view>
								</view>
							</view>
						</u-popup>
					</view>
					<u-popup :closeable="true" :show="showExample" :round="10" mode="center" @close="closeExample">
						<view style="width: 700rpx;">
							<image style="width: 670rpx;margin: 10rpx;" mode="widthFix" :src="eventSetting.exampleImg"></image>
						</view>
					</u-popup>
					<view v-if="logined&&showGruopQR&&!userinfo.zhaolaogen" style="font-size: 28rpx;color: #fe7048;text-align: center;">
						请在上方输入并确认您加入的粉丝群编号
						<view style="line-height: 50rpx;color: #fe7048;font-size: 27rpx;font-weight: bold;">
							还没加入粉丝群？推荐您加入下面这个群
						</view>
					</view>
					<view v-if="!showGruopQR&&!userinfo.zhaolaogen" @click="clickJoinBtn()" style="font-weight: bold;margin: 20rpx auto 0;line-height: 70rpx;background-color: #FFD554;color:#401010;border: 5rpx #401010 solid;width: 500rpx;height: 70rpx;text-align: center;border-radius: 50rpx;">
						点此加入粉丝群瓜分十万红包
					</view>
					<view v-if="!showGruopQR" style="font-size: 24rpx;color: #777777;text-align: center;">
						当前已有<view class="inlineBox">{{eventSetting.groupInCircleCount}}</view>个粉丝群加入{{eventSetting.zodiac}}圈，可领更多福利
					</view>
					<view style="display: flex;justify-content: space-between;margin-top: 20rpx;">
						<view @tap="showRank = true;" style="align-self: center;font-size: 27rpx;display: flex;padding: 0 10rpx 0 5rpx;margin:0 10rpx;font-weight: bold;line-height: 50rpx;background-color: #DB1F1F;color:#FFF;border: 5rpx #401010 solid;height: 50rpx;text-align: center;border-radius: 20rpx;">
							<u-icon size="36rpx" name="user"></u-icon>
							排行榜
						</view>
						<view v-if="showGruopQR&&!showInvit" @tap="isApp?showInvit = true:showPostPic = true" style="align-self: center;font-size: 27rpx;display: flex;padding: 0 10rpx 0 5rpx;margin:0 5rpx;font-weight: bold;line-height: 40rpx;background-color: #fe7048;color:#FFF;border: 5rpx #401010 solid;height: 40rpx;text-align: center;border-radius: 20rpx;">
							<u-icon color="#FFF" size="28rpx" name="share"></u-icon>
							邀请好友
						</view>
						<view v-if="showGruopQR&&showInvit" style="display: flex;">
							<view @tap="showPostPic = true" style="align-self: center;font-size: 27rpx;display: flex;padding: 0 10rpx 0 5rpx;margin:0 5rpx;font-weight: bold;line-height: 40rpx;background-color: #FFD554;color:#401010;border: 5rpx #401010 solid;height: 40rpx;text-align: center;border-radius: 20rpx;">
								<u-icon color="#401010" size="28rpx" name="photo"></u-icon>
								生成海报
							</view>
							<view v-if="isApp" @tap="onclickshare()" style="align-self: center;font-size: 27rpx;display: flex;padding: 0 10rpx 0 5rpx;margin:0 5rpx;font-weight: bold;line-height: 40rpx;background-color: #03a54a;color:#FFF;border: 5rpx #401010 solid;height: 40rpx;text-align: center;border-radius: 20rpx;">
								<u-icon color="#FFF" size="28rpx" name="share"></u-icon>
								链接分享
							</view>
							<view @tap="showInvit = false" style="margin-left: 10rpx;">
								<u-icon color="#333" top="1" size="40rpx" name="close"></u-icon>
							</view>
						</view>
						<view v-if="!showGruopQR" @tap="showRules = true" style="font-size: 27rpx;display: inline-block;padding: 0 10rpx;margin:0 10rpx;font-weight: bold;line-height: 50rpx;background-color: #fe7048;color:#FFF;border: 5rpx #401010 solid;height: 50rpx;text-align: center;border-radius: 20rpx;">
							群互动公约
						</view>
						<view v-if="!showGruopQR" @tap="showEventInfo = true" style="font-size: 27rpx;display: inline-block;padding: 0 10rpx;margin:0 10rpx;font-weight: bold;line-height: 50rpx;background-color: #fe7048;color:#FFF;border: 5rpx #401010 solid;height: 50rpx;text-align: center;border-radius: 20rpx;">
							活动规则介绍
						</view>
					</view>
					
					<u-popup :closeable="true" :show="showPostPic" :round="10" mode="center" @close="closePostPic">
						<view v-if="isWildBrowser||isWechatPage" style="width: 670rpx;">
							<image style="width: 500rpx;margin: 10rpx 85rpx;" mode="widthFix" :src="eventSetting.normalPostImg"></image>
						</view>
						<view v-else style="width: 670rpx;">
							<view style="margin: 30rpx auto 10rpx;text-align: center;font-size: 36rpx;color: #DB1F1F;font-weight: bold">
								<view style="display: inline-flex;">
									<u-icon color="#DB1F1F" size="40rpx" name="user"></u-icon>
								</view>
								请选择分享海报风格
							</view>
							<view style="margin: 20rpx 20rpx 0rpx;">
								<u-subsection :list="postListKey" fontSize="15" bgColor="#fe7048" inactiveColor="#FFF" activeColor="#DB1F1F" :current="currentPost" @change="postChange"></u-subsection>
							</view>
							<image v-if="currentPost == 0" @tap="isApp?previewPostImg(eventSetting.normalPostImg):''" style="width: 500rpx;margin: 10rpx 85rpx;" mode="widthFix" :src="eventSetting.normalPostImg"></image>
							<image v-if="currentPost == 1&&tempPostPath" @tap="isApp?previewPostImg(eventSetting.normalPostImg):''" style="width: 500rpx;margin: 10rpx 85rpx;" mode="widthFix" :src="tempPostPath"></image>
							<view v-if="currentPost == 1&&!tempPostPath" style="margin: 10rpx 85rpx;">
								<u-skeleton
									rows="0"
									:animate="true"
									titleWidth="100%"
									titleHeight="453px"
								></u-skeleton>
							</view>
							<view v-if="currentPost == 1" style="display: flex;font-size: 28rpx;color: #fe7048;text-align: center;line-height: 50rpx;margin: 0rpx 80rpx 20rpx;">
								您的称呼：{{currentTitle}}
								<u-picker ref="selectedTitle" @confirm="confirmTitle" @close="closeTitle()" :show="showTitles" title="选择称呼" confirmColor="#DB1F1F" confirmText="确认称呼" :columns="titleColumns" keyName="label"></u-picker>
								<view @tap="showTitles = true" style="align-self: center;font-size: 27rpx;display: flex;padding: 0 10rpx 0 5rpx;margin:0 5rpx;font-weight: bold;line-height: 40rpx;background-color: #DB1F1F;color:#FFF;border: 5rpx #401010 solid;height: 40rpx;text-align: center;border-radius: 20rpx;">
									<u-icon color="#FFF" size="28rpx" name="edit-pen"></u-icon>
									点此选择
								</view>
							</view>
							<view v-if="currentPost == 0" style="font-size: 28rpx;color: #fe7048;text-align: center;line-height: 50rpx;margin: 0rpx 0 20rpx;">
								您可能需要扫描或截图加入微信粉丝群
							</view>
							<view v-if="currentPost == 1" style="font-size: 24rpx;color: #777777;text-align: center;line-height: 50rpx;margin: 0rpx 0 20rpx;">
								{{isMiniProgram||isWechatPage?'长按保存图片，分享给朋友':'您可能需要扫描或截图加入微信粉丝群'}}
							</view>
						</view>
						<l-painter
						  isCanvasToTempFilePath
						  @success="tempPostPath = $event"
						  custom-style="position: fixed; left: 200%"
						  css="width: 800px;height:1442px; padding-bottom: 40rpx;background-image:url(../../static/postBg.jpg) ;"
						>
						<template v-if="showCurrentPost">
						  <l-painter-view
						    css="margin-top: 40rpx; padding-left: 20rpx; display: inline-block"
						  >
						    <l-painter-text
						      :text="currentTitle"
						      :css="'display: block; padding-bottom: 10rpx; color: #031453; font-size: 50px; fontWeight: bold;margin:120px '+(currentTitle.length > 2?320:340)+'px;'"
						    />
						  </l-painter-view>
						  </template>
						</l-painter>
						
					</u-popup>
					<u-popup :closeable="true" :show="showRank" :round="10" mode="center" @close="closeRank">
						<view style="margin:0 50rpx">
							<u-subsection :list="listKey" fontSize="15" bgColor="#FFF" inactiveColor="#fe7048" activeColor="#DB1F1F" :current="currentRank" @change="subsectionChange"></u-subsection>
						</view>
						<view style="width: 650rpx;">
							
							<view v-if="!userinfo.zhaolaogen&&logined">
								<view @click="showRank = false;showGruopQR = true" style="font-weight: bold;margin: 20rpx auto 0;line-height: 70rpx;background-color: #FFD554;color:#401010;border: 5rpx #401010 solid;width: 500rpx;height: 70rpx;text-align: center;border-radius: 50rpx;">
									点此加入粉丝群瓜分十万红包
								</view>
							</view>
							<view v-if="currentRank == 0" style="font-weight: bold;margin: 20rpx auto 0;line-height: 70rpx;background-color: #fe7048;color:#FFF;border: 5rpx #401010 solid;width: 420rpx;height: 70rpx;text-align: center;border-radius: 20rpx;">
								这些粉丝群已成功加入{{eventSetting.zodiac}}圈
							</view>
							<view v-if="currentRank == 1" style="font-weight: bold;margin: 20rpx auto 0;line-height: 70rpx;background-color: #fe7048;color:#FFF;border: 5rpx #401010 solid;width: 420rpx;height: 70rpx;text-align: center;border-radius: 20rpx;">
								这些粉丝群即将加入{{eventSetting.zodiac}}圈
							</view>
							<view v-if="userinfo.zhaolaogen" style="border-bottom: #ccc dashed 2rpx;padding-bottom: 20rpx;margin-bottom: 20rpx;">
								<view style="width: 600rpx;margin: 30rpx auto 0rpx;display: flex;justify-content: space-between;">
									<view style="width: 70rpx;height: 70rpx;color:#DB1F1F;border: #DB1F1F 5rpx solid;border-radius: 20rpx;line-height: 35rpx;font-size: 30rpx;font-weight: bold;text-align: center;align-self: center;margin: 0 5rpx;padding: 5rpx;">
										您加入的
									</view>
									<view style="width: 100rpx">
										<view v-if="userinfo.zhaolaogen.joinedCircle" style="font-size: 18rpx;color: #DB1F1F;background-color: #FFD554;z-index: 99;position: absolute;
										border: 3rpx #DB1F1F solid;display: inline-block;padding: 0 5rpx;border-radius: 10rpx 0 0 0;">
											已入圈
										</view>
										<view v-else style="font-size: 18rpx;color: #DB1F1F;background-color: #FFD554;z-index: 99;position: absolute;
										border: 3rpx #DB1F1F solid;display: inline-block;padding: 0 5rpx;border-radius: 10rpx 0 0 0;">
											{{userinfo.zhaolaogen.rank!==0?'排名'+userinfo.zhaolaogen.rank:'99名外'}}
 										</view>
										<image mode="aspectFill" style="width: 90rpx;height: 90rpx;border-radius: 10rpx;" :src="userinfo.zhaolaogen.groupAvator||eventSetting.groupAvator[Math.floor(Math.random()*eventSetting.groupAvator.length)]"></image>
									</view>
									<view style="align-self: center;width: 420rpx;">
										<view style="text-align: center;width:420rpx;font-weight: bold;color: #401010;display: flex;">
											<view style="display: inline-block;padding: 0 5rpx;color: #ccc;font-weight: 300;">[{{userinfo.zhaolaogen.id}}]</view>
											<u-tooltip :text="userinfo.zhaolaogen.weChatGroupName.length>11?userinfo.zhaolaogen.weChatGroupName.substr(0,10)+'...':userinfo.zhaolaogen.weChatGroupName" :buttons="['编号：'+userinfo.zhaolaogen.id+'，群名称：'+userinfo.zhaolaogen.weChatGroupName]" :showCopy="false" color="#401010" overlay></u-tooltip>
										</view>
										<view style="text-align: center;margin: 0 auto;width: 400rpx;color: #777;font-size:30rpx;justify-content: space-between;display: flex;">
											<view v-if="userinfo.zhaolaogen.joinedCircle==true" style="font-size: 25rpx;">
												<uni-dateformat format="yyyy/MM/dd" :date="userinfo.zhaolaogen.joinCircleDate" :threshold="[0,604800000]"></uni-dateformat>
												入圈
											</view>
											<view v-else style="font-size: 25rpx;">
												<view @tap="isApp?showInvit = true:showPostPicAndCloseRank()" style="align-self: center;font-size: 27rpx;display: flex;padding: 0 10rpx 0 5rpx;margin:0 5rpx;font-weight: bold;line-height: 35rpx;background-color: #DB1F1F;color:#FFF;border: 5rpx #401010 solid;height: 35rpx;text-align: center;border-radius: 20rpx;">
													<u-icon color="#FFF" size="28rpx" name="share"></u-icon>
													去邀请
												</view>												
											</view>
											<view style="display: flex">
												<u-icon size="36rpx" name="user"></u-icon>
												<view style="padding: 0 5rpx;">	
													<u-tooltip :text="userinfo.zhaolaogen.rabbitConut" :buttons="['群内属'+eventSetting.zodiac+'的人数'+userinfo.zhaolaogen.rabbitConut+'人']" :showCopy="false" color="#fe7048" overlay></u-tooltip>
												</view>
											</view>
											<view style="display: flex">
												<u-icon color="#5c6c7c" size="36rpx" name="account"></u-icon>
												<view style="padding: 0 5rpx;">
													<u-tooltip :text="userinfo.zhaolaogen.userCount" :buttons="['群人数'+userinfo.zhaolaogen.userCount+'人']" :showCopy="false" color="#5c6c7c" overlay></u-tooltip>
												</view>
											</view>
										</view>
										<view v-if="isApp&&showInvit" style="display: flex;">
											<view @tap="showPostPic = true" style="align-self: center;font-size: 27rpx;display: flex;padding: 0 10rpx 0 5rpx;margin:0 5rpx;font-weight: bold;line-height: 40rpx;background-color: #FFD554;color:#401010;border: 5rpx #401010 solid;height: 40rpx;text-align: center;border-radius: 20rpx;">
												<u-icon color="#401010" size="28rpx" name="photo"></u-icon>
												生成海报
											</view>
											<view v-if="isApp" @tap="onclickshare()" style="align-self: center;font-size: 27rpx;display: flex;padding: 0 10rpx 0 5rpx;margin:0 5rpx;font-weight: bold;line-height: 40rpx;background-color: #03a54a;color:#FFF;border: 5rpx #401010 solid;height: 40rpx;text-align: center;border-radius: 20rpx;">
												<u-icon color="#FFF" size="28rpx" name="share"></u-icon>
												链接分享
											</view>									
											<view @tap="showInvit = false" style="margin-left: 10rpx;">
												<u-icon color="#333" top="1" size="40rpx" name="close"></u-icon>
											</view>
										</view>
									</view>
								</view>
								<view v-if="userinfo.zhaolaogen.joinedCircle" style="font-size: 18rpx;color: #777777;text-align: center;margin-top: 20rpx;">
									<view style="display: flex;margin: 0 110rpx;">
										<view style="align-self: center;">
											已加入兔圈并解锁所有福利
										</view>
										<view @tap="showRank = false;showEventInfo = true" style="font-size: 20rpx;display: inline-block;padding: 0 5rpx;margin:0 15rpx;font-weight: bold;line-height: 40rpx;background-color: #fe7048;color:#FFF;border: 5rpx #401010 solid;height: 40rpx;text-align: center;border-radius: 20rpx;">
											查看福利
										</view>
									</view>
								</view>
								<view v-else style="font-size: 18rpx;color: #777777;text-align: center;margin-top: 20rpx;">
									赶紧邀请朋友加入，朋友入群后记得分享此页面让TA确认报名哦！
								</view>
							</view>
							
							<view style="width: 600rpx;margin: 0rpx auto 20rpx">
								<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" :style="'height:'+scrollHeight+'rpx'" >
									
									<view v-for="(item,index) in groupList" :key="index"
									style="margin: 20rpx 10rpx;display: flex;justify-content: space-between;">
										<view>
											<view v-if="index+1 <= eventSetting.topNumJoincircle && currentRank == 0" style="font-size: 18rpx;color: #FFF;background-color: #DB1F1F;z-index: 99;position: absolute;
											border: 3rpx #401010 solid;display: inline-block;padding: 0 5rpx;border-radius: 10rpx 0 0 0;">
												新入圈
											</view>
											<view v-if="currentRank == 1" style="font-size: 18rpx;color: #FFF;background-color: #DB1F1F;z-index: 99;position: absolute;
											border: 3rpx #401010 solid;display: inline-block;padding: 0 5rpx;border-radius: 10rpx 0 0 0;">
												{{item.rank}}
											</view>
											<image mode="aspectFill" style="width: 100rpx;height: 100rpx;border-radius: 10rpx;" :src="item.groupAvator||eventSetting.groupAvator[Math.floor(Math.random()*eventSetting.groupAvator.length)]"></image>
										</view>
										<view style="align-self: center;">
											<view style="text-align: center;width: 500rpx;font-weight: bold;color: #401010;display: flex;">
												<view style="display: inline-block;padding: 0 5rpx;color: #ccc;font-weight: 300;">[{{item.id}}]</view>
													<u-tooltip direction="bottom" :text="item.weChatGroupName.length>13?item.weChatGroupName.substr(0,12)+'...':item.weChatGroupName" :buttons="['编号：'+item.id+'，群名称：'+item.weChatGroupName]" :showCopy="false" color="#401010" overlay></u-tooltip>
											</view>
											<view style="text-align: center;margin: 0 auto;width: 400rpx;color: #777;font-size:30rpx;justify-content: space-between;display: flex;">
												<view style="font-size: 25rpx;">
													<uni-dateformat format="yyyy/MM/dd" :date="item.joinCircleDate" :threshold="[0,604800000]"></uni-dateformat>
													加入
												</view>
												<view style="display: flex">
													<u-icon size="36rpx" name="user"></u-icon>
													<view style="padding: 0 5rpx;">	
														<u-tooltip :text="item.rabbitConut" :buttons="['群内属'+eventSetting.zodiac+'的人数'+item.rabbitConut+'人']" :showCopy="false" color="#fe7048" overlay></u-tooltip>
													</view>
												</view>
												<view style="display: flex">
													<u-icon color="#5c6c7c" size="36rpx" name="account"></u-icon>
													<view style="padding: 0 5rpx;">
														<u-tooltip :text="item.userCount" :buttons="['群人数'+item.userCount+'人']" :showCopy="false" color="#5c6c7c" overlay></u-tooltip>
													</view>
												</view>
											</view>
										</view>
									</view>
									
								</scroll-view>
							</view>
						</view>
					</u-popup>
					<view v-if="showGruopQR">
						<image style="width: 550rpx;" mode="widthFix" :src="eventSetting.currentGroup.weChatGroupQR"></image>
						<view  class="red-dot"  v-if="showGruopQR" style="font-size: 28rpx;color: #fe7048;text-align: center;line-height: 50rpx;">
							您可能需要扫描或截图加入微信粉丝群
						</view>
						<view v-if="showGruopQR" style="font-size: 32rpx;color: #401010;text-align: center;">
							群满了？失效了？
							<view @click="showAdmin = true;warningAdmin()" style="align-self: center;font-size: 27rpx;display: inline-block;padding: 0 10rpx;margin:0 10rpx;font-weight: bold;line-height: 50rpx;background-color: #fe7048;color:#FFF;border: 5rpx #401010 solid;height: 50rpx;text-align: center;border-radius: 20rpx;">
								提醒管理员
							</view>
						</view>
						<u-popup :closeable="true" :show="showAdmin" :round="10" mode="center" @close="closeAdmin">
							<view style="width: 700rpx;">
								<image style="width: 670rpx;margin: 10rpx;" mode="widthFix" :src="eventSetting.currentGroup.weChatGroupAdminQR"></image>
							</view>
						</u-popup>
						<view v-if="showGruopQR" style="display: flex;justify-content: space-between;margin-top: 20rpx;">
							<view @click="showRules = true" style="font-size: 27rpx;display: inline-block;padding: 0 10rpx;margin:0 10rpx;font-weight: bold;line-height: 50rpx;background-color: #FFD554;color:#401010;border: 5rpx #401010 solid;height: 50rpx;text-align: center;border-radius: 20rpx;">
								粉丝群互动公约
							</view>
							<view @click="showEventInfo = true" style="font-size: 27rpx;display: inline-block;padding: 0 10rpx;margin:0 10rpx;font-weight: bold;line-height: 50rpx;background-color: #FFD554;color:#401010;border: 5rpx #401010 solid;height: 50rpx;text-align: center;border-radius: 20rpx;">
								寻找人最多的{{eventSetting.zodiac}}群介绍
							</view>
						</view>
					</view>
					
					<u-popup :closeable="true" :show="showEventInfo" :round="10" mode="center" @close="closeEventInfo">
						<view style="width: 600rpx;">
							<view style="font-weight: bold;margin: 20rpx auto 0;line-height: 70rpx;background-color: #fe7048;color:#FFF;border: 5rpx #401010 solid;width: 380rpx;height: 70rpx;text-align: center;border-radius: 20rpx;">
								寻找人数最多的{{eventSetting.zodiac}}窝群
							</view>
							<view style="margin: 50rpx auto;padding: 0 50rpx;">
								
								<view style="font-size: 27rpx;display: inline-block;padding: 0 10rpx;margin:0 10rpx;font-weight: bold;line-height: 50rpx;background-color: #FFD554;color:#401010;border: 5rpx #401010 solid;height: 50rpx;text-align: center;border-radius: 10rpx;">
									加入{{eventSetting.zodiac}}圈的条件 >
								</view>
								<view style="font-size: 30rpx;">	
									<text>
										1、截至当日下午6点，粉丝群人数≥<view class="inlineBox">{{eventSetting.miniGroupCount}}</view>人；
										2、属{{eventSetting.zodiac}}的群成员人数在还未加入{{eventSetting.zodiac}}圈的粉丝群中排名<view class="inlineBox">前{{eventSetting.topNumJoincircle}}</view>；
										3、粉丝群人数以在此活动页面报名人数为准，未报名成员不计入群人数。
									</text>
								</view>
								<view style="font-size: 27rpx;display: inline-block;padding: 0 10rpx;margin:0 10rpx;font-weight: bold;line-height: 50rpx;background-color: #FFD554;color:#401010;border: 5rpx #401010 solid;height: 50rpx;text-align: center;border-radius: 10rpx;">
									加入{{eventSetting.zodiac}}圈的福利 >
								</view>
								<view style="font-size: 30rpx;">
									<text>
										1、春节期间<view class="inlineBox">每日</view>{{eventSetting.giftMoment}}发随机金额群红包；
										2、手气最佳可额外获得电影票、年货、购物卡等福利；
										3、春节期间每日抽奖活动、抢券活动管理员会在群里发布，瓜分<view class="inlineBox">十万</view>微信立减金；
										4、加入{{eventSetting.zodiac}}圈的粉丝群可投票选择新的群名称，由管理员在系统中变更。
									</text>
								</view>
							</view>
					
						</view>
					</u-popup>
					<u-popup :closeable="true" :show="showRules" :round="10" mode="center" @close="closeRules">
						<view style="width: 600rpx;">
							<view style="font-weight: bold;margin: 20rpx auto 0;line-height: 70rpx;background-color: #fe7048;color:#FFF;border: 5rpx #401010 solid;width: 300rpx;height: 70rpx;text-align: center;border-radius: 20rpx;">
								粉丝群互动公约
							</view>
							<view style="margin: 50rpx auto;padding: 0 50rpx;">
								
								<view style="font-size: 27rpx;display: inline-block;padding: 0 10rpx;margin:0 10rpx;font-weight: bold;line-height: 50rpx;background-color: #FFD554;color:#401010;border: 5rpx #401010 solid;height: 50rpx;text-align: center;border-radius: 10rpx;">
									有以下行为将被移除粉丝群 >
								</view>
								<view style="font-size: 30rpx;">
									<text>
										1、重复加入多个粉丝群，多余的群将被移除；
										2、无故添加多名群成员被举报；
										3、发布涉及违法犯罪、时政等不当言论≥1次；
										4、发布广告、辱骂、低俗、谣言等不当言论≥2次，第1次警告；
										5、邀请的好友，及邀请的好友邀请的好友因第2，3，4条被移除。
									</text>
								</view>
								<view style="font-size: 27rpx;display: inline-block;padding: 0 10rpx;margin:0 10rpx;font-weight: bold;line-height: 50rpx;background-color: #FFD554;color:#401010;border: 5rpx #401010 solid;height: 50rpx;text-align: center;border-radius: 10rpx;">
									温馨提示 >
								</view>
								<view style="font-size: 30rpx;">
									<text>
										1、请勿接收其他群成员添加好友请求，提防诈骗；
										2、请勿与群成员进行任何形式的交易，提防诈骗；
										3、请慎重邀请好友进群，为净化网络空间，反垃圾时会自动清理违规用户及其整条邀请链条，若有误伤请联系管理员；
										4、若有用户无故私下添加群成员，请向管理员举报。
									</text>
								</view>
							</view>
					
						</view>
					</u-popup>
										
					<view style="font-size: 27rpx;color: #777777;margin-top: 20rpx;text-align: center;">
						此活动已有<view style="display: inline-block;"><u-badge :inverted="true" numberType="limit" type="error" :value="eventSetting.totalClick"></u-badge></view>人参与<view style="display: inline-flex;" v-if="logined">，您是其中第<view style="display: inline-block;color:#fe7048;margin: 0 10rpx;">{{userinfo.id}}</view>位</view>
					</view>
					
				</view>
			</view>
			<image style="width: 750rpx;" mode="widthFix" :src="bgImg.bottomImg"></image>
		</view>
		<view v-if="userinfo.dealer" @tap="signin()" style="align-self: center;font-size: 22rpx;display: flex;padding: 0 10rpx 0 5rpx;margin:0 10rpx 10rpx;font-weight: bold;line-height: 30rpx;background-color: #DB1F1F;color:#FFF;border: 5rpx #401010 solid;height: 30rpx;text-align: center;border-radius: 20rpx;">
			<u-icon size="22rpx" color="#FFF" name="setting"></u-icon>
			管理员登录
		</view>
		<view style="color: #DB1F1F;font-size: 25rpx;padding: 10rpx 0 30rpx;text-align: center;">
			Copyright © 2020
			<view style="display: inline-block;" v-if="new Date().getFullYear() > 2021">
				-{{new Date().getFullYear()+' '}}德阳市民通  
				<view style="display: inline-block;">
					<u-icon color="#DB1F1F" top="1" size="28rpx" name="close"></u-icon>
				</view> 造件师
			</view>
			<view style="display: inline-block;"  v-else>
				{{' '}}德阳市民通<view style="display: inline-block;">
					<u-icon color="#DB1F1F" top="1" size="28rpx" name="close"></u-icon>
				</view>造件师
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sending: false,
				developMode:false,
				countdown:0,
				showCountDown:true,
				startCountDown:false,
				currentRank:0,
				listKey: [
					 {name: '已入圈的粉丝群',rule:'inCircle'}, 
					 {name: '即将入圈排行榜',rule:'groupsRank'}
				],
				bgImg:{
					bgImg: "",
					topImg: "",
					bottomImg: "",
				},
				post:[
				  {
					postImg: "",
					video: "",
					duration:12,
					actived:true
				  },
				  {
					postImg: "",
					video: "",
					duration:10,
					actived:true
				  },
				  {
					postImg: "",
					video: "",
					duration:10,
					actived:true
				  }
				],
				groupList:[],
				groupRankList:[],
				tempPostPath:'',
				initdata:'',
				logined:false,
				showTitles:false,
				showCurrentPost:true,
				currentTitle:'',
				titleColumns:[
					[
						{
							label: '小',
							place: 'front'
						},
						{
							label: '老',
							place: 'front'
						},
						{
							label: '大',
							place: 'front'
						},
						{
							label: '少',
							place: 'back'
						},
						{
							label: '师',
							place: 'back'
						},
						{
							label: '同学',
							place: 'back'
						},
						{
							label: '老师',
							place: 'back'
						},
						{
							label: '总',
							place: 'back'
						},
						{
							label: '哥',
							place: 'back'
						},
						{
							label: '姐',
							place: 'back'
						},
					],
                ],
				isApp: false,
				isWildBrowser: false,
				isMiniProgram: false,
				isWechatPage: false,
				showInvit:false,
				showPostPic:false,
				inputChangeIn3:false,
				scrollHeight:0,
				scrollTop:0,
				currentPost:1,
				postListKey:[
					 {name: '风格1',rule:'1'}, 
					 {name: '风格2',rule:'2'}
				],				
				joinedGroup: false,
				groupID:0,
				groupName:"群名",
				showChooseConfimed: false,
				showRank: false,
				showRules: false,
				showAdmin: false,
				showExample: false,
				showGruopQR: false,
				showEventInfo: false,
				showMygroupOutCircle: false,
				showMygroupInCircle: false,
				showVideo: false,
				muted:false,
				showPost:true,
				randomNum:0,
				userinfo:{
					id: null,
					uid: null,
					nickname: null,
					img: null,
					name: null,
					phone:null,
					zodiac: "",
					card:null,
					birthplace:  "",
					gender:0,
					salutation:  "",
					dealer:false,
					zhaolaogen:null
				},
				eventSetting:{
				    zodiac: null,
					groupAvator:[],
					bgImg: "",
					topImg: "",
					bottomImg: "",
				    adminQR:  "",
				    totalUser: null,
				    totalUsed: null,
				    totalClick: null,
					topNumJoincircle:3,
					miniGroupCount:333,
					giftMoment:"",
					normalPostImg:"",
					bgPostImg:"",
					groupInCircleCount:1,
				    currentGroup: {
				        id: null,
				        weChatGroupName: null,
				        weChatGroupQR:null,
				        weChatGroupAdminQR:null,
						rabbitConut:1,
						userCount:1,
						rank:1
				    },
					groupInCircle:[]
				},
				userinfo1:{
					id: 0,
					uid: "",
					nickname: "",
					img: "",
					name: "",
					phone:"",
					zodiac: "",
					card:"",
					birthplace: "",					
					gender:1,
					salutation: "",
					dealer:true,
					zhaolaogen:null
				},
				eventSetting2:{
				    zodiac: "兔",
					bgImg: "",
					topImg: "",
					bottomImg: "",
				    adminQR:  "",
					normalPostImg:"",
					bgPostImg:"",
				    totalUser: "11",
				    totalUsed: "28",
				    totalClick: "107231",
					topNumJoincircle:3,
					miniGroupCount:333,
					groupInCircleCount:2,
					giftMoment:"11：00、19：00、20：00",
					exampleImg:"",
				    currentGroup: {
				        id: 1,
				        weChatGroupName: "德阳市民通找老根活动1群",
				        weChatGroupQR: "",
				        weChatGroupAdminQR:"",
						rabbitConut:1,
						userCount:1,
						rank:1
					},
					groupAvator:[

					],
					groupInCircle:[
						{
							"id": 1,
							"weChatGroupName": "德阳市民通找老根活动1群",
							"weChatGroupQR": "",
							"weChatGroupAdminQR": "",
							"createdAt": "2023-01-06T08:24:40.707Z",
							"updatedAt": "2023-01-07T15:48:00.012Z",
							"rabbitConut": 1,
							"userCount": 12,
							"rank": 0,
							"joinedCircle": true,
							"joinCircleDate": "2023-01-08T15:48:00.007Z",
							"groupAvator":""
						},
					]
				}
			}
		},
		onLoad() {
			this.randomNum = Math.floor(Math.random()*this.post.length)
			this.scrollHeight = uni.getSystemInfoSync().windowHeight/(uni.getSystemInfoSync().screenWidth/750)-500		
			this.isWeiXinLogin()
			console.log('isWeiXinLogin::',this.isWeiXinLogin())
			//以下测试时隐藏
			if(this.developMode){
				this.userinfo = JSON.parse(JSON.stringify(this.userinfo1))
				this.eventSetting = JSON.parse(JSON.stringify(this.eventSetting2))
			}
		},
		onReady() { //页面初次渲染完毕执行
			this.showVideo = true
			//以下测试时打开
			if(this.developMode){
				console.log("userinfo",this.userinfo)
				console.log('eventSetting::',this.eventSetting)
				this.groupList = this.eventSetting.groupInCircle
				console.log('titleColumns::',this.titleColumns[0])				
				this.groupID = this.eventSetting.currentGroup.id
				this.currentTitle = this.$dataDecryptPublic(this.userinfo.salutation)
				this.titleColumns[0].forEach((item,index) => {
					if(item.place == 'back'){
						this.titleColumns[0][index].label = (this.$dataDecryptPublic(this.userinfo.salutation)).substr(0,1)+this.titleColumns[0][index].label
					}
					else{
						this.titleColumns[0][index].label = this.titleColumns[0][index].label + (this.$dataDecryptPublic(this.userinfo.salutation)).substr(0,1)
					}
				})
			}
		},
		onPullDownRefresh() {
			setTimeout(()=>{//0.5秒延迟
				uni.stopPullDownRefresh()
				// this.getNoteGraphql(()=>{//在下拉刷新getIndexGraphql()时使用此回调函数
				// 	uni.stopPullDownRefresh()//关闭下拉刷新
				// })
			},500)
		
		},
		methods: {
			onCountdownChange(e){				
				this.countdown = e.seconds
				console.log(this.countdown)
			},
			async subsectionChange(index){
				console.log(this.listKey[index])
				this.currentRank = index;
				if(index == 0){
					this.groupList = JSON.parse(JSON.stringify(this.eventSetting.groupInCircle))
				}
				if(index == 1){
					await this.getZlgInfo()
					this.groupList = JSON.parse(JSON.stringify(this.groupRankList))
				}
			},
			showPostPicAndCloseRank(){
				this.showPostPic = true
				this.showRank = false
			},
			previewPostImg(current){
				this.showPostPic = false
				uni.previewImage({
					current:current,
					urls: [this.tempPostPath,this.eventSetting.normalPostImg],
					indicator: "default"
				})
			},
			async warningAdmin(){
				const res = await this.$comRequest({
					Method:'POST',
					url:'zhaolaogen/warning/'+this.eventSetting.currentGroup.id,
				})
				uni.showToast({
					title:"已通知管理员"
				})
			},
			async initWechat(){
				const res = await this.$comRequest({
					Method:'POST',
					url:'zhaolaogen/ticket',
				})
				this.initdata = 'jsapi_ticket='+res.data+'&noncestr=XXXXXXXXXX&timestamp='+Math.round(new Date().getTime()/1000).toString()+'&url='+window.location.href//.split('#')[0]
				console.log("initdata::",this.$dataSha1(this.initdata),this.initdata)
				let _this = this
				jWeixin.config({
				  debug: false, 
				  // debug: true, // 开启调试模式,调用的所有 api 的返回值会在客户端 alert 出来，若要查看传入的参数，可以在 pc 端打开，参数信息会通过 log 打出，仅在 pc 端时才会打印。
				  appId: 'XXXXXXXXXX', // 必填，公众号的唯一标识
				  timestamp: Math.round(new Date().getTime()/1000).toString(), // 必填，生成签名的时间戳
				  nonceStr: 'XXXXXXXXXX', // 必填，生成签名的随机串
				  signature: _this.$dataSha1(_this.initdata),// 必填，签名
				  jsApiList: ['updateAppMessageShareData','updateTimelineShareData','wx-open-launch-weapp'],// 必填，需要使用的JS接口列表
				  openTagList: ['wx-open-launch-weapp']
				});
				jWeixin.ready(function(){
					jWeixin.checkJsApi({
					  jsApiList: ['checkJsApi','updateAppMessageShareData','updateTimelineShareData'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
					  success: function(res) {
					  }
					});
					  jWeixin.updateAppMessageShareData({
						title: _this.$dataDecryptPublic(_this.userinfo.salutation)+'邀请您一起参加抢红包的'+_this.eventSetting.zodiac+'年福利',
						desc: "抢拼手气群红包，手气最佳送购物卡电影票，瓜分超十万元福利...", // 分享描述
						link: "https://XXXXXXXXXX.XXXXXXXXXX.cn", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
						imgUrl: _this.eventSetting.topImg, // 分享图标
						success: function () {
						  // 设置成功
						}
					  });
					  jWeixin.updateTimelineShareData({
						title: _this.$dataDecryptPublic(_this.userinfo.salutation)+'邀请您一起参加抢红包的'+_this.eventSetting.zodiac+'年福利',
						link: "https://XXXXXXXXXX.XXXXXXXXXX.cn",  // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
						imgUrl: _this.eventSetting.topImg, // 分享图标
						success: function () {
						  // 设置成功
						}
					});
				});
				// });
			},
			onclickshare(){
				var shareInfo = {
					title : this.$dataDecryptPublic(this.userinfo.salutation)+'邀请您一起参加抢红包的'+this.eventSetting.zodiac+'年福利',
					link : "https://XXXXXXXXXX.XXXXXXXXXX.cn"
					imgUrl : this.eventSetting.topImg,
					desc : "抢拼手气群红包，手气最佳送购物卡电影票，瓜分超十万元福利..."
				}
				cst.shareHandle(shareInfo)
			},
			confirmTitle(e) {
				// console.log('confirm', e)
				this.currentTitle = e.value[0].label
				this.showCurrentPost = false
				this.showCurrentPost = true
				this.showTitles = false				
			},
			closeTitle() {
				this.showTitles = false
			},
			postChange(index){
				this.currentPost = index
			},
			closePostPic(){
				this.showPostPic = false
			},
			//判断是否微信内置浏览器登陆
			isWeiXinLogin() {
				let ua = window.navigator.userAgent.toLowerCase();
				if (ua.match(/MicroMessenger/i) == 'micromessenger') {
					if (ua.match(/miniProgram/i) == 'miniprogram') {
						//此处在微信小程序webview中，拉起单点登录，仅提供海报分享方法
						this.isMiniProgram = true
						this.getUrlParam()
						this.getUserInfo()
						return {isWeiXin:true,isminiprogram:true,isSmtApp:false}
					}
					else{
						this.isWechatPage = true
						if(!this.developMode){this.getZlgInfo()}	
						//此处提供微信网页跳转微信小程序方法，提供微信网页分享方法
						this.initWechat()
						return {isWeiXin:true,isminiprogram:false,isSmtApp:false}
					}
				} else {
					if(cst.isCstoon()){
						//此处在APP中，拉起单点登录，提供APP分享方法
						this.isApp = cst.isCstoon()
						this.getUrlParam()
						this.getUserInfo()
						return {isWeiXin:false,isminiprogram:false,isSmtApp:true}						
					}
					else{
						//此处在野生浏览器中，弹出小程序码供扫描
						this.isWildBrowser = true
						if(!this.developMode){this.getZlgInfo()}					
						return {isWeiXin:false,isminiprogram:false,isSmtApp:false}
					}
				}				
			},
			clickJoinBtn(){
				this.showGruopQR = true
				setTimeout(()=>{//0.5秒延迟
					const query = uni.createSelectorQuery()
					 query
						.select('.index-con')
						.boundingClientRect((data) => {
						  console.log(data, 'data')
						  let pageScrollTop = Math.round(data.top)
						  uni.pageScrollTo({
							scrollTop: pageScrollTop, //滚动的距离
							duration: 0, //过渡时间
						})
					 })
					.exec()
				},500)
				 
			},
			signin(){
				uni.navigateTo({
					url:"/pages/signin/signin"
				})
			},			
			inputChange(){
				this.inputChangeIn3 = true
			},
			inputStopChange(){
				this.inputChangeIn3 = false
			},
			async sendChooseConfimed(groupID){
				this.sending = true
				const res = await this.$comRequest({
					Method:'POST',
					url:'zhaolaogen/chooseGroup/'+location.search.substr(1).match(new RegExp("(^|&)" + "code" + "=([^&]*)(&|$)"))[2],//+'sKU6721',//
					data:{
						"groupID":groupID
					}
				})
				if(res.data.succeed){
					this.sending = false
					this.userinfo = res.data.user
					uni.showToast({
						title:"报名成功",
						duration:2000
					})
					setTimeout(()=>{//2秒延迟
						this.showChooseConfimed = false
						this.showGruopQR = false
						
					},2000)
				}
				else{
					if(res.data.reason === "加入粉丝群失败，已加入过群"){
						this.sending = false
						this.userinfo = res.data.user
						uni.showToast({
							title:"已加入过群",
							duration:2000
						})
						setTimeout(()=>{//2秒延迟
							this.showChooseConfimed = false
							this.showGruopQR = false
						},2000)
					}
					else{
						this.sending = false
						uni.showToast({
							title:"请重新进入应用",
							duration:1500
						})
						setTimeout(()=>{//2秒延迟
							this.showChooseConfimed = false
						},1000)
					}
				}
			},
			closeChooseConfimed(){
				this.showChooseConfimed = false
			},
			async checkGroupID(groupID){
				this.sending = true
				const res = await this.$comRequest({
					Method:'POST',
					url:'zhaolaogen/groupName/'+groupID
				
				})
				console.log(res)
				if(res.data.succeed){
					this.sending = false
					this.groupName = res.data.weChatGroupName
					this.showChooseConfimed = true
				}
				else{
					this.sending = false
					uni.showToast({
						title:"群号无对应群"
					})
				}
			},
			closeRank(){
				this.showRank = false
			},
			closeAdmin(){
				this.showAdmin = false
			},
			closeExample(){
				this.showExample = false
			},
			closeRules(){
				this.showRules = false
			},
			closeEventInfo(){
				this.showEventInfo = false
			},
			unMuted(){
				if(this.muted == true){
					this.muted = false
				}else{
					this.muted = true
				}
				
			},
			videoEnd(){
				console.log('Video end')
				this.showVideo = false
				this.showCountDown = false
			},
			videoPlay(){
				this.$refs.countDown.start();
				this.showCountDown = true
				this.startCountDown = true
				let video = uni.createVideoContext("video", this)
				video.play();
				
			},
			onVideoPlay(){
				setTimeout(()=>{//0.5秒延迟
					this.showPost = false
				},500)
				
			},
			async getZlgInfo(){
				const res = await this.$comRequest({
					Method:'POST',
					url:'zhaolaogen/info'
				})
				this.eventSetting = res.data.zlgSetting
				this.groupList = this.eventSetting.groupInCircle
				this.groupRankList = res.data.zlgGroup
				this.groupID = this.eventSetting.currentGroup.id
			},
			async getUserInfo(){
				const res = await this.$comRequest({
					Method:'POST',
					url:'zhaolaogen/user/'+location.search.substr(1).match(new RegExp("(^|&)" + "code" + "=([^&]*)(&|$)"))[2]
				})
				this.logined = true
				this.userinfo = res.data.zlgUser
				this.eventSetting = res.data.zlgSetting
				this.groupList = this.eventSetting.groupInCircle
				this.groupID = this.eventSetting.currentGroup.id
				this.currentTitle = this.$dataDecryptPublic(this.userinfo.salutation)
				this.titleColumns[0].forEach((item,index) => {
					if(item.place == 'back'){
						this.titleColumns[0][index].label = (this.$dataDecryptPublic(this.userinfo.salutation)).substr(0,1)+this.titleColumns[0][index].label
					}
					else{
						this.titleColumns[0][index].label = this.titleColumns[0][index].label + (this.$dataDecryptPublic(this.userinfo.salutation)).substr(0,1)
					}
				})
			},			
			getUrlParam() {//页面载入时调用
				var url = '"https://XXXXXXXXXX.XXXXXXXXXX.cn"'
				var client_id = 'XXXXXXXXXX'
				var reg = new RegExp("(^|&)" + "code" + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
				var r = window.location.search.substr(1).match(reg); //匹配目标参数
				 if (r == null){
					window.location.replace("https://auths.dysmt.cn/oauth/authorize?client_id="+client_id+"&response_type=code&grant_type=authorization_code&scope=snsapi_userinfo&redirect_uri="+url);	
					}
				else{
					console.log('获取code成功')
					uni.setStorageSync("currentCode",location.search.substr(1).match(new RegExp("(^|&)" + "code" + "=([^&]*)(&|$)"))[2])
				}		
			},
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #fe7048;
	}
	.red-dot{
	  animation:fade 1500ms infinite;
	  -webkit-animation:fade 1500ms infinite;
	}
	@keyframes fade {
	  from { opacity: 1.0; }
	  50% { opacity: 0.4; }
	  to { opacity: 1.0; }
	}
	@-webkit-keyframes fade {
	  from { opacity: 1.0; }
	  50% { opacity: 0.4; }
	  to { opacity: 1.0; }
	}
	.inlineBox{
		display: inline-block;
		color:#fe7048;
		margin: 0 5rpx;
		font-weight: bold;
		word-break: break-all;
	}
	
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		
	}
	.noteBG{
		width: 750rpx;
		background-size: 750rpx;
		background-repeat:repeat-y;
	}

	
</style>
