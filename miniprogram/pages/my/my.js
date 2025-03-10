const app = getApp();
const config = require("../../config.js");
const db = wx.cloud.database();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showShare: false,
    poster: JSON.parse(config.data).share_poster,
    userinfo: null, // 初始化用户信息为null
  },

  onLoad() {
    this.fetchLatestUserInfo(); // 页面加载时获取最新用户信息
  },

  onShow() {
    this.fetchLatestUserInfo(); // 页面显示时也重新获取最新用户信息
  },

  go(e) {
    const target = e.currentTarget.dataset.go;
    // 检查是否为"我的收藏"或"我的积分"
    if (target === '/pages/order/list/list' || target === '/pages/parse/parse') {
      wx.showToast({
        title: '待开发中',
        icon: 'none',
        duration: 1000
      });
      return; // 结束函数执行，避免继续运行下面的代码
    }
    if (e.currentTarget.dataset.status == '1') {
      if (!app.openid) {
        wx.showModal({
          title: '温馨提示',
          content: '该功能需要注册方可使用，是否马上去注册',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/login/login',
              })
            }
          }
        })
        return false
      }
    }
    wx.navigateTo({
      url: e.currentTarget.dataset.go
    })
  },

  chooseImage() {
      // 检查用户是否已登录
  if (!app.openid) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    console.log('Choose image triggered');
    const that = this;
    wx.chooseImage({
      count: 1, // 默认9，这里限制为1张
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        that.uploadImage(tempFilePaths[0]);
      }
    })
  },

  uploadImage(filePath) {
    const that = this;
    const cloudPath = `avatar/${Date.now()}-${Math.floor(Math.random(0, 1) * 1000)}.png`; // 生成唯一的文件名

    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: res => {
        // 获取上传后的文件ID或URL
        const avatarUrl = res.fileID || res.url;
        that.updateUserAvatarUrl(avatarUrl);
      },
      fail: err => {
        console.error('上传失败', err);
      }
    })
  },

  updateUserAvatarUrl(newAvatarUrl) {
    const that = this;

    // 查询含有对应_openid的记录
    db.collection('user')
      .where({
        _openid: app.openid.trim() // 使用_openid进行匹配
      })
      .get()
      .then(res => {
        if (res.data.length > 0) { // 确保至少有一个匹配的记录
          const userId = res.data[0]._id; // 获取匹配记录的_id
          return db.collection('user')
            .doc(userId)
            .update({
              data: {
                'info.avatarUrl': newAvatarUrl, // 更新info对象内的avatarUrl字段
              }
            });
        } else {
          console.error("未能找到对应的用户记录");
          throw new Error("Document not found");
        }
      })
      .then(res => {
        console.log("更新成功", res);
        if (res.stats.updated === 1) {
          // 成功后更新本地数据和全局数据
          const updatedUserInfo = {
            ...that.data.userinfo,
            info: {
              ...that.data.userinfo.info,
              avatarUrl: newAvatarUrl
            }
          };
          that.setData({
            userinfo: updatedUserInfo
          });
          app.userinfo = updatedUserInfo; // 更新全局变量
          wx.showToast({
            title: '头像更新成功',
            icon: 'success'
          });
        } else {
          console.warn("文档未被更改");
        }
      })
      .catch(err => {
        console.error('更新用户信息失败', err);
        wx.showToast({
          title: '更新用户信息失败，请稍后再试',
          icon: 'none'
        });
      });
  },

  fetchLatestUserInfo() {
    const that = this;

    // 使用用户的 openid 来查找并更新最新的用户信息
    db.collection('user').where({
      _openid: app.openid.trim()
    }).get().then(res => {
      if (res.data.length > 0) {
        const latestUserInfo = res.data[0];
        that.setData({
          userinfo: latestUserInfo
        });
        // 更新全局的用户信息
        app.userinfo = latestUserInfo;
      } else {
        console.error("未能找到对应的用户记录");
      }
    }).catch(err => {
      console.error('获取最新用户信息失败', err);
    });
  },

  //展示分享弹窗
  showShare() {
    this.setData({
      showShare: true
    });
  },

  //关闭弹窗
  closePop() {
    this.setData({
      showShare: false,
    });
  },

  //预览图片
  preview(e) {
    wx.previewImage({
      urls: e.currentTarget.dataset.link.split(",")
    });
  },

  onShareAppMessage() {
    return {
      title: JSON.parse(config.data).share_title,
      imageUrl: JSON.parse(config.data).share_img,
      path: '/pages/start/start'
    }
  },
});