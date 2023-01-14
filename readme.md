# Zhaolaogen - A weChat Community Operation Management Application

> build on uniapp+koa2+graphql

<img src="https://mp-d84f1f76-0293-41b6-a6a1-499dd4e5fc0c.cdn.bspapp.com/cloudstorage/e4789e7b-d843-4a0d-9369-3bd9d39e2dd1.jpg" alt="实际应用" width="250"/>

> [Open source address](http://github.com/akirasen/zhaolaogen)  

> Ask for help: WeChat official account “造件师”

> Design idea: during the Spring Festival, various well-known platforms are giving benefits to users, developing a group of users' WeChat groups, and laying a foundation for the number of users for our future community operation, for this reason, we have prepared a batch of gifts that are convenient to collect online. When users join the WeChat group, the administrator will issue red envelopes regularly, and the users with the best luck can get additional gifts.
> 
> 而微信群能够扫码加入的人数有限，一个群加满以后需要动态更换新的空群二维码，而且扫码加群的人数到达上线后，需要有机制鼓励群成员邀请其它朋友入群。此应用便是为此而生。

> 应用设计了10秒随机载入动画，烘托春节氛围，之后用简单的文字描述了福利内容，展示群二维码供用户加群。至此，建群目的达到。 加群后，还有更丰富的玩法，例如，通过管理员引导，用户回到应用页面确认自己加入的群号，系统自动根据用户生肖计算每个群中的属兔的用户数量，定时快照并排名，每日指定时间排名前列的群可以加入“兔圈”，获得额外的丰厚礼品，还可以投票修改群名、修改榜单中的群头像、以此让加入同一群的用户“共同做某事”，促进社群凝聚力和活跃度，力争在活动结束后也能成为八卦群、爆料群、互助群...

> 在此也特别感谢Strapi社区的[Richard Nsama](https://github.com/kasonde)，在我学习Koa的过程中提供很大帮助。

## 平台兼容

| H5野生浏览器 | 微信小程序 | 微信浏览器 | 德阳市民通App |
| ---------- | --------- | -------- | ----------- |
|     √      |     √     |     √    |      √      |

## 安装前准备

### 1、设计素材和运行参数准备

以下参数都可以动态设置，同时需要提前准备载入动画、页面顶部图、底部图元素和中部可以Y轴复制的背景图片、随机群头像等界面资源

<img src="https://mp-d84f1f76-0293-41b6-a6a1-499dd4e5fc0c.cdn.bspapp.com/cloudstorage/b136e509-eee3-4fac-9fd0-f02c005023b9.jpg" alt="参数" width="250"/>

通用分享海报（最上面那张）和动态生成海报的底图

<img src="https://mp-d84f1f76-0293-41b6-a6a1-499dd4e5fc0c.cdn.bspapp.com/cloudstorage/3a005910-7ad2-4ca7-a01c-51ada5fd8a5f.jpg" alt="底图" width="250"/>

### 2、平台OAuth2.0秘钥

城市门户平台，例如德阳市民通的OAuth2.0秘钥、业务域名，计算用户生肖、出生地、称呼、发送短信需要用户的身份信息和联系方式，需要平台提供前述能力，根据实际接口情况进行二次开发。

```
let client_id = `XXXXXXXXXXXXXXXXXXXXXX`//配置client_id 
let client_secret = `XXXXXXXXXXXXXXXXXXXXXX`//配置client_secret
let redirect_uri = `https://yourdomain.com`//配置redirect_uri
```

### 3、数据加密用密钥对

两对16位随机秘钥，用于数据的AES加密，替换下面的`XXXXXX`，例如`L7URlOJxXXNobOYE`的形式，其中后端用加密秘钥用于在数据库中加密存储用户手机号等敏感数据，前端秘钥用于低敏感度的昵称、头像加密，在前端解密，实现密钥和数据库分离。

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

### 5、阿里云短信接口密钥
提前在阿里云申请好短信接口，模板如：`您好管理员，您管理的${name}已满员，请及时维护！`

```
//阿里云短信接口密钥
const aliAccessKeyId = 'XXXXXXXXXXXXXXXXXXXXXX'
const aliAccessKeySecret = 'XXXXXXXXXXXXXXXXXXXXXX'
const aliTemplateCode = 'SMS_XXXXXXXX'
```

### 6、运行环境需求

提前建好空的mysql，配置时填写账号密码等，需要提前准备好：
- Ubuntu 20.04 LTS (GNU/Linux)
- Node.js v18
- yarn
- MySQL	5.7+

## 部署和二次开发指南

### 在服务器端操作

1.终端操作，`your-project-name`改为你准备新建的目录名

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
5.此时，一个strapi应用开发环境将自动编译部署，并运行在1337端口上，若希望其运行在其他端口，可在应用根目录.env文件中修改PORT参数，以及在config/server.js修改port参数；

6.暂时Ctrl+C退出环境，安装依赖，在根目录分别执行：
```
npm i axios --save
npm i moment --save
npm i crypto-js --save
npm i koa2-ratelimit --save
yarn strapi install graphql
```
7.创建config/cron-tasks.js文件：
```
const axios = require('axios');
const moment = require("moment");
const CryptoJS = require('crypto-js'); 

module.exports = {
   '0 0 18 * * *': async ({ strapi }) => {
        console.log("每天18:00进行群排名::",await strapi.service('api::zhaolaogenuser.zhaolaogenuser').checkGroupRank())
    },
    '0 0 * * * *': async ({ strapi }) => {
        console.log("每小时刷新一次AccessToken::", await strapi.service('api::zhaolaogenuser.zhaolaogenuser').getAccessToken())
   },
   '0 10,30,50 * * * *': async ({ strapi }) => {
        console.log("每20分钟刷新一次群排名::",await strapi.service('api::zhaolaogenuser.zhaolaogenuser').refreshGroupRank())
   }
}
```

8.config/server.js还需要进行以下设定，添加cron服务及绑定域名：

```
const cronTasks = require("./cron-tasks");
module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', 'https://yourdomain.com'),
  app: {
    keys: env.array('APP_KEYS'),
  },
  cron: {
    enabled: true,
    tasks: cronTasks,
  },
});

