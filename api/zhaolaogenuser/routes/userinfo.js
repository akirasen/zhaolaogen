module.exports = {
    routes:[
        {
            method:"POST",
            path:"/zhaolaogen/info",
            handler:"zhaolaogenuser.getZlgInfo",
            config: {
                middlewares: ["api::zhaolaogen.ratelimit"],
            },
        },
        {
            method:"POST",
            path:"/zhaolaogen/warning/:id",
            handler:"zhaolaogenuser.warningAdmin",
            config: {
                middlewares: ["api::zhaolaogen.ratelimit"],
            },
        },
        {
            method:"POST",
            path:"/zhaolaogen/ticket",
            handler:"zhaolaogenuser.getTicket",
            config: {
                middlewares: ["api::zhaolaogen.ratelimit"],
            },
        },
        {
            method:"POST",
            path:"/zhaolaogen/start",
            handler:"zhaolaogenuser.groupStart",
            config: {
                middlewares: ["api::zhaolaogen.ratelimit"],
            },
        },
        {
            method:"POST",
            path:"/zhaolaogen/editGroup/:id",
            handler:"zhaolaogenuser.editGroup",
            config: {
                middlewares: ["api::zhaolaogen.ratelimit"],
            },
        },
        {
            method:"POST",
            path:"/zhaolaogen/setCurrentGroup/:id",
            handler:"zhaolaogenuser.setCurrentGroup",
            config: {
                middlewares: ["api::zhaolaogen.ratelimit"],
            },
        },
        {
            method:"POST",
            path:"/zhaolaogen/groupName/:id",
            handler:"zhaolaogenuser.getGroupName",
            config: {
                middlewares: ["api::zhaolaogen.ratelimit"],
            },
        },
        {
            method:"POST",
            path:"/zhaolaogen/chooseGroup/:code",
            handler:"zhaolaogenuser.chooseGroup",
            config: {
                middlewares: ["api::zhaolaogen.ratelimit"],
            },
        },
        {
            method:"POST",
            path:"/zhaolaogen/user/:code",
            handler:"zhaolaogenuser.userInfoStore",
            config: {
                middlewares: ["api::zhaolaogen.ratelimit"],
            },
        },
        {
            method:"POST",
            path:"/zhaolaogen/back/:code",
            handler:"zhaolaogenuser.userInfoHotback",
            config: {
                middlewares: ["api::zhaolaogen.ratelimit"],
            },
        },
    ]
}