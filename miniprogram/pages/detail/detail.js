const app = getApp()
const db = wx.cloud.database();
const config = require("../../config.js");
const _ = db.command;
Page({

      /**
       * 页面的初始数据
       */
      data: {
            first_title: true,
            //place: '',
      },
      onLoad(e) {
            this.getuserdetail();
            this.data.id = e.scene;
            this.getPublish(e.scene);
      },
      changeTitle(e) {
            let that = this;
            that.setData({
                  first_title: e.currentTarget.dataset.id
            })
      },
      //获取发布信息
      getPublish(e) {
            let that = this;
            db.collection('publish').doc(e).get({
                  success: function(res) {
                        that.setData({
                              collegeName: JSON.parse(config.data).college[parseInt(res.data.collegeid) + 1],
                              publishinfo: res.data
                        })
                        // that.getSeller(res.data._openid, res.data.bookinfo._id)
                        that.getSeller(res.data._openid)
                  }
            })
      },
      //获取卖家信息
      getSeller(m, n) {
            let that = this;
            db.collection('user').where({
                  _openid: m
            }).get({
                  success: function(res) {
                        that.setData({
                              userinfo: res.data[0]
                        })
                        that.getBook(n)
                  }
            })
      },
      // //获取书本信息
      // getBook(e) {
      //       let that = this;
      //       db.collection('books').doc(e).get({
      //             success: function(res) {
      //                   that.setData({
      //                         bookinfo: res.data
      //                   })
      //             }
      //       })
      // },
      //回到首页
      home() {
            wx.switchTab({
                  url: '/pages/index/index',
            })
      },
     
      //路由
      go(e) {
            wx.navigateTo({
                  url: e.currentTarget.dataset.go,
            })
      },
    
      onShareAppMessage() {
            return {
                  title: this.data.publishinfo.title + '，快来看看吧',
                  path: '/pages/detail/detail?scene=' + this.data.publishinfo._id,
            }
      },
      
      //为了数据安全可靠，每次进入获取一次用户信息
      getuserdetail() {
            if (!app.openid) {
                  wx.cloud.callFunction({
                        name: 'regist', // 对应云函数名
                        data: {
                              $url: "getid", //云函数路由参数
                        },
                        success: re => {
                              db.collection('user').where({
                                    _openid: re.result
                              }).get({
                                    success: function(res) {
                                          if (res.data.length !== 0) {
                                                app.openid = re.result;
                                                app.userinfo = res.data[0];
                                                console.log(app)
                                          }
                                          console.log(res)
                                    }
                              })
                        }
                  })
            }
      },

      //客服跳动动画
      kefuani: function() {
            let that = this;
            let i = 0
            let ii = 0
            let animationKefuData = wx.createAnimation({
                  duration: 1000,
                  timingFunction: 'ease',
            });
            animationKefuData.translateY(10).step({
                  duration: 800
            }).translateY(0).step({
                  duration: 800
            });
            that.setData({
                  animationKefuData: animationKefuData.export(),
            })
            setInterval(function() {
                  animationKefuData.translateY(20).step({
                        duration: 800
                  }).translateY(0).step({
                        duration: 800
                  });
                  that.setData({
                              animationKefuData: animationKefuData.export(),
                        })
                        ++ii;
                  console.log(ii);
            }.bind(that), 1800);
      },
      onReady() {
            this.kefuani();
      }
})