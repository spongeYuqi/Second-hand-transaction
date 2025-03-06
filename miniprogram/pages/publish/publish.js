const db = wx.cloud.database();
const app = getApp();
const config = require("../../config.js");
Page({
      data: {
            systeminfo: app.systeminfo,
            entime: {
                  enter: 600,
                  leave: 300
            }, //进入褪出动画时长
            college: JSON.parse(config.data).college.splice(1),
            steps: [{
                        text: '步骤一',
                        desc: '扫描isbn码'
                  },
                  {
                        text: '步骤二',
                        desc: '补充图书信息'
                  },
                  {
                        text: '步骤三',
                        desc: '发布成功'
                  },
            ],
            categories: [
              { name: '书籍资料', days: 60 },
              { name: '学习用具', days: 60 },
              { name: '数码产品', days: 45 },
              { name: '衣物配饰', days: 45 },
              { name: '运动器材', days: 45 },
              { name: '寝具用品', days: 45 },
              { name: '委托合作', days: 3 },
              { name: '其他', days: 30 }
            ],
            selectedCategory: '', // 存储用户选择的类别
            isProductOrDemand: '', // 存储用户选择的商品或需求
            dura: 0, // 根据选择自动设定
            title: '', // 新增标题输入
            details: '', // 新增详情信息输入
            contactInfo: '', // 新增联系方式输入
            images: [], // 存储选择的图片路径
            maxImages: 4, // 最大图片数量
            price: 0, // 默认价格，注意这里用字符串形式以保留小数点格式
            showPopup: false, // 控制弹出层显示/隐藏
          
            
      },
      //恢复初始态
      initial() {
            let that = this;
            that.setData({
                  dura: 30,
                  price: 15,
                  place: '',
                  chooseDelivery: 0,
                  cids: '-1', //学院选择的默认值
                  isbn: '',
                  show_a: true,
                  show_b: false,
                  show_c: false,
                  active: 0,
                  chooseCollege: false,
                  note_counts: 0,
                  notes: '',
                  kindid: 0,
                  kind: [{
                        name: '通用',
                        id: 0,
                        check: true,
                  }, {
                        name: '专业',
                        id: 1,
                        check: false
                  }],
                  delivery: [{
                        name: '自提',
                        id: 0,
                        check: true,
                  }, {
                        name: '帮送',
                        id: 1,
                        check: false
                  }],
                  selectedCategory: '',
                  isProductOrDemand: '',
                  dura: 0,
                  
            })
      },
      onLoad() {
            this.initial();
            this.setData({ price: 0 });
      },
      // 图片上传逻辑
      chooseImage: function() {
        const that = this;
        const count = this.data.maxImages - this.data.images.length; // 计算还可以选择多少张图片
    
        wx.chooseImage({
          count: count,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success(res) {
            const tempFilePaths = res.tempFilePaths;
            that.setData({
              images: that.data.images.concat(tempFilePaths),
            });
          },
          fail() {
            // 如果用户取消选择图片，这里可以不做处理
          }
        });
      },
    
      deleteImage: function(e) {
        const index = e.currentTarget.dataset.index;
        let images = this.data.images;
        images.splice(index, 1); // 从数组中移除对应的图片
        this.setData({
          images: images,
        });
      },
    
      previewImage: function(e) {
        const index = e.currentTarget.dataset.index;
        const current = this.data.images[index];
        wx.previewImage({
          current: current,
          urls: this.data.images
        });
      },

  previewImage: function(e) {
    const index = e.currentTarget.dataset.index;
    const current = this.data.images[index];
    wx.previewImage({
      current: current,
      urls: this.data.images
    });
  },
  
// 显示数字输入框
// 显示数字输入框
showPriceInput() {
  this.setData({ showPopup: true }, () => {
    // 使用定时器延迟执行，确保弹出层已经渲染完成
    setTimeout(() => {
      const inputComponent = this.selectComponent('#priceInput');
      if (inputComponent) {
        inputComponent.focus();
      }
    }, 300); // 根据实际情况调整延迟时间
  });
},

// 隐藏数字输入框
hidePriceInput() {
  this.setData({ showPopup: false });
},

// 当输入价格时触发
onPriceInput(event) {
  let value = event.detail.value;
  
  // 如果输入的是空值，则保留默认值0
  if (value === '') value = 0;

  // 更新价格数据
  this.setData({ price: parseInt(value) });
},

// 在弹出层出现后尝试聚焦到输入框
onPopupAppear() {
  const inputComponent = this.selectComponent('#priceInput');
  if (inputComponent) {
    inputComponent.focus();
  }
},


      // 新增选择发布类型和类别的方法
chooseType(e) {
  const type = e.detail.value;
  this.setData({ isProductOrDemand: type });
},
chooseCategory(e) {
  const categoryIndex = e.detail.value;
  const selectedCategory = this.data.categories[categoryIndex];
  this.setData({
    selectedCategory: selectedCategory.name,
    dura: selectedCategory.days
  });
},

      
      confirm() {
            let that = this;
            if (!that.data.isProductOrDemand || !that.data.selectedCategory) {
              wx.showToast({
                title: '请选择发布类型和类别',
                icon: 'none'
              });
              return false;
            }
            // if (!app.openid) {
            //       wx.showModal({
            //             title: '温馨提示',
            //             content: '该功能需要注册方可使用，是否马上去注册',
            //             success(res) {
            //                   if (res.confirm) {
            //                         wx.navigateTo({
            //                               url: '/pages/login/login',
            //                         })
            //                   }
            //             }
            //       })
            //       return false
            // }
            // that.get_book(isbn);
              // 直接进入下一步骤，模拟已登录状态
  that.setData({
    show_a: false,
    show_b: true,
    active: 1,
  });
      },
      //查询书籍数据库详情
      get_book(bn) {
            let that = this;
            wx.showLoading({
                  title: '正在获取'
            })
            //先检查是否存在该书记录，没有再进行云函数调用
            db.collection('books').where({
                  isbn: bn
            }).get({
                  success(res) {
                        //添加到数据库
                        if (res.data == "") {
                              that.addbooks(bn);
                        } else {
                              wx.hideLoading();
                              that.setData({
                                    bookinfo: res.data[0],
                                    show_a: false,
                                    show_b: true,
                                    show_c: false,
                                    active: 1,
                              })
                        }
                  }
            })
      },
      //添加书籍信息到数据库
      addbooks(bn) {
            let that = this;
            wx.cloud.callFunction({
                  name: 'books',
                  data: {
                        $url: "bookinfo", //云函数路由参数
                        isbn: bn
                  },
                  success: res => {
                        if (res.result.body.status == 0) {
                              db.collection('books').add({
                                    data: res.result.body.result,
                                    success: function(res) {
                                          wx.hideLoading();
                                          that.setData({
                                                bookinfo: res.result.body.result,
                                                show_a: false,
                                                show_b: true,
                                                show_c: false,
                                                active: 1,
                                          })
                                    },
                                    fail: console.error
                              })
                        }
                  },
                  fail: err => {
                        console.error(err)
                  }
            })
      },
      //价格输入改变
      priceChange(e) {
            this.data.price = e.detail;
      },
      //时才输入改变
      duraChange(e) {
            this.data.dura = e.detail;
      },
      //地址输入
      placeInput(e) {
            console.log(e)
            this.data.place = e.detail.value
      },
      //书籍类别选择
      kindChange(e) {
            let that = this;
            let kind = that.data.kind;
            let id = e.detail.value;
            for (let i = 0; i < kind.length; i++) {
                  kind[i].check = false
            }
            kind[id].check = true;
            if (id == 1) {
                  that.setData({
                        kind: kind,
                        chooseCollege: true,
                        kindid: id
                  })
            } else {
                  that.setData({
                        kind: kind,
                        cids: '-1',
                        chooseCollege: false,
                        kindid: id
                  })
            }
      },
      //选择专业
      choCollege(e) {
            let that = this;
            that.setData({
                  cids: e.detail.value
            })
      },
      //取货方式改变
      delChange(e) {
            let that = this;
            let delivery = that.data.delivery;
            let id = e.detail.value;
            for (let i = 0; i < delivery.length; i++) {
                  delivery[i].check = false
            }
            delivery[id].check = true;
            if (id == 1) {
                  that.setData({
                        delivery: delivery,
                        chooseDelivery: 1
                  })
            } else {
                  that.setData({
                        delivery: delivery,
                        chooseDelivery: 0
                  })
            }
      },
      //输入备注
      noteInput(e) {
            let that = this;
            that.setData({
                  note_counts: e.detail.cursor,
                  notes: e.detail.value,
            })
      },
      //发布校检
      check_pub() {
            let that = this;
            //如果用户选择了专业类书籍，需要选择学院
            if (that.data.kind[1].check) {
                  if (that.data.cids == -1) {
                        wx.showToast({
                              title: '请选择学院',
                              icon: 'none',
                        });
                        return false;
                  }
            }
            //如果用户选择了自提，需要填入详细地址
            if (that.data.delivery[0].check) {
                  if (that.data.place == '') {
                        wx.showToast({
                              title: '请输入地址',
                              icon: 'none',
                        });
                        return false;
                  }
            }
            that.publish();
      },
// 发布逻辑
publish() {
  let that = this;
  if (!that.data.title || that.data.title.length > 10 || !that.data.price || !that.data.contactInfo || that.data.contactInfo.length > 20) {
    wx.showToast({
      title: '请检查标题、价格或联系方式',
      icon: 'none'
    });
    return false;
  }
  
  wx.showModal({
    title: '温馨提示',
    content: '经检测您填写的信息无误，是否马上发布？',
    success(res) {
      if (res.confirm) {
        db.collection('publish').add({
          data: {
            creat: new Date().getTime(),
            status: 0, // 状态等其他原有数据保持不变
            price: that.data.price,
            title: that.data.title,
            details: that.data.details,
            contactInfo: that.data.contactInfo,
            images: that.data.images, // 添加图片数组
            kindid: that.data.kindid, // 步骤一中选择的商品或需求类型
            category: that.data.selectedCategory, // 步骤一中选择的具体类别
            dura: that.data.dura, // 根据选择自动填充的时间
          },
          success(e) {
            that.setData({
              show_a: false,
              show_b: false,
              show_c: true,
              active: 2,
              detail_id: e._id
            });
            wx.pageScrollTo({ scrollTop: 0 });
          }
        })
      }
    }
  })
},
      detail() {
            let that = this;
            wx.navigateTo({
                  url: '/pages/detail/detail?scene=' + that.data.detail_id,
            })
      }
})