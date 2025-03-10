const db = wx.cloud.database();
const app = getApp();
const config = require("../../config.js");
Page({

      /**
       * 页面的初始数据
       */
      data: {
            ids: -1,
            xinbie: -1,
           
            Nickname: '',
            campus: JSON.parse(config.data).campus,
            gender: JSON.parse(config.data).gender,
            
      },
      choose: function(e) {
            let that = this;
            const type = e.currentTarget.dataset.type; // 获取选择器类型
            const index = e.detail.value; // 获取选择的索引值
            
            if (type === 'campus') {
                // 更新学院选择状态
                that.setData({
                    ids: index
                });
            } else if (type === 'gender') {
                // 更新性别选择状态
                that.setData({
                    xinbie: index
                },() => {
                  console.log("更新后的xinbie:", that.data.xinbie); // 打印更新后的xinbie
              });
            }
        },
      

      // 用户手动输入昵称的处理函数
    handlenameInput(e) {
      this.setData({
        Nickname: e.detail.value.trim()
      });
    },
     
     
     
      getUserInfo() {
            let that = this;
            wx.getUserProfile({
                  desc: '获取用户信息',
                  success: (res) => {
                        that.setData({
                              userInfo: res.userInfo
                        })
                        that.check();
                  },
                  fail: (err) => {
                        wx.showToast({
                              title: '获取用户信息失败',
                              icon: 'none',
                              duration: 2000
                        });
                  }
            })
      },
      //校检
      check() {
            let that = this;
            
            let username = that.data.Nickname; // 使用用户手动输入的昵称
            if (username == '') {
                  wx.showToast({
                        title: '请先填写你的昵称',
                        icon: 'none',
                        duration: 2000
                  });
                  return false
            }
            //先检查昵称是否已存在
            db.collection('user').where({
                  Nickname: username
            }).get({
                  success: function(res) {
                        if (res.data.length > 0) {
                              wx.showToast({
                                    title: '该昵称已被使用，请更换',
                                    icon: 'none',
                                    duration: 2000
                              });
                              return false;
                        }
                        //继续执行其他校验
                        //校检校区
                        let ids = that.data.ids;
                        if (ids == -1) {
                              wx.showToast({
                                    title: '请选择您的学院',
                                    icon: 'none',
                                    duration: 2000
                              });
                              return false
                        }
                        //校验性别
                        let xinbie = that.data.xinbie;
                        if (xinbie == -1) {
                              wx.showToast({
                                    title: '请选择您的性别',
                                    icon: 'none',
                                    duration: 2000
                              });
                              return false
                        }
                        //所有校验通过，继续执行提交
                        wx.showLoading({
                              title: '正在提交',
                        });
                        console.log("xinbie 的值:", that.data.xinbie);
                        db.collection('user').add({
                              data: {
                                    campus: that.data.campus[that.data.ids],
                                    gender: that.data.gender[that.data.xinbie],
                                    Nickname: that.data.Nickname,
                                    stamp: new Date().toLocaleString(),
                                    info: Object.assign({}, that.data.userInfo, { nickName: username }), // 修改部分
                                    useful: true,
                                    parse: 0,
                              },
                              success: function(res) {
                                    //console.log(res)
                                    db.collection('user').doc(res._id).get({
                                          success: function(res) {
                                                app.userinfo = res.data;
                                                app.openid = res.data._openid;
                                                wx.navigateBack({})
                                          },
                                    })
                              },
                              fail() {
                                    wx.hideLoading();
                                    wx.showToast({
                                          title: '注册失败，请重新提交',
                                          icon: 'none',
                                    })
                              }
                        })
                  }
            })
      },
})