```
9.将此开源项目的/api目录复制到你的服务器，与应用的src/api目录合并

10.修改src/api/zhaolaogenuser/services/zhaolaogenuser.js文件中的参数：

```
let client_id = `XXXXXXXXXX`//配置client_id 
let client_secret = `XXXXXXXXXX`//配置client_secret
let redirect_uri = `https://XXXXXXXXXX.XXXXXXXXXX.cn`//配置redirect_uri
//传入的用于敏感数据加密的秘钥
let vkey = CryptoJS.enc.Utf8.parse('XXXXXXXXXX')
//传入的用于敏感数据加密的秘钥偏移量
let viv = CryptoJS.enc.Utf8.parse('XXXXXXXXXX')
//传入的用于非敏感数据加密的秘钥
let xkey = CryptoJS.enc.Utf8.parse('XXXXXXXXXX')
//传入的用于非敏感数据加密的秘钥偏移量
let xiv = CryptoJS.enc.Utf8.parse('XXXXXXXXXX')
//公众号key
const wxappid = "XXXXXXXXXX"
const wxsecret = "XXXXXXXXXX"
//阿里云短信接口密钥
const aliAccessKeyId = 'XXXXXXXXXX'
const aliAccessKeySecret = 'XXXXXXXXXX'
const aliTemplateCode = 'XXXXXXXXXX'
```

11.后端参数配置完成，重新bulid，然后启动开发环境：

```
yarn build
yarn develop
```

12.要使用域名访问API，还需要完成以下工作

- 修改nginx配置文件，使用反向代理监听应用程序端口；

- 若要在微信小程序中正常使用，需要使用SSL，并进行绑定业务域名等一系列配置

13.登录strapi管理面板，进行参数设定

- 通过https://yourdomain.com/admin 可以登录

- 初次登录，需要注册管理面板账号

- 登录后，在content-manager中，选中zhaolaogensetting，设置应用运行参数。

14.配置API访问权限
在`settings/users-permissions/roles`中，选择Public配置公共API访问权限，在`Permissions`列表中，选择`zhaolaogenuser`，勾选以下API并保存：
```
chooseGroup
getGroupName 
getTicket 
getZlgInfo 
userInfoStore 
warningAdmin
```

选择`users-permissions`，勾选`callback`并保存，其它所有未提到的API均取消勾选，保存。

在`content-manager`中，选中`user`，点击`Edit the model`按钮，点击`Add another field`按钮，创建名为`name`的`Text`类型字段，再创建名为`LastWarningTime`的`datetime`类型`Date`字段，名为`phone`的`Text`类型字段，以及名为`qrcode`的`Text`类型字段，保存。

在`settings/users-permissions/roles`中，点击`Add new role`按钮，新建名为`zlgOper`的角色，在`Permissions`列表中，选择`zhaolaogenuser`，勾选除`delete`以外的所有API并保存，选择`users-permissions`，勾选`me`并保存，其它所有未提到的API均取消勾选，保存。

在`content-manager`中，选中`user`，点击`Create an entry`按钮，填入管理员登录信息。其中`confirmed`选择`true`，`role`选择为`zlgOper`，qrcode填写管理员的微信二维码链接地址。

15.公共API列表
配置成功后，用户可以在未登录授权的情况下可以POST正常使用以下API，使用koa2-ratelimit设置了每分钟5次的访问限制，提高恶意攻击的成本：
```
/api/zhaolaogen/info
/api/zhaolaogen/warning/:id
/api/zhaolaogen/ticket
/api/zhaolaogen/start
/api/zhaolaogen/editGroup/:id
/api/zhaolaogen/setCurrentGroup/:id
/api/zhaolaogen/groupName/:id
/api/zhaolaogen/chooseGroup/:code
/api/zhaolaogen/user/:code
/api/auth/local
```

16.授权访问API列表
管理员登录后，可以通过jwt授权使用以下接口：
```
/api/zhaolaogen/start
/api/zhaolaogen/editGroup/:id
/api/zhaolaogen/setCurrentGroup/:id
/graphql
```
### 在HBuilder X或其它IDE中操作

1.将代码同步到本地

```
git clone https://github.com/akirasen/zhaolaogen.git
```

2.在终端中项目根目录安装依赖

```
npm i
```

3.在`util/api.js`中配置
```
//API域名
const BASE_URL = 'https://yourdomain.com'
//传入的用于非敏感数据加密的秘钥，与后端配置一致
let xkey = CryptoJS.enc.Utf8.parse('XXXXXXXXXX')
//传入的非敏感数据加密的秘钥偏移量，与后端配置一致
let xiv = CryptoJS.enc.Utf8.parse('XXXXXXXXXX')
```
4.在`pages/index/index.vue`中配置

```
bgImg:{//页面元素
   bgImg: "",//可复制中部背景
   topImg: "",//顶部
   bottomImg: "",//底部
},
post:[//载入进度，可以填多个就是随机显示
  {
   postImg: "",//封面
   video: "",//视频地址
   duration:12//视频长度（秒）用于倒计时
  },
],
```
这里也提供了一个开发模式，可以将developMode设为true，在内置浏览器打开时，就会加载userinfo1、eventSetting2中的数据（需要自己配置），而不会从接口调用。

