const app = getApp();
const config = require("../../config.js");
Page({

      /**
       * 页面的初始数据
       */
      data: {
            showShare: false,
            poster: JSON.parse(config.data).share_poster,
      },
      onShow() {
            this.setData({
                  userinfo: app.userinfo
            })
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
            const db = wx.cloud.database();
            //console.log('Attempting to update user with openid:', app.openid);
          
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
                  // 成功后更新本地数据
                  this.setData({
                    userinfo: {
                      ...this.data.userinfo,
                      info: {
                        ...this.data.userinfo.info,
                        avatarUrl: newAvatarUrl
                      }
                    }
                  });
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
                console.error('详细的错误信息:', JSON.stringify(err));
                wx.showToast({
                  title: '更新用户信息失败，请稍后再试',
                  icon: 'none'
                });
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
})