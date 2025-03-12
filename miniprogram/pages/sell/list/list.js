const app = getApp()
const db = wx.cloud.database();
const config = require("../../../config.js");
const _ = db.command;
Page({

      /**
       * 页面的初始数据
       */
      data: {
            list: [],
            page: 1,
            scrollTop: 0,
            nomore: false,
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function(options) {
            wx.showLoading({
                title: '加载中',
            });
            // 使用传递过来的openid或默认为app.openid
            this.setData({
                targetOpenId: options.openid || app.openid,
            }, () => {
                this.getList();
            });
            this.windowInfo = wx.getWindowInfo();
        },
        getList() {
            let that = this;
            db.collection('publish').where({
                _openid: that.data.targetOpenId  // 使用目标openid
            }).orderBy('createTime', 'desc').limit(20).get({
                success: function(res) {
                    const list = res.data.map(item => {
                        const createDate = new Date(item.createTime);
                        item.creatTimeFormatted = `${createDate.getFullYear()}-${(createDate.getMonth() + 1).toString().padStart(2, '0')}-${createDate.getDate().toString().padStart(2, '0')} ${createDate.getHours().toString().padStart(2, '0')}:${createDate.getMinutes().toString().padStart(2, '0')}`;
                        item.isOwner = item._openid === app.openid;
                        return item;
                    });
                    wx.hideLoading();
                    wx.stopPullDownRefresh(); //暂停刷新动作
                    that.setData({
                        list: list,
                        nomore: false,
                        page: 0,
                    })
                }
            })
        },
      //删除
      del(e) {
            let that = this;
            let del = e.currentTarget.dataset.del;
            wx.showModal({
                  title: '温馨提示',
                  content: '您确定要删除此条发布吗？',
                  success(res) {
                        if (res.confirm) {
                              wx.showLoading({
                                    title: '正在删除'
                              })
                              db.collection('publish').doc(del._id).remove({
                                    success() {
                                          wx.hideLoading();
                                          wx.showToast({
                                                title: '成功删除',
                                          })
                                          that.getList();
                                    },
                                    fail() {
                                          wx.hideLoading();
                                          wx.showToast({
                                                title: '删除失败',
                                                icon: 'none'
                                          })
                                    }
                              })
                        }
                  }
            })
      },
      
      //跳转详情
      detail(e) {
            let that = this;
            wx.navigateTo({
                  url: '/pages/detail/detail?scene=' + e.currentTarget.dataset.id,
            })
      },
      //下拉刷新
      onPullDownRefresh() {
            this.getList();
      },
      //至顶
      gotop() {
            wx.pageScrollTo({
                  scrollTop: 0
            })
      },
      //监测屏幕滚动
      onPageScroll(e) {
            const pixelRatio = this.windowInfo.pixelRatio;
            this.setData({
                scrollTop: parseInt((e.scrollTop) * pixelRatio)
            });
        },
      onReachBottom() {
            this.more();
      },
      //加载更多
      more() {
            let that = this;
            if (that.data.nomore || that.data.list.length < 20) {
                return false;
            }
            let page = that.data.page + 1;
            db.collection('publish').where({
                _openid: that.data.targetOpenId  // 使用目标openid
            }).orderBy('creatTime', 'desc').skip(page * 20).limit(20).get({
                success: function(res) {
                    if (res.data.length == 0) {
                        that.setData({
                            nomore: true
                        });
                        return false;
                    }
                    if (res.data.length < 20) {
                        that.setData({
                            nomore: true
                        });
                    }
                    that.setData({
                        page: page,
                        list: that.data.list.concat(res.data)
                    });
                },
                fail() {
                    wx.showToast({
                        title: '获取失败',
                        icon: 'none'
                    });
                }
            });
        },
})