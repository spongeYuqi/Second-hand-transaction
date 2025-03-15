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



// const config = require("config.js");

// App({
//   openid: '', // 用户的 openid
//   userinfo: '', // 用户信息
//   canReflect: true, // 其他属性保持不变

//   onLaunch: function() {
//     if (!wx.cloud) {
//       console.error('请使用 2.2.3 或以上的基础库以使用云能力');
//     } else {
//       wx.cloud.init({
//         env: JSON.parse(config.data).env, // 确保这里的环境ID是正确的
//         traceUser: true,
//       });
//     }

//     this.systeminfo = wx.getSystemInfoSync();

//     // 登录并获取 openid
//     wx.login({
//       success: res => {
//         if (res.code) {
//           // 调用云函数获取 openid
//           wx.cloud.callFunction({
//             name: 'login', // 使用你已经部署的 login 云函数
//             data: {
//               code: res.code,
//             },
//             success: res => {
//               // console.log('[云函数] [login] user openid:', res.result.openid);
//               this.openid = res.result.openid; // 设置全局 openid
              
              
//             },
//             fail: err => {
//               console.error('[云函数] [login] 调用失败', err);
//             }
//           });
//         } else {
//           console.log('登录失败！' + res.errMsg);
//         }
//       }
//     });
//   },

  
// });




// const config = require("config.js");

// App({
//   openid: '', // 用户的 openid
//   userinfo: '', // 用户信息
//   canReflect: true, // 其他属性保持不变

//   onLaunch: function() {
//     if (!wx.cloud) {
//       console.error('请使用 2.2.3 或以上的基础库以使用云能力');
//     } else {
//       wx.cloud.init({
//         env: JSON.parse(config.data).env, // 确保这里的环境ID是正确的
//         traceUser: true,
//       });
//     }

//     this.systeminfo = wx.getSystemInfoSync();

//     // 尝试从本地存储中读取 openid
//     const localOpenid = wx.getStorageSync('openid');
//     if (localOpenid) {
//       this.openid = localOpenid;
      
//     } else {
//       // 如果没有本地存储的 openid，则调用微信登录获取新的 openid
//       loginAndGetOpenid();
//     }
//   },
// });

// function checkDatabaseForOpenid(openid) {
//   const db = wx.cloud.database();
//   db.collection('user').where({
//     _openid: openid
//   }).get({
//     success: res => {
//       if (res.data.length > 0) {
//         console.log("用户已存在");
//         // 用户已注册，可以继续使用当前 openid
//       } else {
//         console.log("用户未注册");
//         // 用户未注册，根据业务需求处理，比如设置 openid 为空或提示用户注册
//         getApp().openid = ''; // 设置 openid 为空
//       }
//     },
//     fail: err => {
//       console.error(err);
//     }
//   });
// }

// function loginAndGetOpenid() {
//   wx.login({
//     success: res => {
//       if (res.code) {
//         // 调用云函数获取 openid
//         wx.cloud.callFunction({
//           name: 'login', // 使用你已经部署的 login 云函数
//           data: {
//             code: res.code,
//           },
//           success: res => {
//             const openid = res.result.openid;
//             getApp().openid = openid; // 设置全局 openid
            
//             // 将 openid 保存到本地存储
//             wx.setStorageSync('openid', openid);

//             // 检查数据库中是否有该 openid 的记录
//             checkDatabaseForOpenid(openid);
//           },
//           fail: err => {
//             console.error('[云函数] [login] 调用失败', err);
//           }
//         });
//       } else {
//         console.log('登录失败！' + res.errMsg);
//       }
//     }
//   });
// }


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

    // 尝试从本地存储中读取 openid
    const localOpenid = wx.getStorageSync('openid');
    if (localOpenid) {
      this.openid = localOpenid;
      //checkDatabaseForOpenid(localOpenid);
    } else {
      // 如果没有本地存储的 openid，则调用微信登录获取新的 openid
      loginAndGetOpenid();
    }
  },
});

function checkDatabaseForOpenid(openid, callback) {
  const db = wx.cloud.database();
  db.collection('user').where({
    _openid: openid
  }).get({
    success: res => {
      if (res.data.length > 0) {
        console.log("用户已存在");
        // 用户已注册，可以继续使用当前 openid
        wx.setStorageSync('openid', openid); // 在这里保存 openid 到本地存储
        if (callback) callback(true);
      } else {
        console.log("用户未注册");
        // 用户未注册，根据业务需求处理，比如设置 openid 为空或提示用户注册
        getApp().openid = ''; // 设置 openid 为空
        wx.removeStorageSync('openid'); // 清除本地存储中的 openid
        if (callback) callback(false);
      }
    },
    fail: err => {
      console.error(err);
      if (callback) callback(false);
    }
  });
}

function loginAndGetOpenid() {
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
            const openid = res.result.openid;
            getApp().openid = openid; // 设置全局 openid
            
            // 检查数据库中是否有该 openid 的记录
            checkDatabaseForOpenid(openid, function(isRegistered) {
              if (!isRegistered) {
                // 如果用户未注册，可以在这里进行相应的处理，如跳转到注册页面
                console.log("需要引导用户进行注册");
              }
            });
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
}