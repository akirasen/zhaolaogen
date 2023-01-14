'use strict';
const axios = require('axios')
const CryptoJS = require('crypto-js'); 
const moment = require('moment'); 
/**
 * zhaolaogenuser service
 */
let client_id = `XXXXXXXXXX`//配置client_id 
let client_secret = `XXXXXXXXXX`//配置client_secret
let redirect_uri = `https://XXXXXXXXXX.XXXXXXXXXX.cn`//配置redirect_uri
//后端用加密秘钥 
let vkey = CryptoJS.enc.Utf8.parse('XXXXXXXXXX')
//后端用加密秘钥偏移量
let viv = CryptoJS.enc.Utf8.parse('XXXXXXXXXX')
//前端用加密的秘钥
let xkey = CryptoJS.enc.Utf8.parse('XXXXXXXXXX')
//前端用加密秘钥偏移量
let xiv = CryptoJS.enc.Utf8.parse('XXXXXXXXXX')
// 公众号key
const wxappid = "XXXXXXXXXX"
const wxsecret = "XXXXXXXXXX"
//阿里云短信接口密钥
const aliAccessKeyId = 'XXXXXXXXXX'
const aliAccessKeySecret = 'XXXXXXXXXX'
const aliTemplateCode = 'XXXXXXXXXX'

