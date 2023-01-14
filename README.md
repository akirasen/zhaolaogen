# 找老根-微信社群运营管理工具

> 使用uniapp+koa2+graphql打造的微信社群运营管理工具
![image](https://mp-d84f1f76-0293-41b6-a6a1-499dd4e5fc0c.cdn.bspapp.com/cloudstorage/e4789e7b-d843-4a0d-9369-3bd9d39e2dd1.jpg)
> [开源地址](http://github.com/akirasen/zhaolaogen)  
> 寻求帮助：微信公众号“造件师”
> 设计思路：利用春节各大平台都在送福利让用户薅羊毛的热度，沉淀一批用户微信群，为之后的社群运营工作奠定流量基础，
> 为此，准备了一批方便线上领取的礼品，让用户加入微信群，管理员定时发红包，手气最佳获得额外礼品。
> 而微信群能够扫码加入的人数有限，一个群加满以后需要动态更换新的空群二维码，而且扫码加群的人数到达上线后，
> 需要有机制鼓励群成员邀请其它朋友入群。此应用便是为此而生。
> 应用设计了10秒随机载入动画，烘托春节氛围，之后用简单的文字描述了福利内容，展示群二维码供用户加群。至此，建群目的达到。
> 加群后，还有更丰富的玩法，例如，通过管理员引导，用户回到应用页面确认自己加入的群号，系统自动根据用户生肖计算每个群中的
> 属兔的用户数量，定时快照并排名，每日指定时间排名前列的群可以加入“兔圈”，获得额外的丰厚礼品，还可以投票修改群名、
> 修改榜单中的群头像、以此让加入同一群的用户“共同做某事”，促进社群凝聚力和活跃度，力争在活动结束后也能成为八卦群、爆料群、互助群...
> 在此也特别感谢Strapi社区的[Richard Nsama](https://github.com/kasonde)，在我学习Koa的过程中提供很大帮助。

## 平台兼容

| H5野生浏览器 | 微信小程序 | 微信浏览器 | 德阳市民通App |
| ---------- | --------- | -------- | ----------- |
|     √      |     √     |     √    |      √      |

## 安装前准备
### 1、设计素材和运行参数准备
- 以下参数都可以动态设置，同时需要提前准备载入动画、页面顶部图、底部图元素和中部可以Y轴复制的背景图片、随机群头像等界面资源
![image](https://mp-d84f1f76-0293-41b6-a6a1-499dd4e5fc0c.cdn.bspapp.com/cloudstorage/b136e509-eee3-4fac-9fd0-f02c005023b9.jpg)
- 通用分享海报和动态生成海报的底图
![image](https://mp-d84f1f76-0293-41b6-a6a1-499dd4e5fc0c.cdn.bspapp.com/cloudstorage/3a005910-7ad2-4ca7-a01c-51ada5fd8a5f.jpg)
### 2、平台OAuth2.0秘钥
城市门户平台，例如德阳市民通的OAuth2.0秘钥、业务域名，计算用户生肖、出生地、称呼、发送短信需要用户的身份信息和联系方式，需要平台提供前述能力，根据实际接口情况进行二次开发。
```
let client_id = `XXXXXXXXXXXXXXXXXXXXXX`//配置client_id 
let client_secret = `XXXXXXXXXXXXXXXXXXXXXX`//配置client_secret
let redirect_uri = `https://yourdomain.com`//配置redirect_uri
```
### 3、数据加密用密钥对
四组16位随机秘钥，用于数据的AES加密，替换下面的`XXXXXX`，例如`L7URlOJxXXNobOYE`的形式，其中后端用加密秘钥用于在数据库中加密存储用户手机号等敏感数据，前端秘钥用于低敏感度的昵称、头像加密，在前端解密，实现密钥和数据库分离。
```
//后端用加密秘钥 
let vkey = CryptoJS.enc.Utf8.parse('XXXXXXXXXXXXXXXXXXXXXX')
//后端用加密的秘钥偏移量
let viv = CryptoJS.enc.Utf8.parse('XXXXXXXXXXXXXXXXXXXXXX')
//前端用加密的秘钥
let xkey = CryptoJS.enc.Utf8.parse('XXXXXXXXXXXXXXXXXXXXXX')
//前端用加密的秘钥偏移量
let xiv = CryptoJS.enc.Utf8.parse('XXXXXXXXXXXXXXXXXXXXXX')
```
### 4、微信公众号密钥对
微信网页中调用JSSDK唤起小程序、分享能力用的公众号秘钥对，需要已认证的国内公众号生成。
```
// 公众号key
const wxappid = "XXXXXXXXXXXXXXXXXXXXXX"//
const wxsecret = "XXXXXXXXXXXXXXXXXXXXXX"//
```
### 5、运行环境需求
提前建好空的mysql，配置时填写账号密码等，需要提前准备好：
- Ubuntu 20.04 LTS (GNU/Linux)
- Node.js v18
- yarn
- MySQL	5.7+

## 后端安装
### 在服务器终端中操作
1.`your-project-name`改为你准备新建的目录名
```
yarn create strapi-app your-project-name
```
2.选择`Custom`模式安装，Quickstart会默认使用SQLite数据库

```
Custom (manual settings), which allows to choose your preferred database
```
3.在列表中选择MySQL数据库，并填写数据库信息
4.在项目根目录运行strapi开发环境
```
yarn develop
```


1.In a terminal, run the following command:
```
yarn create strapi-app your-project-name
```
2.Choose `Custom` installation type, which allows to choose your preferred database
```
Custom (manual settings), which allows to choose your preferred database
```
3.Among the list of databases, choose a database for your Project.Name your project's database.
4.run the following command in the project folder
```
yarn develop
```


## 二次开发介绍
