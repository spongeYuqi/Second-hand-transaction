// pages/about/about.js
Page({

      /**
       * 页面的初始数据
       */
      data: {
            des:'本人工科电气，爱艺术，爱技术，爱折腾，详情请移步我的底部个人网址,欢迎各位与我作朋友。\n\n此二手平台使用开源Github修改制作完善，完全免费使用，没有任何中间商赚差价。初衷即为了更方便我们校内进行绿色交换，大学生都不容易，希望小程序能够帮助我们能省就省，该花就花，大学期间积累起自己的资本，早日实现财富自由！\n\n由于非计算机，从产品设计到UI再到所有页面逻辑代码皆有本人一人修改测验完成，出现一些BUG应该也很正常，发现了请及时和本人反馈，请理解，希望我们共同努力！加油！。'
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function (options) {

      },

      onReady: function () {

      },
      //复制
      copy(e) {
            wx.setClipboardData({
                  data: e.currentTarget.dataset.copy,
                  success: res => {
                        wx.showToast({
                              title: '复制' + e.currentTarget.dataset.name + '成功',
                              icon: 'success',
                              duration: 1000,
                        })
                  }
            })
      },
      /**
       * 生命周期函数--监听页面显示
       */
      onShow: function () {

      },

      /**
       * 生命周期函数--监听页面隐藏
       */
      onHide: function () {

      },

      /**
       * 生命周期函数--监听页面卸载
       */
      onUnload: function () {

      },

      /**
       * 页面相关事件处理函数--监听用户下拉动作
       */
      onPullDownRefresh: function () {

      },

      /**
       * 页面上拉触底事件的处理函数
       */
      onReachBottom: function () {

      },

      /**
       * 用户点击右上角分享
       */
      onShareAppMessage: function () {

      }
})