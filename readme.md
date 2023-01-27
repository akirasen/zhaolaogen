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

The city portal platform, such as the OAuth2.0 secret key and business domain name of Deyang Citizen ID, requires the user's identity information and contact information to calculate the user's zodiac, birthplace, address, and send text messages. The platform needs to provide the aforementioned capabilities, and carry out secondary development according to the actual interface situation.

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
let client_id = `XXXXXXXXXX`//client_id 
let client_secret = `XXXXXXXXXX`//client_secret
let redirect_uri = `https://XXXXXXXXXX.XXXXXXXXXX.cn`//redirect_uri
//Incoming secret key for sensitive data encryption
let vkey = CryptoJS.enc.Utf8.parse('XXXXXXXXXX')
//Incoming key offset for sensitive data encryption
let viv = CryptoJS.enc.Utf8.parse('XXXXXXXXXX')
//Incoming secret key for encryption of non-sensitive data
let xkey = CryptoJS.enc.Utf8.parse('XXXXXXXXXX')
//The passed-in key offset for encryption of non-sensitive data
let xiv = CryptoJS.enc.Utf8.parse('XXXXXXXXXX')
//Official account key
const wxappid = "XXXXXXXXXX"
const wxsecret = "XXXXXXXXXX"
//AliCloud SMS key
const aliAccessKeyId = 'XXXXXXXXXX'
const aliAccessKeySecret = 'XXXXXXXXXX'
const aliTemplateCode = 'XXXXXXXXXX'
```

11. After the backend parameters are configured, rebuild and start the development environment:

```
yarn build
yarn develop
```

12.To use the domain name to access the API, you need to complete the following work

- Modify the nginx configuration file and use the reverse proxy to listen to the application port;

- If you want to use it in WeChat mini program, you need to use SSL and bind a series of configurations such as business domain name

13. Log in to the stratpi management panel and set parameters

- Pass https://yourdomain.com/admin Can log in
- For initial login, you need to register the management account
- After logging in, select zhaolaogensetting in content-manager to set the application running parameters.

14. Configure API access rights

In `settings/users permissions/roles`, select Public to configure public API access permissions. In the`Permissions` list, select`zhaolaogenuser`, check the following APIs and save:

```
chooseGroup
getGroupName 
getTicket 
getZlgInfo 
userInfoStore 
warningAdmin
```

Select `users permissions`, check`callback`and save. All other APIs not mentioned are unchecked and saved.

In `content manager`, select `user`, click the `Edit the model` button, click the `Add another field`button, create a `Text`type field named `name`, and then create a `datetime` type `Date` field named `LastWarningTime`, a `Text`type field named`phone`, and a `Text`type field named`qrcode`, and save it.

In `settings/users permissions/roles`, click the`Add new role`button to create a new role named`zlgOper`. In the`Permissions`list, select`zhaolaogenuser`, check all APIs except `delete` and save, select `users permissions`, check `me` and save, and uncheck all other APIs not mentioned and save.

In `content manager`, select`user`, click the `Create an entry` button, and fill in the administrator login information. Where `confirmed` selects `true `,`role` selects `zlgOper`, and qrcode fills in the administrator's WeChat QR code link address.

15. List of public APIs

After the configuration is successful, users can use the following APIs through POST without login authorization, and use koa2-ratelimit to set the access limit of 5 times per minute to increase the cost of malicious attacks:

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

16. List of authorized access APIs

After logging in, the administrator can use the following interfaces through jwt authorization:

```
/api/zhaolaogen/start
/api/zhaolaogen/editGroup/:id
/api/zhaolaogen/setCurrentGroup/:id
/graphql
```
###Operate in HBuilder X or other IDE

1. Clone the code locally

```
git clone https://github.com/akirasen/zhaolaogen.git
```

2. Install dependencies in the root directory of the project in the terminal

```
npm i
```

3. Configure in 'util/api. js'
```
//API domain name
const BASE_URL = 'https://yourdomain.com'
//The incoming secret key used for encryption of non-sensitive data is consistent with the back-end configuration
let xkey = CryptoJS.enc.Utf8.parse('XXXXXXXXXX')
//The key offset of the incoming non-sensitive data encryption is consistent with the backend configuration
let xiv = CryptoJS.enc.Utf8.parse('XXXXXXXXXX')
```
4. Configure in 'pages/index/index. vue'

```
bgImg:{//Page Elements
   bgImg: "",//Replicatable middle background,Picture link address
   topImg: "",//Picture link address
   bottomImg: "",//Picture link address
},
post:[/Load animation. You can fill in more than one random display
  {
   postImg: "",//cover,Picture link address
   video: "",//Video address
   duration:12//Video length (seconds) for countdown
  },
],
```
A development mode is also provided here. You can set the developMode to true. When the built-in browser is opened, the data in userinfo1 and eventSetting2 will be loaded (you need to configure it yourself) instead of being called from the interface.

