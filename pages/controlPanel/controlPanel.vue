<template>
	<view style="width: 750rpx;background-size: 750rpx;background-repeat:repeat;background-image:url(XXXXXXXXXX) ;
		">
		<view style="padding:20rpx"> 
			<view style="background-color: rgb(254,239,224,0.95);padding: 20rpx 40rpx;">
				<view style="color:#DB1F1F;font-size: 30rpx;font-weight: bold;display: flex;">
					欢迎您，{{userInfo.name}}<u-icon name="level" color="#FFA500" size="32rpx"></u-icon>
					{{new Date().getHours()<8||new Date().getHours()>18?'，加班辛苦了！':''}}
					<view @tap="logOut()" style="font-size: 20rpx;display: inline-block;padding: 0 10rpx;margin:0 15rpx;font-weight: bold;line-height: 35rpx;background-color: #fe7048;color:#FFF;border: 5rpx #401010 solid;height: 35rpx;text-align: center;border-radius: 20rpx;">
						退出登录
					</view>
				</view>
			</view>
			<u-sticky customNavHeight="0">		
				<view class="subsection" :class="{'scrollTopChange':scrollTop>=100}">
					<u-subsection :list="listKey" fontSize="15" bgColor="#fe7048" inactiveColor="#FFF" activeColor="#DB1F1F" :current="current" @change="subsectionChange"></u-subsection>
				</view>
			</u-sticky>
			<view style="background-color: rgb(254,239,224,0.95);padding: 20rpx 40rpx;" :style="'min-height:'+scrollHeight+'rpx'">
				<view v-if="current==0" style="color:#DB1F1F;font-size: 28rpx;">
					<view @tap="showGroup = true" style="padding: 10rpx 0rpx;margin-bottom: 20rpx;background-color: #FFF;border-radius: 20rpx;border: 3rpx dashed #FFA500;">
						<view style="width: 600rpx;margin: 0rpx auto 0rpx;display: flex;justify-content: space-between;">
							<view style="font-size: 22rpx;width: 60rpx;height: 60rpx;color:#DB1F1F;border: #DB1F1F 5rpx solid;border-radius: 20rpx;line-height: 30rpx;font-weight: bold;text-align: center;align-self: center;margin: 0 5rpx;padding: 2rpx;">
								点击切换
							</view>
							<view style="width: 80rpx">
								<image mode="aspectFill" style="width: 80rpx;height: 80rpx;border-radius: 10rpx;" :src="eventSetting.currentGroup.data.attributes.groupAvator||eventSetting.groupAvator[Math.floor(Math.random()*eventSetting.groupAvator.length)]"></image>
							</view>
							<view style="align-self: center;width: 400rpx;">
								<view style="text-align: center;width:400rpx;font-weight: bold;color: #401010;display: flex;">
									<view style="display: inline-block;padding: 0 5rpx;color: #FFA500;font-weight: 300;">[{{eventSetting.currentGroup.data.id}}]</view>
									<u-tooltip :text="eventSetting.currentGroup.data.attributes.weChatGroupName.length>12?eventSetting.currentGroup.data.attributes.weChatGroupName.substr(0,11)+'...':eventSetting.currentGroup.data.attributes.weChatGroupName" :buttons="['编号：'+eventSetting.currentGroup.data.id+'，群名称：'+eventSetting.currentGroup.data.attributes.weChatGroupName]" :showCopy="false" color="#401010" overlay></u-tooltip>
								</view>
								<view style="text-align: center;margin: 0 auto;width: 380rpx;color: #777;font-size:30rpx;justify-content: space-between;display: flex;">
									<view style="display: flex">
										<u-icon size="36rpx" name="user"></u-icon>
										<view style="padding: 0 5rpx;">	
											<u-tooltip :text="eventSetting.currentGroup.data.attributes.rabbitConut" :buttons="['群内属'+eventSetting.zodiac+'的人数'+eventSetting.currentGroup.data.attributes.rabbitConut+'人']" :showCopy="false" color="#fe7048" overlay></u-tooltip>
										</view>
									</view>
									<view style="display: flex">
										<u-icon color="#5c6c7c" size="36rpx" name="account"></u-icon>
										<view style="padding: 0 5rpx;">
											<u-tooltip :text="eventSetting.currentGroup.data.attributes.userCount" :buttons="['群人数'+eventSetting.currentGroup.data.attributes.userCount+'人']" :showCopy="false" color="#5c6c7c" overlay></u-tooltip>
										</view>
									</view>
									<view style="font-size: 25rpx;">
										<view style="align-self: center;font-size: 23rpx;display: flex;padding: 0 10rpx 0 5rpx;margin:0 5rpx;font-weight: bold;line-height: 35rpx;background-color: #DB1F1F;color:#FFF;border: 5rpx #401010 solid;height: 35rpx;text-align: center;border-radius: 20rpx;">
											<u-icon color="#FFF" size="28rpx" name="pushpin"></u-icon>
											当前推荐
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<u-popup :closeable="true" :show="showGroup" :round="10" mode="center" @close="closeGroup">
						<view style="width: 650rpx;">
							<view style="font-weight: bold;margin: 30rpx auto 0;line-height: 70rpx;background-color: #fe7048;color:#FFF;border: 5rpx #401010 solid;width: 420rpx;height: 70rpx;text-align: center;border-radius: 20rpx;">
								点击选择首页推荐的粉丝群
							</view>
							<view style="border-bottom: #ccc dashed 2rpx;padding-bottom: 20rpx;margin-bottom: 20rpx;">
								<view style="width: 600rpx;margin: 30rpx auto 0rpx;display: flex;justify-content: space-between;">
									<view style="width: 70rpx;height: 70rpx;color:#DB1F1F;border: #DB1F1F 5rpx solid;border-radius: 20rpx;line-height: 35rpx;font-size: 30rpx;font-weight: bold;text-align: center;align-self: center;margin: 0 5rpx;padding: 5rpx;">
										当前推荐
									</view>
									<view style="width: 80rpx">
										<image mode="aspectFill" style="width: 80rpx;height: 80rpx;border-radius: 10rpx;" :src="eventSetting.currentGroup.data.attributes.groupAvator||eventSetting.groupAvator[Math.floor(Math.random()*eventSetting.groupAvator.length)]"></image>
									</view>
									<view style="align-self: center;width: 400rpx;">
										<view style="text-align: center;width:400rpx;font-weight: bold;color: #401010;display: flex;">
											<view style="display: inline-block;padding: 0 5rpx;color: #FFA500;font-weight: 300;">[{{eventSetting.currentGroup.data.id}}]</view>
											<u-tooltip :text="eventSetting.currentGroup.data.attributes.weChatGroupName.length>12?eventSetting.currentGroup.data.attributes.weChatGroupName.substr(0,11)+'...':eventSetting.currentGroup.data.attributes.weChatGroupName" :buttons="['编号：'+eventSetting.currentGroup.data.id+'，群名称：'+eventSetting.currentGroup.data.attributes.weChatGroupName]" :showCopy="false" color="#401010" overlay></u-tooltip>
										</view>
										<view style="text-align: center;margin: 0 auto;width: 380rpx;color: #777;font-size:30rpx;justify-content: space-between;display: flex;">
											<view style="display: flex">
												<u-icon size="36rpx" name="user"></u-icon>
												<view style="padding: 0 5rpx;">	
													<u-tooltip :text="eventSetting.currentGroup.data.attributes.rabbitConut" :buttons="['群内属'+eventSetting.zodiac+'的人数'+eventSetting.currentGroup.data.attributes.rabbitConut+'人']" :showCopy="false" color="#fe7048" overlay></u-tooltip>
												</view>
											</view>
											<view style="display: flex">
												<u-icon color="#5c6c7c" size="36rpx" name="account"></u-icon>
												<view style="padding: 0 5rpx;">
													<u-tooltip :text="eventSetting.currentGroup.data.attributes.userCount" :buttons="['群人数'+eventSetting.currentGroup.data.attributes.userCount+'人']" :showCopy="false" color="#5c6c7c" overlay></u-tooltip>
												</view>
											</view>
											<view style="font-size: 25rpx;">
												<view style="align-self: center;font-size: 23rpx;display: flex;padding: 0 10rpx 0 5rpx;margin:0 5rpx;font-weight: bold;line-height: 35rpx;background-color: #DB1F1F;color:#FFF;border: 5rpx #401010 solid;height: 35rpx;text-align: center;border-radius: 20rpx;">
													<u-icon color="#FFF" size="28rpx" name="pushpin"></u-icon>
													当前推荐
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
							<view style="font-size: 18rpx;color: #777777;text-align: center;margin-top: 20rpx;">
								只显示报名人数小于99人且还未入圈的群
							</view>
							<view style="width: 600rpx;margin: 0rpx auto 20rpx" v-if="refresh">
								<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" :style="'height:'+(scrollHeight-200)+'rpx'" >
									<view v-for="(item,index) in groups" :key="index"
									style="margin: 20rpx 10rpx;">
										<view style="display: flex;justify-content: space-between;">
											<view @tap="showQr(index)">											
												<image mode="aspectFill" style="width: 100rpx;height: 100rpx;border-radius: 10rpx;" :src="item.attributes.groupAvator||eventSetting.groupAvator[Math.floor(Math.random()*eventSetting.groupAvator.length)]"></image>
											</view>
											<view style="align-self: center;">
												<view @tap="showQr(index)" style="text-align: center;width: 500rpx;font-weight: bold;color: #401010;display: flex;">
													<view style="display: inline-block;padding: 0 5rpx;color: #ccc;font-weight: 300;">[{{item.id}}]</view>
														<u-tooltip direction="bottom" :text="item.attributes.weChatGroupName.length>17?item.attributes.weChatGroupName.substr(0,16)+'...':item.attributes.weChatGroupName" :buttons="['编号：'+item.id+'，群名称：'+item.attributes.weChatGroupName]" :showCopy="false" color="#401010" overlay></u-tooltip>
												</view>
												<view style="text-align: center;margin: 0 auto;width: 450rpx;color: #777;font-size:30rpx;justify-content: space-between;display: flex;">
													
													<view @tap="showQr(index)" style="display: flex">
														<u-icon size="36rpx" name="user"></u-icon>
														<view style="padding: 0 5rpx;">	
															<u-tooltip :text="item.attributes.rabbitConut" :buttons="['群内属'+eventSetting.zodiac+'的人数'+item.attributes.rabbitConut+'人']" :showCopy="false" color="#fe7048" overlay></u-tooltip>
														</view>
													</view>
													<view @tap="showQr(index)" style="display: flex">
														<u-icon color="#5c6c7c" size="36rpx" name="account"></u-icon>
														<view style="padding: 0 5rpx;">
															<u-tooltip :text="item.attributes.userCount" :buttons="['群人数'+item.attributes.userCount+'人']" :showCopy="false" color="#5c6c7c" overlay></u-tooltip>
														</view>
													</view>
													<view style="font-size: 25rpx;">
														<view v-if="item.qrShow&&sending" style="align-self: center;font-size: 22rpx;display: flex;padding: 0 10rpx 0 5rpx;margin:0 5rpx;font-weight: bold;line-height: 35rpx;background-color: #fe7048;color:#FFF;border: 5rpx #401010 solid;height: 35rpx;text-align: center;border-radius: 10rpx;">
															<u-icon color="#FFF" size="28rpx" name="error"></u-icon>
															再次点击确认
														</view>
														<view @tap="sendConfimed(item.id)" v-if="item.qrShow&&!sending" style="align-self: center;font-size: 22rpx;display: flex;padding: 0 10rpx 0 5rpx;margin:0 5rpx;font-weight: bold;line-height: 35rpx;background-color: #DB1F1F;color:#FFF;border: 5rpx #401010 solid;height: 35rpx;text-align: center;border-radius: 10rpx;">
															<u-icon color="#FFF" size="28rpx" name="error"></u-icon>
															再次点击确认
														</view>
														<view @tap="showQr(index)" v-if="!item.qrShow" style="align-self: center;font-size: 22rpx;display: flex;padding: 0 10rpx 0 5rpx;margin:0 5rpx;font-weight: bold;line-height: 35rpx;background-color: #03a54a;color:#FFF;border: 5rpx #333 solid;height: 35rpx;text-align: center;border-radius: 10rpx;">
															<u-icon color="#FFF" size="28rpx" name="checkmark"></u-icon>
															点击选择
														</view>
													</view>
												</view>
												
											</view>
										</view>
										<view v-if="item.qrShow" style="text-align: center;font-size: 25rpx;margin-bottom: 10rpx;color:#401010;">
											请确定粉丝群和管理员二维码是否准确
										</view>
										<view v-if="item.qrShow" style="display: flex;justify-content: space-between;">
											<image mode="widthFix" style="width: 280rpx;" :src="item.attributes.weChatGroupQR"></image>
											<image mode="widthFix" style="width: 280rpx;" :src="item.attributes.weChatGroupAdminQR"></image>
										</view>
									</view>
									
								</scroll-view>
							</view>
						</view>
					</u-popup>
					<view style="text-align: center;font-size: 25rpx;margin-bottom: 20rpx;color:#fe7048;">
						以下标记*的设定参数若要修改请联系超级管理员
					</view>	
					<view class="paramsLine">
						<view class="paramsTitle">
							年度活动生肖*
						</view>	
						<view class="param">
							{{eventSetting.zodiac}}
						</view>	
					</view>						
					<view class="paramsLine">
						<view class="paramsTitle">
							福利发放时间*
						</view>	
						<view class="param">
							{{eventSetting.giftMoment}}
						</view>	
					</view>	
					<view class="paramsLine">
						<view class="paramsTitle" style="font-size: 25rpx;">
							粉丝群要加入{{eventSetting.zodiac}}圈的最低活动报名人数*
						</view>	
						<view class="param">
							{{eventSetting.miniGroupCount}}
						</view>	
					</view>	
					<view class="paramsLine">
						<view class="paramsTitle" style="font-size: 25rpx;">
							每晚6点快照时群排名前几能加入{{eventSetting.zodiac}}圈*
						</view>	
						<view class="param">
							{{eventSetting.topNumJoincircle}}
						</view>	
					</view>	
					<view class="paramsLine">
						<view class="paramsTitle" style="font-size: 25rpx;">
							活动总使用数(记平均交互次数)
						</view>	
						<view class="param">
							{{eventSetting.totalClick}}
						</view>	
					</view>
					<view class="paramsLine">
						<view class="paramsTitle" style="font-size: 25rpx;">
							活动总参与数(记登录次数)
						</view>	
						<view class="param">
							{{eventSetting.totalUsed}}
						</view>	
					</view>
					<view class="paramsLine">
						<view class="paramsTitle" style="font-size: 25rpx;">
							活动总参与人数(用户数)
						</view>	
						<view class="param">
							{{eventSetting.totalUser}}
						</view>	
					</view>
					<view class="paramsLine">
						<view class="paramsTitle">
							已加入{{eventSetting.zodiac}}圈的群数量
						</view>	
						<view class="param">
							{{eventSetting.groupInCircleCount}}
						</view>	
					</view>	
					<view style="width: 630rpx;padding: 10rpx 0rpx;border-bottom: 2rpx dashed orange;font-weight: bold;">
						<view>
							当前开场动画*
						</view>	
						<view style="display: flex;flex-wrap:wrap;" v-if="refresh">
							<view v-for="(item,index) in eventSetting.post" :key="index">
								<view v-if="!item.videoShow" style="display: flex;" @tap="showVideo(index)">
									<view style="color: #FFF;position: absolute;z-index: 99;margin-top: 20rpx;margin-left: 160rpx;">
										<u-icon name="play-circle" color="rgb(255,255,255,0.7)" size="36rpx"></u-icon>
									</view>
									<image style="width: 200rpx;margin: 10rpx 5rpx;" mode="widthFix" :src="item.postImg"></image>
								</view>
								<view v-if="item.videoShow">
								<!-- <view> -->
									<video :autoplay="true" style="background-color: #fe7048;margin-top: 0rpx;width:630rpx;height:1112rpx;" :controls="false" :poster="item.postImg" :src="item.video" @ended="videoEnd(index)" id="video" object-fit="cover"></video>
								</view>
							</view>
						</view>
					</view>	
					<view style="width: 630rpx;padding: 10rpx 0rpx;border-bottom: 2rpx dashed orange;font-weight: bold;">
						<view>
							当前界面元素*
						</view>	
						<view style="display: flex;flex-wrap:wrap;">
							<view style="display: flex;" @tap="previewBgImg(eventSetting.topImg)">
								<view style="color: #FFF;position: absolute;z-index: 99;margin-top: 20rpx;margin-left: 160rpx;">
									<u-icon name="photo" color="rgb(255,255,255,0.7)" size="36rpx"></u-icon>
								</view>
								<image style="width: 200rpx;margin: 10rpx 5rpx;" mode="widthFix" :src="eventSetting.topImg"></image>
							</view>
							<view style="display: flex;" @tap="previewBgImg(eventSetting.bgImg)">
								<view style="color: #FFF;position: absolute;z-index: 99;margin-top: 20rpx;margin-left: 160rpx;">
									<u-icon name="photo" color="rgb(255,255,255,0.7)" size="36rpx"></u-icon>
								</view>
								<image style="width: 200rpx;margin: 10rpx 5rpx;" mode="widthFix" :src="eventSetting.bgImg"></image>
							</view>
							<view style="display: flex;" @tap="previewBgImg(eventSetting.bottomImg)">
								<view style="color: #FFF;position: absolute;z-index: 99;margin-top: 20rpx;margin-left: 160rpx;">
									<u-icon name="photo" color="rgb(255,255,255,0.7)" size="36rpx"></u-icon>
								</view>
								<image style="width: 200rpx;margin: 10rpx 5rpx;" mode="widthFix" :src="eventSetting.bottomImg"></image>
							</view>
						</view>
					</view>	
					<view style="width: 630rpx;padding: 10rpx 0rpx;border-bottom: 2rpx dashed orange;font-weight: bold;">
						<view>
							当前随机替换用群头像*
						</view>	
						<view style="display: flex;flex-wrap:wrap;" >
							<view v-for="(item,index) in eventSetting.groupAvator" :key="index">
								<view style="display: flex;" @tap="previewAvatorImg(item)">
									<view style="color: #FFF;position: absolute;z-index: 99;margin-top: 10rpx;margin-left: 47rpx;">
										<u-icon name="photo" color="rgb(255,255,255,0.7)" size="36rpx"></u-icon>
									</view>
									<image style="width: 80rpx;margin: 10rpx 5rpx;" mode="widthFix" :src="item"></image>
								</view>
							</view>
						</view>
					</view>	
					<view style="width: 630rpx;padding: 10rpx 0rpx;border-bottom: 2rpx dashed orange;font-weight: bold;">
						<view>
							演示群号查看方式的示例图片*
						</view>	
						<view style="display: flex;flex-wrap:wrap;" >
							<view style="display: flex;" @tap="previewImg(eventSetting.exampleImg)">
								<view style="color: #FFF;position: absolute;z-index: 99;margin-top: 10rpx;margin-left: 247rpx;">
									<u-icon name="photo" color="rgb(255,255,255,0.7)" size="36rpx"></u-icon>
								</view>
								<image style="width: 280rpx;margin: 10rpx 5rpx;" mode="widthFix" :src="eventSetting.exampleImg"></image>
							</view>
						</view>
					</view>	
				</view>
				<view v-if="current == 1" style="color:#DB1F1F;font-size: 28rpx;">
					<view style="width: 650rpx;">
						<view v-if="!ShowNewGroup" @tap="intialGroupName();ShowNewGroup = true" style="font-weight: bold;margin: 10rpx auto 20rpx;line-height: 70rpx;background-color: #fe7048;color:#FFF;border: 5rpx #401010 solid;width: 420rpx;height: 70rpx;text-align: center;border-radius: 20rpx;">
							点击添加新粉丝群
						</view>
						<view v-if="ShowNewGroup" style="background-color: #FFF;padding:0 10rpx 0 30rpx;border-radius: 20rpx;border: 3rpx dashed #FFA500;">
							
							<view style="margin-top: 10rpx;font-weight: bold;font-size: 30rpx;padding: 10rpx;justify-content: space-between;display: flex;">
								<view style="display: flex;">									
									<u-icon size="40rpx" name="plus-circle" color="#DB1F1F"></u-icon>
									 <view style="margin-left: 10rpx;">新建粉丝群</view>
								</view>
								<u-icon @tap="intialGroupName();ShowNewGroup = false;confimNew = false" size="40rpx" name="close-circle-fill" color="#DB1F1F"></u-icon>
							</view>	
							<u--form labelPosition="left" >
								<view style="margin-top:0rpx;">
									<u-form-item :required="true" labelWidth="80" label="群名称" borderBottom :borderBottom="true">
										<u--input type="string" placeholder="请输入群名称" v-model="currentGroupDetail.weChatGroupName" border="none" inputAlign="center" clearable></u--input>
										<u-icon slot="right" name="arrow-right" ></u-icon>
									</u-form-item>
								</view>
								</u--form>
								<view style="font-size: 27rpx;color:#333;margin-top: 20rpx;text-align: center;">
									下方点击选择进行更改
								</view>
								<view style="margin: 10rpx auto 0;display: flex;justify-content: space-between;width: 450rpx;">
									<view style="text-align: center;width: 150rpx;">
										<view style="margin-bottom: 5rpx;">*群二维码</view>
										<view @tap="uploadImg('weChatGroupQR')" style="display: flex;">
											<image v-if="currentGroupDetail.weChatGroupQR" :src="currentGroupDetail.weChatGroupQR" mode="widthFix" style="width: 150rpx;"></image>
											<image v-else src="https://XXXXXXXXXX.png"
											mode="widthFix" style="width: 150rpx"></image>
										</view>
										
									</view>
									<view style="text-align: center;width: 150rpx;">
										<view style="margin-bottom: 5rpx;">群头像</view>
										<view @tap="uploadImg('groupAvator')" style="display: flex;">
											<image v-if="currentGroupDetail.groupAvator" :src="currentGroupDetail.groupAvator" mode="widthFix" style="width: 150rpx;"></image>
											<image v-else src="https://XXXXXXXXXX.png"
										mode="widthFix" style="width: 150rpx"></image>
										</view>
									</view>
								</view>
								<view style="text-align: center;font-size: 25rpx;margin: 20rpx 0;color:#fe7048;">
									上方标记*为必填项，群头像可以入圈以后再添加
								</view>	
								<view style="display: flex;justify-content: space-between;padding-bottom: 20rpx;">
									<view @tap="intialGroupName();ShowNewGroup = false;confimNew = false" style="align-self: center;font-size: 22rpx;display: flex;padding: 0 10rpx;margin:0 5rpx;font-weight: bold;line-height: 35rpx;background-color: #5c6c7c;color:#FFF;border: 5rpx #401010 solid;height: 35rpx;text-align: center;border-radius: 20rpx;">
										<u-icon color="#FFF" size="28rpx" name="close"></u-icon>
										取消
									</view>
									<view v-if="confimNew" @tap="createNewGroup()" style="align-self: center;font-size: 22rpx;display: flex;padding: 0 10rpx 0 5rpx;margin:0 5rpx;font-weight: bold;line-height: 35rpx;background-color: #03a54a;color:#FFF;border: 5rpx #333 solid;height: 35rpx;text-align: center;border-radius: 10rpx;">
										<u-icon color="#FFF" size="28rpx" name="error"></u-icon>
										再次点击确定新增
									</view>
									<view v-else @tap="confimNew = true" style="align-self: center;font-size: 22rpx;display: flex;padding: 0 10rpx 0 5rpx;margin:0 5rpx;font-weight: bold;line-height: 35rpx;background-color: #DB1F1F;color:#FFF;border: 5rpx #333 solid;height: 35rpx;text-align: center;border-radius: 10rpx;">
										<u-icon color="#FFF" size="28rpx" name="checkmark"></u-icon>
										确定新增
									</view>	
								</view>	
							
						</view>
						<view style="width: 650rpx;margin: 0rpx auto 20rpx" v-if="refresh">
							<view v-for="(item,index) in groupList" :key="index"
								style="margin: 20rpx 10rpx;">
									<view style="display: flex;justify-content: space-between;">
										<view @tap="showListQr(index)">											
											<image mode="aspectFill" style="width: 100rpx;height: 100rpx;border-radius: 10rpx;" :src="item.attributes.groupAvator||eventSetting.groupAvator[Math.floor(Math.random()*eventSetting.groupAvator.length)]"></image>
										</view>
										<view style="align-self: center;">
											<view @tap="showListQr(index)" style="text-align: center;width: 500rpx;font-weight: bold;color: #401010;display: flex;">
												<view style="display: inline-block;padding: 0 5rpx;color: #ccc;font-weight: 300;">[{{item.id}}]</view>
													<u-tooltip direction="bottom" :text="item.attributes.weChatGroupName.length>17?item.attributes.weChatGroupName.substr(0,16)+'...':item.attributes.weChatGroupName" :buttons="['编号：'+item.id+'，群名称：'+item.attributes.weChatGroupName]" :showCopy="false" color="#401010" overlay></u-tooltip>
											</view>
											<view style="text-align: center;margin: 0 auto;width: 510rpx;color: #777;font-size:30rpx;justify-content: space-between;display: flex;">
												<view v-if="item.attributes.joinedCircle==true" style="font-size: 25rpx;">
													<uni-dateformat format="yy/MM/dd" :date="item.attributes.joinCircleDate" :threshold="[0,604800000]"></uni-dateformat>
													入圈
												</view>
												<view v-else>
													<view style="align-self: center;font-size: 22rpx;display: flex;padding: 0 10rpx;margin:0 5rpx;font-weight: bold;line-height: 35rpx;background-color: #DB1F1F;color:#FFF;border: 5rpx #401010 solid;height: 35rpx;text-align: center;border-radius: 20rpx;">
														未入圈
													</view>
												</view>
												<view @tap="showListQr(index)" style="display: flex">
													<u-icon size="36rpx" name="user"></u-icon>
													<view style="padding: 0 5rpx;">	
														<u-tooltip :text="item.attributes.rabbitConut" :buttons="['群内属'+eventSetting.zodiac+'的人数'+item.attributes.rabbitConut+'人']" :showCopy="false" color="#fe7048" overlay></u-tooltip>
													</view>
												</view>
												<view @tap="showListQr(index)" style="display: flex">
													<u-icon color="#5c6c7c" size="36rpx" name="account"></u-icon>
													<view style="padding: 0 5rpx;">
														<u-tooltip :text="item.attributes.userCount" :buttons="['群人数'+item.attributes.userCount+'人']" :showCopy="false" color="#5c6c7c" overlay></u-tooltip>
													</view>
												</view>
												<view style="font-size: 25rpx;">
													<view @tap="showEdit(index)" v-if="item.qrShow&&!sending" style="align-self: center;font-size: 22rpx;display: flex;padding: 0 10rpx 0 5rpx;margin:0 5rpx;font-weight: bold;line-height: 35rpx;background-color: #DB1F1F;color:#FFF;border: 5rpx #401010 solid;height: 35rpx;text-align: center;border-radius: 10rpx;">
														再次点修改
													</view>
													<view @tap="showListQr(index)" v-if="!item.qrShow" style="align-self: center;font-size: 22rpx;display: flex;padding: 0 10rpx 0 5rpx;margin:0 5rpx;font-weight: bold;line-height: 35rpx;background-color: #03a54a;color:#FFF;border: 5rpx #333 solid;height: 35rpx;text-align: center;border-radius: 10rpx;">
														点击看详情
													</view>
												</view>
											</view>
										</view>
									</view>
									<view v-if="item.qrShow" style="text-align: center;font-size: 25rpx;margin-bottom: 10rpx;color:#401010;">
										请确定粉丝群和管理员二维码是否准确
									</view>
									<view v-if="item.qrShow" style="display: flex;justify-content: space-between;background-color: #FFF;">
										<image mode="widthFix" style="width: 320rpx;" :src="item.attributes.weChatGroupQR"></image>
										<image mode="widthFix" style="width: 320rpx;" :src="item.attributes.weChatGroupAdminQR"></image>
									</view>
									<view v-if="item.showEdit" style="background-color: #FFF;padding:0 10rpx 0 30rpx;border-radius: 20rpx;border: 3rpx dashed #FFA500;">
										
										<view style="margin-top: 10rpx;font-weight: bold;font-size: 30rpx;padding: 10rpx;justify-content: space-between;display: flex;">
											<view style="display: flex;">									
												<u-icon size="40rpx" name="edit-pen" color="#DB1F1F"></u-icon>
												 <view style="margin-left: 10rpx;">更新粉丝群信息</view>
											</view>
											<u-icon @tap="closeEdit(index)" size="40rpx" name="close-circle-fill" color="#DB1F1F"></u-icon>
										</view>	
										<u--form labelPosition="left" >
											<view style="margin-top:0rpx;">
												<u-form-item :required="true" labelWidth="80" label="群名称" borderBottom :borderBottom="true">
													<u--input type="string" placeholder="请输入群名称" v-model="currentGroupDetail.weChatGroupName" border="none" inputAlign="center" clearable></u--input>
													<u-icon slot="right" name="arrow-right" ></u-icon>
												</u-form-item>
											</view>
											</u--form>
											<view style="font-size: 27rpx;color:#333;margin-top: 20rpx;text-align: center;">
												下方点击选择进行更改
											</view>
											<view style="margin: 10rpx auto 0;display: flex;justify-content: space-between;width: 450rpx;">
												<view style="text-align: center;width: 150rpx;">
													<view style="margin-bottom: 5rpx;">*群二维码</view>
													<view @tap="uploadImg('weChatGroupQR')" style="display: flex;">
														<image v-if="currentGroupDetail.weChatGroupQR" :src="currentGroupDetail.weChatGroupQR" mode="widthFix" style="width: 150rpx;"></image>
														<image v-else src="https://XXXXXXXXXX.png"
														mode="widthFix" style="width: 150rpx"></image>
													</view>
													
												</view>
												<view style="text-align: center;width: 150rpx;">
													<view style="margin-bottom: 5rpx;">群头像</view>
													<view @tap="uploadImg('groupAvator')" style="display: flex;">
														<image v-if="currentGroupDetail.groupAvator" :src="currentGroupDetail.groupAvator" mode="widthFix" style="width: 150rpx;"></image>
														<image v-else src="https://XXXXXXXXXX.png"
													mode="widthFix" style="width: 150rpx"></image>
													</view>
												</view>
											</view>
											<view style="text-align: center;font-size: 25rpx;margin: 20rpx 0;color:#fe7048;">
												上方标记*为必填项，群头像可以入圈以后再添加
											</view>	
											<view style="display: flex;justify-content: space-between;padding-bottom: 20rpx;">
												<view @tap="closeEdit(index)" style="align-self: center;font-size: 22rpx;display: flex;padding: 0 10rpx;margin:0 5rpx;font-weight: bold;line-height: 35rpx;background-color: #5c6c7c;color:#FFF;border: 5rpx #401010 solid;height: 35rpx;text-align: center;border-radius: 20rpx;">
													<u-icon color="#FFF" size="28rpx" name="close"></u-icon>
													取消
												</view>
												<view v-if="item.confim" @tap="editGroup(item.id)" style="align-self: center;font-size: 22rpx;display: flex;padding: 0 10rpx 0 5rpx;margin:0 5rpx;font-weight: bold;line-height: 35rpx;background-color: #03a54a;color:#FFF;border: 5rpx #333 solid;height: 35rpx;text-align: center;border-radius: 10rpx;">
													<u-icon color="#FFF" size="28rpx" name="error"></u-icon>
													再次点击确定修改
												</view>
												<view v-else @tap="clickConfim(index)" style="align-self: center;font-size: 22rpx;display: flex;padding: 0 10rpx 0 5rpx;margin:0 5rpx;font-weight: bold;line-height: 35rpx;background-color: #DB1F1F;color:#FFF;border: 5rpx #333 solid;height: 35rpx;text-align: center;border-radius: 10rpx;">
													<u-icon color="#FFF" size="28rpx" name="checkmark"></u-icon>
													确定修改
												</view>	
											</view>	
										
									</view>
								</view>
								<view v-if="endding" style="text-align: center;font-size: 25rpx;margin-bottom: 10rpx;color:#401010;">没有了</view>
								
							</view>						
					</view>
					
					
				</view>
			</view>
		</view>
		<view style="color: gold;font-size: 25rpx;padding: 10rpx 0 30rpx;text-align: center;">
			Copyright © 2020
			<view style="display: inline-block;" v-if="new Date().getFullYear() > 2021">
				-{{new Date().getFullYear()+' '}}德阳市民通  
				<view style="display: inline-block;">
					<u-icon color="gold" top="1" size="28rpx" name="close"></u-icon>
				</view> 造件师
			</view>
			<view style="display: inline-block;"  v-else>
				{{' '}}德阳市民通<view style="display: inline-block;">
					<u-icon color="gold" top="1" size="28rpx" name="close"></u-icon>
				</view>造件师
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad() {
			if (!uni.getStorageSync('jwt')) {
				uni.navigateTo({
					url:"/pages/signin/signin"
				})
			}
			if(this.current == 1){
				this.getZlgGroup()
			}
			this.scrollHeight = uni.getSystemInfoSync().windowHeight/(uni.getSystemInfoSync().screenWidth/750)-320
			this.getZlgInfo()
		},
		onPullDownRefresh() {
			setTimeout(()=>{//0.5秒延迟
				this.getZlgInfo(()=>{//在下拉刷新时使用此回调函数
					uni.stopPullDownRefresh()//关闭下拉刷新
					this.endding = false
					this.groupList = []
					this.pageindex = 1
					this.getZlgGroup()
					this.getZlgInfo()
				})
			},500)
		},
		onReachBottom() {
			if(this.groupList.length < this.pageindex*this.pagesize) {
				this.endding = true
			}else{
				this.pageindex++
				this.getZlgGroup()
			}
		},
		data() {
			return {
				pageindex:1,
				pagesize:10,
				endding:false,
				sending:false,
				refresh:true,
				confimNew:false,
				superAdmin:false,
				showGroup:false,
				scrollHeight:0,
				scrollTop:0,
				maxGroupCount:0,
				ShowNewGroup:false,
				userInfo:uni.getStorageSync('user'),
				listKey: [
					 {name: '系统级设定',rule:'basic'}, 
					 {name: '粉丝群列表',rule:'groups'}
				],
				current:1,
				groups:[],
				eventSetting: {
					giftMoment:"",
					groupAvator:[],
					currentGroup:{
						data:{
							attributes:{
								groupAvator:"",
								joinCircleDate:"",
								joinedCircle:"",
								rabbitConut:"",
								rank:"",
								userCount:"",
								weChatGroupAdminQR:"",
								weChatGroupName:"",
								weChatGroupQR:""
							}
						}
					}
				},
				groupDetailModel:{
					weChatGroupName:"",
					weChatGroupQR:"",
					weChatGroupAdminQR:"",
					groupAvator:""
				},
				currentGroupDetail:{
					weChatGroupName:"",
					weChatGroupQR:"",
					groupAvator:""
				},
				groupList:[],
			};
		},
		methods:{
			
			async editGroup(id){
				if(!this.currentGroupDetail.weChatGroupName||!this.currentGroupDetail.weChatGroupQR){
					uni.showToast({
						title:'有必填项未填写'
					})
				}
				else{
					this.sending = true
					const res = await this.$comRequest({
						Method:'POST',
						url:'zhaolaogen/editGroup/'+id,
						header:{
							'accept':'application/json',
							'Authorization': 'Bearer '+uni.getStorageSync('jwt')
						},
						data:this.currentGroupDetail
					})
					console.log(res)
					if(res.data.succeed){
						this.sending = false
						uni.showToast({
							title:"群修改成功",
							duration:1000
						})
						this.intialGroupName()
						this.groupList = []
						this.getZlgGroup()
						setTimeout(()=>{//2秒延迟
							this.showGroup = false
						},1000)
					}
					else{
						this.sending = false
						uni.showToast({
							title:"修改失败",
							duration:1000
						})
						this.intialGroupName()
						this.groupList = []
						this.getZlgGroup()
						setTimeout(()=>{//2秒延迟
							this.showGroup = false
						},1000)
					}
				}
			},
			closeEdit(index){
				this.intialGroupName()
				this.groupList = []
				this.getZlgGroup()
				this.refresh = false
				this.refresh = true
			},
			clickConfim(index){
				this.groupList[index].confim = true
				this.refresh = false
				this.refresh = true
			},
			showEdit(iindex){
				this.groupList[iindex].showEdit = true
				this.groupList[iindex].qrShow = false
				this.groupList[iindex].confim = false
				this.groupList.forEach((item,index) =>{
					if(iindex!==index){
						this.groupList[index].qrShow = false
						this.groupList[index].showEdit = false
						this.groupList[index].confim = false
					}
				})
				this.ShowNewGroup = false
				this.confimNew = false
				this.currentGroupDetail = this.groupList[iindex].attributes
				console.log('currentGroupDetail::',this.currentGroupDetail)
				this.refresh = false
				this.refresh = true
			},
			async createNewGroup(){
				if(!this.currentGroupDetail.weChatGroupName||!this.currentGroupDetail.weChatGroupQR){
					uni.showToast({
						title:'有必填项未填写'
					})
				}
				else{
					this.sending = true
					const res = await this.$comRequest({
						Method:'POST',
						url:'zhaolaogen/start',
						header:{
							'accept':'application/json',
							'Authorization': 'Bearer '+uni.getStorageSync('jwt')
						},
						data:this.currentGroupDetail
					})
					console.log(res)
					if(res.data.succeed){
						this.sending = false
						uni.showToast({
							title:"群新建成功",
							duration:1000
						})
						this.intialGroupName()
						this.ShowNewGroup = false
						this.confimNew = false
						this.groupList = []
						this.getZlgGroup()
						setTimeout(()=>{//2秒延迟
							this.showGroup = false
						},1000)
					}
					else{
						this.sending = false
						uni.showToast({
							title:"新建失败",
							duration:1000
						})
						this.intialGroupName()
						this.ShowNewGroup = false
						this.confimNew = false
						this.groupList = []
						this.getZlgGroup()
						setTimeout(()=>{//2秒延迟
							this.showGroup = false
						},1000)
					}
				}
			},
			async uploadImg(path){
				let _this = this
				uni.chooseImage({
					count: 1, 
					sizeType: ['original', 'compressed'], 
					sourceType: ['album'], //从相册选择
					success: async function (res) {
						const imgUpload = await uniCloud.uploadFile({
							filePath: res.tempFilePaths[0],
							cloudPath: new Date().getTime().toString()+'.jpg',
							onUploadProgress: function(progressEvent) {
									console.log(progressEvent);
									var percentCompleted = Math.round(
										(progressEvent.loaded * 100) / progressEvent.total
									);
								}
							});
						console.log('成功上传',_this.currentGroupDetail,imgUpload.fileID)
						_this.currentGroupDetail[path] = imgUpload.fileID
					}
				});
			},
			intialGroupName(){
				this.currentGroupDetail.weChatGroupName = "市民通粉丝"+(this.maxGroupCount+2)+"群"
				this.currentGroupDetail.weChatGroupQR = ""
				this.currentGroupDetail.groupAvator = ""
			},
			async sendConfimed(gid){
				console.log("gid::",gid)
				this.sending = true
				const res = await this.$comRequest({
					Method:'POST',
					url:'zhaolaogen/setCurrentGroup/'+gid,
					header:{
						'accept':'application/json',
						'Authorization': 'Bearer '+uni.getStorageSync('jwt')
					},
				})
				console.log(res)
				if(res.data.succeed){
					this.sending = false
					uni.showToast({
						title:"设置成功",
						duration:1000
					})
					this.getZlgInfo()
					setTimeout(()=>{//2秒延迟
						this.showGroup = false
					},1000)
				}
				else{
					this.sending = false
					uni.showToast({
						title:"设置失败",
						duration:1000
					})
					this.getZlgInfo()
					setTimeout(()=>{//2秒延迟
						this.showGroup = false
					},1000)
				}
			},
			closeGroup(){
				this.showGroup = false
			},
			previewAvatorImg(current){
				uni.previewImage({
					current:current,
					urls: this.eventSetting.groupAvator,
					indicator: "default"
				})
			},
			previewImg(current){
				uni.previewImage({
					urls: [current],
					indicator: "default"
				})
			},
			previewBgImg(current) {
				uni.previewImage({
					current:current,
					urls: [this.eventSetting.topImg,this.eventSetting.bgImg,this.eventSetting.bottomImg],
					indicator: "default"
				})
			},
			videoEnd(index){
				this.eventSetting.post[index].videoShow = false
				this.refresh = false
				this.refresh = true
			},
			showVideo(iindex){
				this.eventSetting.post[iindex].videoShow = true
				this.eventSetting.post.forEach((item,index)=>{
					if(index!==iindex){
						this.eventSetting.post[index].videoShow = false
					}
				})
				this.refresh = false
				this.refresh = true
			},
			showListQr(iindex){
				if(this.groupList[iindex].qrShow == true){
					this.groupList[iindex].qrShow = false
					this.refresh = false
					this.refresh = true
				}
				else{
					this.groupList[iindex].qrShow = true
					this.groupList.forEach((item,index)=>{
						if(index!==iindex){
							this.groupList[index].qrShow = false
						}
					})
					this.refresh = false
					this.refresh = true
				}
			},
			showQr(iindex){
				if(this.groups[iindex].qrShow == true){
					this.groups[iindex].qrShow = false
					this.refresh = false
					this.refresh = true
				}
				else{
					this.groups[iindex].qrShow = true
					this.groups.forEach((item,index)=>{
						if(index!==iindex){
							this.groups[index].qrShow = false
						}
					})
					this.refresh = false
					this.refresh = true
				}
			},
			subsectionChange(index){
				console.log(this.listKey[index])
				this.current = index;
				if(index == 1){
					this.groupList = []
					this.pageindex = 1
					this.getZlgGroup()
				}
			},
			logOut(){
				uni.clearStorageSync()
				uni.navigateTo({
					url:"/pages/signin/signin"
				})
			},
			async getZlgInfo(callback){
				let query = `
					query{
					me{
					    id
					    role{
					      id
					      description
					    }
					  }
					zhaolaogensetting{
						data{
						  attributes{
							zodiac
							adminQR
							totalUser
							totalUsed
							totalClick
							topImg
							bgImg
							bottomImg
							post
							topNumJoincircle
							miniGroupCount
							giftMoment
							groupInCircleCount
							exampleImg
							groupAvator
							currentGroup{
								data{
								  id
								  attributes{
								    joinedCircle
								    groupAvator
								    rank
								    rabbitConut
								    userCount
								    weChatGroupQR
								    weChatGroupName
								    weChatGroupAdminQR
								    joinCircleDate
								    
								  }
								}
							}
						  }
						}
					  }
					  zhaolaogens(sort:["id:desc"],filters:{joinedCircle:{eq:false},and:{userCount:{lte:99}}}){
					    data{
					      id
					      attributes{
					        joinedCircle
					        groupAvator
					        rank
					        rabbitConut
					        userCount
					        weChatGroupQR
					        weChatGroupName
					        weChatGroupAdminQR
					        joinCircleDate
					        zhaolaogen_users{
					          data{
					            id
					            attributes{
					              uid
					              nickname
					              img
					              zodiac
					              birthplace
					              salutation
					              dealer
					              createdAt
					              updatedAt
					            }
					          }
					        }
					      }
					    }
					    meta{
					      pagination{
					        total
					      }
					    }
					  }
					}
				`
				const res = await this.$graphqlRequest({
					url:'gql',
					query: query,
					method:'POST',
					header:{
						'accept':'application/json',
						'Authorization': 'Bearer '+uni.getStorageSync('jwt')
					},
				})		
				console.log('res',res)
				this.eventSetting = res.data.data.zhaolaogensetting.data.attributes				
				console.log('groups',this.groups)
				this.eventSetting.post.forEach((item,index)=>{
					this.eventSetting.post[index].videoShow = false
				})
				this.groups.forEach((item,index)=>{
					this.groups[index].qrShow = false
				})
				console.log('eventSetting',this.eventSetting)
				if(res.data.data.me.role.id == "3"){
					this.superAdmin = true
					console.log('superAdmin',this.superAdmin)
				}
				if(res.data.data.me.role.id !== "3" && res.data.data.me.role.id !== "4"){
					uni.showToast({
						title:'非本活动管理员',
						duration:1000
					})
					uni.clearStorageSync()
					uni.navigateTo({
						url:"/pages/signin/signin"
					})
				}
				callback && callback()		
			},
			async getZlgGroup(callback){
				let statusFilters = ''
				if(this.current == 1){
					statusFilters = `,sort:["id:desc"],filters:{userCount:{lte:99}}`
				}
				let query = `
					query{
					  zhaolaogens(pagination:{page: `+this.pageindex+`, pageSize: `+this.pagesize+`}`+statusFilters+`){
					    data{
					      id
					      attributes{
					        joinedCircle
					        groupAvator
					        rank
					        rabbitConut
					        userCount
					        weChatGroupQR
					        weChatGroupName
					        weChatGroupAdminQR
					        joinCircleDate
					      }
					    }
					    meta{
					      pagination{
					        total
					      }
					    }
					  }
					}
				`
				const res = await this.$graphqlRequest({
					url:'gql',
					query: query,
					method:'POST',
					header:{
						'accept':'application/json',
						'Authorization': 'Bearer '+uni.getStorageSync('jwt')
					},
				})		
				this.groupList = [...this.groupList,...res.data.data.zhaolaogens.data]
				this.groupList.forEach((item,index)=>{
					this.groupList[index].qrShow = false
					this.groupList[index].showEdit = false
					this.groupList[index].clickConfim = false
				})
				if(this.current == 1){
					this.maxGroupCount = res.data.data.zhaolaogens.data.length
				}
				callback && callback()		
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #F4573B;
}
	.subsection{
		padding: 10rpx 100rpx 10rpx;
		transition: padding 0.5s;
		background-color: rgba(254,239,224,0.95);
	}
	.scrollTopChange{
		padding: 160rpx 100rpx 10rpx;
		transition: padding 0.5s;
	}
	.paramsLine{display: flex;justify-content: space-between;width: 630rpx;padding: 10rpx 0rpx;border-bottom: 2rpx dashed orange;}
	.paramsTitle{font-weight: bold;text-align: center;}
	.param{text-align: center;}
</style>