let zfzCode = [
    {no:"510601",name:"德阳市辖区"},
    {no:"510602",name:"德阳市中区"},
    {no:"510621",name:"德阳县"},
    {no:"510603",name:"旌阳"},
    {no:"510604",name:"罗江"},
    {no:"510626",name:"罗江"},
    {no:"510624",name:"广汉"},
    {no:"510681",name:"广汉"},
    {no:"510625",name:"什邡"},
    {no:"510682",name:"什邡"},
    {no:"510622",name:"绵竹"},
    {no:"510683",name:"绵竹"},
    {no:"510623",name:"中江"}
]
let zodiac = ["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"]

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::zhaolaogenuser.zhaolaogenuser', ({ strapi }) =>  ({
    async sendSmsAliyun(phone,group){
        const Core = require('@alicloud/pop-core');
        var client = new Core({
         accessKeyId: aliAccessKeyId,
         accessKeySecret: aliAccessKeySecret,
          endpoint: 'https://dysmsapi.aliyuncs.com',
          apiVersion: '2017-05-25'
        });
        var params = {
          "PhoneNumbers": phone,
          "SignName": "市民通",
          "TemplateCode": aliTemplateCode,
          "TemplateParam": "{\"name\":\""+group+"\"}"
        }
        var requestOption = {
          method: 'POST',
          formatParams: false,
        
        };
        
        client.request('SendSms', params, requestOption).then((result) => {
          console.log(JSON.stringify(result));
        }, (ex) => {
        return ex
        })
    },
    async getAccessToken() {
        const access_token = await axios.get(
            `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wxappid}&secret=${wxsecret}`
          );
          const jsapi_ticket = await axios.get(
            `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token.data.access_token}&type=jsapi`
          );
         const currentAccessTokenChange = await strapi.entityService.update('api::zhaolaogensetting.zhaolaogensetting',"1", {
          data: {
                currentAccessToken:access_token.data.access_token,
                accessTokenRefreshTime:new Date(),
                currentJsapiTicket:jsapi_ticket.data.ticket
              },
        });
        return {succeed:true,reason:'access_token获取成功。',ticket:jsapi_ticket.data.ticket,access_token:access_token.data.access_token,expires_in:access_token.data.expires_in,createTime:new Date()}
    },
    async refreshGroupRank(){
        const findZlgSetting = await strapi.entityService.findOne("api::zhaolaogensetting.zhaolaogensetting",1,{
                fields: ['topNumJoincircle','miniGroupCount','groupInCircleCount']
            });
        const findZlgGroup = await strapi.entityService.findMany("api::zhaolaogen.zhaolaogen",{
            limit: 99,
            filters: {
               joinedCircle:false,
               userCount:{$gte:findZlgSetting.miniGroupCount}
            },
            sort: [{ rabbitConut: 'desc' }, { userCount: 'desc' }],
            populate: ['zhaolaogen_users']
        });
        if(findZlgGroup.length > 0){
            findZlgGroup.forEach(async (item,index) =>{
                const groupIndex = findZlgGroup.findIndex((group) => {return group === item})
                const updateZlgGroup = await strapi.entityService.update("api::zhaolaogen.zhaolaogen",item.id,{
                   data: {
                       rank:groupIndex+1
                   }
                });
            })
            return '已刷新排名'
        }else{
            return '无符合条件的群'
        }
        
    },
    async checkGroupRank(){
        const findZlgSetting = await strapi.entityService.findOne("api::zhaolaogensetting.zhaolaogensetting",1,{
                fields: ['topNumJoincircle','miniGroupCount','groupInCircleCount']
            });
        const findZlgGroup = await strapi.entityService.findMany("api::zhaolaogen.zhaolaogen",{
            limit: 99,
            filters: {
               joinedCircle:false,
               userCount:{$gte:findZlgSetting.miniGroupCount}
            },
            sort: [{ rabbitConut: 'desc' }, { userCount: 'desc' }],
            populate: ['zhaolaogen_users']
        });
        if(findZlgGroup.length > 0){
            findZlgGroup.forEach(async (item,index) =>{
                const groupIndex = findZlgGroup.findIndex((group) => {return group === item})
                const updateZlgGroup = await strapi.entityService.update("api::zhaolaogen.zhaolaogen",item.id,{
                   data: {
                       rank:groupIndex+1
                   }
                });
            })
            const findZlgGroupSort = await strapi.entityService.findMany("api::zhaolaogen.zhaolaogen",{
                limit: findZlgSetting.topNumJoincircle,
                filters: {
                   joinedCircle:false,
                   userCount:{$gte:findZlgSetting.miniGroupCount},
                   rank:{$ne:0}
                },
                sort: [{rank: 'asc' }]
            });
            findZlgGroupSort.forEach(async (item,index) =>{
                const updateZlgGroup = await strapi.entityService.update("api::zhaolaogen.zhaolaogen",item.id,{
                  data: {
                      rank:0,
                      joinedCircle:true,
                      joinCircleDate:new Date()
                  }
                });
            })
            const updateZlgSetting = await strapi.entityService.update("api::zhaolaogensetting.zhaolaogensetting",1,{
              data: {
                  groupInCircleCount:findZlgSetting.groupInCircleCount + findZlgGroupSort.length
              }
            });
            return '有'+updateZlgSetting.groupInCircleCount+'个入圈的群'
        }else{
            return '无符合条件的群'
        }
        
        
    },
    dataDecrypt(args) {
    let decryptedDataList = []
    args.forEach(item => {
        let encryptedHexStr = CryptoJS.enc.Hex.parse(item);
        let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
        let decrypt = CryptoJS.AES.decrypt(srcs, vkey, { iv: viv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
        let decryptedData = decrypt.toString(CryptoJS.enc.Utf8);
        decryptedDataList.push(decryptedData)
    })
    return decryptedDataList
  },
    dataEncrypt(args) {
        let encryptedDataList = []
        args.forEach(item => {
            let srcs = '';
        	let encrypted = '';
        	let decryptedData = '';
        	srcs = CryptoJS.enc.Utf8.parse(item);//传入的消息
            encrypted = CryptoJS.AES.encrypt(srcs, vkey, { iv: viv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
            decryptedData = encrypted.ciphertext.toString()//.toUpperCase();
            encryptedDataList.push(decryptedData)
        })
        return encryptedDataList
    },
    dataDecryptPublic(args) {
    let decryptedDataList = []
    args.forEach(item => {
        let encryptedHexStr = CryptoJS.enc.Hex.parse(item);
        let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
        let decrypt = CryptoJS.AES.decrypt(srcs, xkey, { iv: xiv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
        let decryptedData = decrypt.toString(CryptoJS.enc.Utf8);
        decryptedDataList.push(decryptedData)
    })
    return decryptedDataList
  },
    dataEncryptPublic(args) {
        let encryptedDataList = []
        args.forEach(item => {
            let srcs = '';
        	let encrypted = '';
        	let decryptedData = '';
        	srcs = CryptoJS.enc.Utf8.parse(item);//传入的消息
            encrypted = CryptoJS.AES.encrypt(srcs, xkey, { iv: xiv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
            decryptedData = encrypted.ciphertext.toString()//.toUpperCase();
            encryptedDataList.push(decryptedData)
        })
        return encryptedDataList
    },
    getZodiac(year) {
        return zodiac[(year - 4) % 12]
    },
    async getSmtUsers(code) {
        const access_token = await axios.post(
            `https://auths.dysmt.cn/oauth/token?code=${code}&client_secret=${client_secret}&grant_type=authorization_code&client_id=${client_id}&redirect_uri=${redirect_uri}`
          );
        const userInfo = await axios.post(
            `https://authr.dysmt.cn/resource/user/userinfo?access_token=${access_token.data.access_token}` 
          );
        const birthplaceIndex = zfzCode.findIndex((code) => {return code.no === userInfo.data.content.userAuth.cardId.substr(0,6)})
        let birthplace = '新德阳人'
        if(birthplaceIndex > -1){
            birthplace = (zfzCode[birthplaceIndex]).name
        }
        const zodiac = this.getZodiac(parseInt(userInfo.data.content.userAuth.cardId.substr(6,4)))
        let salutation = ''
        let gender = 0
        if((parseInt(userInfo.data.content.userAuth.cardId.substr(16,1)) % 2) === 0){
            salutation = userInfo.data.content.userAuth.realName.substr(0,1) + '女士'
            gender = 2
        }
        else{
            salutation = userInfo.data.content.userAuth.realName.substr(0,1) + '先生'
            gender = 1
        }
        let identifier = ""
        
        for(let i =0;i<userInfo.data.content.userAuth.realName.length;i++){
            if(i == 1){
                identifier = identifier + '*'
            }
            else{
                identifier = identifier + userInfo.data.content.userAuth.realName.substr(i,1)
            }
        }        

        const zlgUser = {
            currentCode:code,
            uid:userInfo.data.content.id,
            identifier:identifier,
            nickname:(this.dataEncryptPublic([userInfo.data.content.nickname]))[0],
            img:(this.dataEncryptPublic([userInfo.data.content.photoUrl]))[0],
            phone:(this.dataEncrypt([userInfo.data.content.phone]))[0],
            birthplace:(this.dataEncryptPublic([birthplace]))[0],
            zodiac:(this.dataEncryptPublic([zodiac]))[0],
            salutation:(this.dataEncryptPublic([salutation]))[0],
            gender:gender
        }
        return zlgUser
    }
}));