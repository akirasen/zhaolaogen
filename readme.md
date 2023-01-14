# Zhaolaogen - A weChat Community Operation Management Application

> build on uniapp+koa2+graphql

<img src="https://mp-d84f1f76-0293-41b6-a6a1-499dd4e5fc0c.cdn.bspapp.com/cloudstorage/e4789e7b-d843-4a0d-9369-3bd9d39e2dd1.jpg" alt="实际应用" width="250"/>

> [Open source address](http://github.com/akirasen/zhaolaogen)  

> Ask for help: WeChat official account “造件师”

> Design idea: during the Spring Festival, various well-known platforms are giving benefits to users, developing a group of users' WeChat groups, and laying a foundation for the number of users for our future community operation, for this reason, we have prepared a batch of gifts that are convenient to collect online. When users join the WeChat group, the administrator will issue red envelopes regularly, and the users with the best luck can get additional gifts.

> However, the number of people who can join the WeChat group by scanning the QR code is limited. When a group is full, a new QR code needs to be dynamically changed. After the number of people who can scan the QR code to join the group reaches the upper limit, a mechanism is needed to encourage group members to invite their friends to join the group. This application is designed to implement this mechanism.

> The application designed a 10-second random loading animation to set off the atmosphere of the Spring Festival. After that, the welfare content was described in simple words, and the WeChat group QR code was displayed for users to scan and add groups. So far, the purpose of this application to build more WeChat groups has been achieved.

> After joining the group, there are more rich ways to play. For example, under the guidance of the administrator, users return to the application page to confirm their group number. The system automatically calculates the number of users whose zodiac signs are rabbits in each group according to the user's zodiac signs, and regularly snaps and ranks them. The groups that rank the top at the specified time each day can join the "rabbit circle" to get extra rich gifts.

> Users who join the group can also vote to modify the group name, modify the group avatar in the ranking list, so that users who join the same group can "do something together", promote the cohesion and activity of the community, and strive to become gossip groups, explosive groups, mutual aid groups after the event is over...

> I would also like to thank [Richard Nsama](https://github.com/kasonde) of the Strapi community for his great help in my study of KOA.

## Platform compatibility

| H5 WildBrowser | WeChat miniProgram | WeChatbrowser | Deyang Citizenid App |
| -------------- | ------------------ | ------------- | -------------------- |
|        √       |          √         |        √      |          √           |

## Preparation before installation

### 1. Preparation of design materials and operation parameters

The following parameters can be set dynamically. At the same time, it is necessary to prepare and load the animation, the top and bottom image elements of the page, the background image that can be copied on the Y axis in the middle, the random group head image and other interface resources in advance

<img src="https://mp-d84f1f76-0293-41b6-a6a1-499dd4e5fc0c.cdn.bspapp.com/cloudstorage/b136e509-eee3-4fac-9fd0-f02c005023b9.jpg" alt="parameters" width="250"/>

Common shared poster (the top one) and background image of dynamically generated poster

<img src="https://mp-d84f1f76-0293-41b6-a6a1-499dd4e5fc0c.cdn.bspapp.com/cloudstorage/3a005910-7ad2-4ca7-a01c-51ada5fd8a5f.jpg" alt="BG" width="250"/>

### Platform OAuth2.0 secret key

The city portal platform, such as the OAuth2.0 secret key and business domain name of Deyang Citizen Communication, requires the user's identity information and contact information to calculate the user's zodiac, birthplace, address, and send text messages. The platform needs to provide the aforementioned capabilities, and carry out secondary development according to the actual interface situation.

```
let client_id = `XXXXXXXXXXXXXXXXXXXXXX`//client_id 
let client_secret = `XXXXXXXXXXXXXXXXXXXXXX`//client_secret
let redirect_uri = `https://yourdomain.com`//redirect_uri
```

###3. Key pair for data encryption

Two pairs of 16-bit random secret keys are used for AES encryption of data, replacing the following 'XXXXXX', for example, the form of 'L7URlOJxXXNobOYE'. The back-end uses the encryption key to encrypt and store the user's mobile phone number and other sensitive data in the database, and the front-end key is used for low-sensitivity nickname and head image encryption. The front-end decryption is used to separate the key and the database.

```
//Back-end encryption key
let vkey = CryptoJS.enc.Utf8.parse('XXXXXXXXXXXXXXXXXXXXXX')
//Back-end encrypted secret key offset
let viv = CryptoJS.enc.Utf8.parse('XXXXXXXXXXXXXXXXXXXXXX')
//Front-end encryption key
let xkey = CryptoJS.enc.Utf8.parse('XXXXXXXXXXXXXXXXXXXXXX')
//The offset of the secret key encrypted by the front end
let xiv = CryptoJS.enc.Utf8.parse('XXXXXXXXXXXXXXXXXXXXXX')
```

### 4. WeChat official account key pair

The secret key pair of official account for calling JSSDK in WeChat web pages to invoke applets and share capabilities needs to be generated from the certified domestic official account.

```
// WeChat official account key
const wxappid = "XXXXXXXXXXXXXXXXXXXXXX"//
const wxsecret = "XXXXXXXXXXXXXXXXXXXXXX"//
```

### 5. AliCloud SMS key
Apply for the SMS key in AliCloud in advance. The template is as follows: ` Hello administrator, the ${name} you manage is full, please maintain it in time`

```
//AliCloud SMS key
const aliAccessKeyId = 'XXXXXXXXXXXXXXXXXXXXXX'
const aliAccessKeySecret = 'XXXXXXXXXXXXXXXXXXXXXX'
const aliTemplateCode = 'SMS_XXXXXXXX'
```

### 6. Operating environment requirements

Create an MySQL database in advance and fill in the account password when configuring. You need to prepare in advance:

- Ubuntu 20.04 LTS (GNU/Linux)
- Node.js v18
- yarn
- MySQL	5.7+

## Deployment and secondary development guide

### Operate on the server side

1.In a terminal, run the following command,change `Your project name` to the name of the directory you want to create

```
yarn create strapi-app your-project-name
```

2.Choose `Custom` installation type.` Quickstart` will use SQLite database by default
a
```
Custom (manual settings), which allows to choose your preferred database
```

3.Among the list of databases, Select MySQL database in the list and fill in the database information

4.Run the following command in the project folder

```
yarn develop
```
5.At this time, a stratpi application development environment will automatically compile and deploy and run on port 1337. If you want it to run on other ports, you can modify the PORT parameter in the. env file of the application root directory, and modify the port parameter in config/server.js;

6.Press Ctrl+C to exit cli temporarily, install dependencies, and execute them in the root directory respectively:
```
npm i axios --save
npm i moment --save
npm i crypto-js --save
npm i koa2-ratelimit --save
yarn strapi install graphql
```
7.Create the config/cron-tasks.js file:
```
const axios = require('axios');
const moment = require("moment");
const CryptoJS = require('crypto-js'); 

module.exports = {
   '0 0 18 * * *': async ({ strapi }) => {
        console.log("Group ranking at 18:00 every day::",await strapi.service('api::zhaolaogenuser.zhaolaogenuser').checkGroupRank())
    },
    '0 0 * * * *': async ({ strapi }) => {
        console.log("Refresh AccessToken every hour::", await strapi.service('api::zhaolaogenuser.zhaolaogenuser').getAccessToken())
   },
   '0 10,30,50 * * * *': async ({ strapi }) => {
        console.log("Refresh group ranking every 20 minutes::",await strapi.service('api::zhaolaogenuser.zhaolaogenuser').refreshGroupRank())
   }
}
```

8.Config/server.js also needs to make the following settings, add the cron service and bind the domain name:

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
9.Copy the/api directory of this open source project to your server and merge it with the src/api directory of the application

10.Modify the parameters in the src/api/zhaolaogenuser/services/zhaolaogenuser.js file:

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

