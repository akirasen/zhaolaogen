'use strict';

/**
 * `ratelimit` middleware
 */
module.exports = (config, { strapi }) => async (ctx, next) => {
    const ratelimit = require("koa2-ratelimit").RateLimit;
    const message = "手速太快了！请1分钟后再试"
    return ratelimit.middleware(
      Object.assign(
        {},
        {
          interval: 1 * 60 * 1000,
          max: 5,
          prefixKey: `${ctx.request.path}:${ctx.request.ip}`,
          messageKey: "reason",
          message
        },
        config
      )
    )(ctx, next);
};