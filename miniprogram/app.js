// const config = require("config.js");
// App({
//       openid: '',
//       userinfo:'',
//       canReflect:true,
//       onLaunch: function() {
//             if (!wx.cloud) {
//                   console.error('请使用 2.2.3 或以上的基础库以使用云能力')
//             } else {
//                   wx.cloud.init({
//                        env: JSON.parse(config.data).env,
//                         traceUser: true,
//                   })
//             }
//            this.systeminfo=wx.getSystemInfoSync();
//       }
// })

const config = require("config.js");

App({
  openid: '', // 用户的 openid
  userinfo: '', // 用户信息
  canReflect: true, // 其他属性保持不变

  onLaunch: function() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: JSON.parse(config.data).env, // 确保这里的环境ID是正确的
        traceUser: true,
      });
    }

    this.systeminfo = wx.getSystemInfoSync();

    // 登录并获取 openid
    wx.login({
      success: res => {
        if (res.code) {
          // 调用云函数获取 openid
          wx.cloud.callFunction({
            name: 'login', // 使用你已经部署的 login 云函数
            data: {
              code: res.code,
            },
            success: res => {
              console.log('[云函数] [login] user openid:', res.result.openid);
              this.openid = res.result.openid; // 设置全局 openid
              
              
            },
            fail: err => {
              console.error('[云函数] [login] 调用失败', err);
            }
          });
        } else {
          console.log('登录失败！' + res.errMsg);
        }
      }
    });
  },

  
});