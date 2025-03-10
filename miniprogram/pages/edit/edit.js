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
    userInfo: null, // 添加用于存储用户信息的对象
    _id: null, // 添加用于存储文档_id的字段
  },

  onLoad() {
    this.getdetail();
  },

  getdetail() {
    let that = this;
    db.collection('user').where({
      _openid: app.openid
    }).get({
      success: function(res) {
        //console.log("Returned data:", res.data[0]);
        if (res.data.length > 0) { // 确保找到了用户数据
          let info = res.data[0];
          that.setData({
            ids: info.campus.id,
            xinbie: info.gender.id,
            Nickname: info.Nickname,
            _id: info._id,
            userInfo: info.info // 假设info中有用户信息字段
          });
        } else {
          wx.showToast({
            title: '未找到用户信息，请检查登录状态',
            icon: 'none'
          });
        }
      },
      fail() {
        wx.showToast({
          title: '获取失败',
          icon: 'none'
        })
        setTimeout(() => {
          wx.navigateBack({});
        }, 2000);
      }
    })
  },

  choose: function(e) {
    let that = this;
    const type = e.currentTarget.dataset.type; // 获取选择器类型
    const index = e.detail.value; // 获取选择的索引值

    if (type === 'campus') {
      that.setData({
        ids: index
      });
    } else if (type === 'gender') {
      that.setData({
        xinbie: index
      });
    }
  },

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

  check() {
    let that = this;

    let username = that.data.Nickname;
    if (username == '') {
      wx.showToast({
        title: '请先填写你的昵称',
        icon: 'none',
        duration: 2000
      });
      return false;
    }

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

        let ids = that.data.ids;
        if (ids == -1) {
          wx.showToast({
            title: '请选择您的学院',
            icon: 'none',
            duration: 2000
          });
          return false;
        }

        let xinbie = that.data.xinbie;
        if (xinbie == -1) {
          wx.showToast({
            title: '请选择您的性别',
            icon: 'none',
            duration: 2000
          });
          return false;
        }

        wx.showLoading({
          title: '正在提交',
        });
                // 创建不包含 avatarUrl 的 userInfo 对象
                let userInfoWithoutAvatar = Object.assign({}, that.data.userInfo);
                delete userInfoWithoutAvatar.avatarUrl;

        //console.log('_id:', that.data._id);

        db.collection('user').doc(that.data._id).update({
          data: {
            campus: that.data.campus[that.data.ids],
            gender: that.data.gender[that.data.xinbie],
            Nickname: that.data.Nickname,
            stamp: new Date().toLocaleString(),
            'info': Object.assign(userInfoWithoutAvatar, { nickName: username }),
            'info.nickName': username,
            useful: true,
            parse: 0,
          },
          success: function(res) {
            //console.log(res);
            db.collection('user').doc(that.data._id).get({
              success: function(res) {
                app.userinfo = res.data;
                app.openid = res.data._openid;
                wx.hideLoading();
                wx.navigateBack({});
              },
              fail: function(err) {
                wx.hideLoading();
                console.error('Failed to fetch updated user data:', err);
                wx.showToast({
                  title: '注册成功，但无法获取最新信息',
                  icon: 'none'
                });
              }
            });
          },
          fail() {
            wx.hideLoading();
            wx.showToast({
              title: '注册失败，请重新提交',
              icon: 'none',
            });
          }
        });
      }
    });
  },
});