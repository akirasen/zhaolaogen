'use strict';
/**
 * zhaolaogenuser controller
 */
const moment = require('moment'); 
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::zhaolaogenuser.zhaolaogenuser',({strapi})=>({
    warningAdmin:async (ctx,next)=>{
        const {id} = ctx.request.params;
        const findZlgGroup = await strapi.entityService.findOne("api::zhaolaogen.zhaolaogen",id,{populate: ['creater']});
        const user = await strapi.entityService.findMany('plugin::users-permissions.user',{
            filters: {
                id: findZlgGroup.creater.id
          }
        })
        let frozenTime = new Date(moment().add(30, 'minutes'))
        if(new Date(user[0].lastWarningTime)<new Date(moment())){
		    const sendSms = await strapi.service('api::zhaolaogenuser.zhaolaogenuser').sendSmsAliyun(user[0].phone,findZlgGroup.weChatGroupName)
		    const updateUser = await strapi.entityService.update('plugin::users-permissions.user',user[0].id,{
                data: {
                    lastWarningTime: new Date(moment().add(30, 'minutes'))
                 }
            })
            return {succeed:true,reason:"已通知管理员",sendSms:sendSms}
		}
        else{
             return {succeed:false,reason:"管理员已被通知过"}
        }
    }, 
    getTicket:async (ctx,next)=>{
        const findZlgSetting = await strapi.entityService.findOne("api::zhaolaogensetting.zhaolaogensetting",1,{
            fields:["currentJsapiTicket"]
        });
        return findZlgSetting.currentJsapiTicket
    }, 
    groupStart:async (ctx,next)=>{
        let body = ctx.request.body
        const userid = ctx.state.user.id;
        body.creater = userid
        body.weChatGroupAdminQR = ctx.state.user.weChatGroupAdminQR
        if(ctx.state.user.role.id == 3 || ctx.state.user.role.id == 4){
            const createGroup = await strapi.entityService.create("api::zhaolaogen.zhaolaogen",{
              data: body
            });
            const createNewLog = await strapi.entityService.create("api::zlglog.zlglog",{
              data: {
                  dealer:userid,
                  api:'createNewGroup',
                  body:body,
                  params:createGroup.id.toString()
              }
            });
             return {succeed:true,reason:"创建新群",group:createGroup}
        }else{
            return {succeed:false,reason:"非管理员"}
        }
    },   
    editGroup:async (ctx,next)=>{
        const {id} = ctx.request.params;
        const userid = ctx.state.user.id;
        let body = ctx.request.body
        if(ctx.state.user.role.id == 3 || ctx.state.user.role.id == 4){
            const updateGroup = await strapi.entityService.update("api::zhaolaogen.zhaolaogen",id,{
              data: body
            });
            const createNewLog = await strapi.entityService.create("api::zlglog.zlglog",{
              data: {
                  dealer:userid,
                  api:'editGroup',
                  params:id,
                  body:body
              }
            });
             return {succeed:true,reason:"更新群信息",group:updateGroup}
        }else{
            return {succeed:false,reason:"非管理员"}
        }
    },
    setCurrentGroup:async (ctx,next)=>{
        const {id} = ctx.request.params;
        const userid = ctx.state.user.id;
        if(ctx.state.user.role.id == 3 || ctx.state.user.role.id == 4){
            const updateZlgSetting = await strapi.entityService.update("api::zhaolaogensetting.zhaolaogensetting",1,{
              data: {
                  currentGroup:id
              },populate: ['currentGroup','groupInCircle']
            });
            const createNewLog = await strapi.entityService.create("api::zlglog.zlglog",{
              data: {
                  dealer:userid,
                  api:'setCurrentGroup',
                  params:id
              }
            });
             return {succeed:true,reason:"设置当前推荐的群",setting:updateZlgSetting}
        }else{
            return {succeed:false,reason:"非管理员"}
        }
    },
    getGroupName: async (ctx,next)=>{
        const {id} = ctx.request.params;
        const findZlgGroup = await strapi.entityService.findMany("api::zhaolaogen.zhaolaogen",{
            filters: {
              id:id
            }
        });
        if(findZlgGroup.length > 0){
            return {succeed:true,weChatGroupName:findZlgGroup[0].weChatGroupName}
        }
        else{
            return {succeed:false,reason:"群号无对应群"}
        }
    }, 
    chooseGroup: async (ctx,next)=>{
        const {code} = ctx.request.params;
        let body = ctx.request.body
        const findZlgGroup = await strapi.entityService.findOne("api::zhaolaogen.zhaolaogen",body.groupID,{});
        const findZlgUser = await strapi.entityService.findMany("api::zhaolaogenuser.zhaolaogenuser",{
           filters: {
               currentCode:code
           },populate: ['zhaolaogen']
        });
        if(findZlgUser.length>0){
            if(findZlgUser[0].zhaolaogen == null){
                let newGroupSetting = {
                    userCount:findZlgGroup.userCount + 1
                }
                const findZlgSetting = await strapi.entityService.findOne("api::zhaolaogensetting.zhaolaogensetting",1,{});
                if((strapi.service('api::zhaolaogenuser.zhaolaogenuser').dataDecryptPublic([findZlgUser[0].zodiac]))[0] === findZlgSetting.zodiac){
                    newGroupSetting.rabbitConut = findZlgGroup.rabbitConut + 1
                }
                const updateZlgUser = await strapi.entityService.update("api::zhaolaogenuser.zhaolaogenuser",findZlgUser[0].id,{
                  data: {
                      zhaolaogen:body.groupID
                  },populate: ['zhaolaogen']
                });
                const updateZlgGroup = await strapi.entityService.update("api::zhaolaogen.zhaolaogen",body.groupID,{
                   data: newGroupSetting
                });
                delete updateZlgUser.card
                delete updateZlgUser.name
                delete updateZlgUser.phone
                delete updateZlgUser.currentCode
                delete updateZlgUser.identifier
                return {succeed:true,reason:"报名加入粉丝群成功，请扫描二维码加入群",user:updateZlgUser}
            }
            else{
                delete findZlgUser[0].card
                delete findZlgUser[0].name
                delete findZlgUser[0].phone
                delete findZlgUser[0].currentCode
                delete findZlgUser[0].identifier
                return {succeed:false,reason:"加入粉丝群失败，已加入过群",user:findZlgUser[0]}
            }
        }
        else{
            return {succeed:false,reason:"用户信息不正确",user:findZlgUser}
        }
    },
    getZlgInfo:async (ctx,next)=>{
        const findZlgSetting = await strapi.entityService.findOne("api::zhaolaogensetting.zhaolaogensetting",1,{});
        const updateZlgSetting = await strapi.entityService.update("api::zhaolaogensetting.zhaolaogensetting",1,{
          data: {
              totalUsed:parseInt(findZlgSetting.totalUsed) + 1,
              totalClick:parseInt(findZlgSetting.totalClick)+2+Math.floor(Math.random()*5)
          },populate: ['currentGroup','groupInCircle']
        });
        const findZlgGroup = await strapi.entityService.findMany("api::zhaolaogen.zhaolaogen",{
            limit: 50,
            filters: {
               joinedCircle:false,
               rank:{$ne:0}
            },
            sort: [{rank: 'asc' }]
        });
        return {zlgSetting:updateZlgSetting,zlgGroup:findZlgGroup}
    },
    userInfoStore:async (ctx,next)=>{
        const {code} = ctx.request.params;
        const userInfo = await strapi.service('api::zhaolaogenuser.zhaolaogenuser').getSmtUsers(code)
        const findZlgUser = await strapi.entityService.findMany("api::zhaolaogenuser.zhaolaogenuser",{
           filters: {
               uid:userInfo.uid
           }
        });
        if(findZlgUser.length > 0){
            const updateZlgUser = await strapi.entityService.update("api::zhaolaogenuser.zhaolaogenuser",findZlgUser[0].id,{
              data: {
                  currentCode:code
              },populate: ['zhaolaogen']
            });
            const findZlgSetting = await strapi.entityService.findOne("api::zhaolaogensetting.zhaolaogensetting",1,{});
            const updateZlgSetting = await strapi.entityService.update("api::zhaolaogensetting.zhaolaogensetting",1,{
              data: {
                  totalUsed:parseInt(findZlgSetting.totalUsed) + 1,
                  totalClick:parseInt(findZlgSetting.totalClick)+2+Math.floor(Math.random()*5)
              },populate: ['currentGroup','groupInCircle']
            });
            delete updateZlgUser.card
            delete updateZlgUser.name
            delete updateZlgUser.phone
            delete updateZlgUser.currentCode
            delete updateZlgUser.identifier
            return {zlgUser:updateZlgUser,zlgSetting:updateZlgSetting}
        }
        else{
            console.log('userInfo2::',userInfo)
            const createZlgUser = await strapi.entityService.create("api::zhaolaogenuser.zhaolaogenuser",{
              data: userInfo,populate: ['zhaolaogen']
            });
            const findZlgSetting = await strapi.entityService.findOne("api::zhaolaogensetting.zhaolaogensetting",1,{});
            const updateZlgSetting = await strapi.entityService.update("api::zhaolaogensetting.zhaolaogensetting",1,{
              data: {
                  totalUsed:parseInt(findZlgSetting.totalUsed) + 1,
                  totalUser:parseInt(findZlgSetting.totalUser) + 1,
                  totalClick:parseInt(findZlgSetting.totalClick)+2+Math.floor(Math.random()*5)
              }
              ,populate: ['currentGroup','groupInCircle']
            });
            delete createZlgUser.card
            delete createZlgUser.name
            delete createZlgUser.phone
            delete createZlgUser.currentCode
            delete updateZlgUser.identifier
            return {zlgUser:createZlgUser,zlgSetting:updateZlgSetting}
        }
        
    }
}));
