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
                        desc: '选择标签'
                  },
                  {
                        text: '步骤二',
                        desc: '补充具体信息'
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
            price: '', // 默认为空字符串
            showPopup: false, // 控制弹出层显示/隐藏
            inputFocused: false, // 控制输入框是否自动聚焦
            
            
          
            
      },
      //恢复初始态
      initial() {
            let that = this;
            that.setData({
                  dura: 30,
                  price: '',
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
                  show_a: true, // 初始显示步骤一
                  show_b: false, // 初始不显示步骤二
                  active: 0, // 初始激活步骤一
                  
                  
            })
      },
      onLoad() {
            this.initial();
            //this.setData({ price: '0' });
      },

      // 步骤一新增选择发布类型和类别的方法
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

 

//步骤二上传逻辑

// 新增的事件处理函数
bindTitleInput(e) {
  this.setData({
    title: e.detail.value
  });
},

bindDetailsInput(e) {
  this.setData({
    details: e.detail.value
  });
},

bindContactInput(e) {
  this.setData({
    contactInfo: e.detail.value
  });
},
//图片
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
  this.setData({
    showPopup: true,
    inputFocused: true // 设置为true以自动聚焦
  }, () => {
    // 使用定时器延迟执行，确保弹出层已经渲染完成
    setTimeout(() => {
      const inputComponent = this.selectComponent('#priceInput');
      if (inputComponent) {
        inputComponent.focus(); // 手动调用focus方法
      }
    }, 300); // 根据实际情况调整延迟时间
  });
},

// 隐藏数字输入框
hidePriceInput() {
  this.setData({
    showPopup: false,
    inputFocused: false // 关闭自动聚焦
  });
},

// 当输入价格时触发
onPriceInput(event) {
  let value = event.detail.value;

  // 如果输入为空，直接设置为空字符串
  if (value === '') {
    this.setData({ price: '' });
    return;
  }

  // 去除整数部分的前导零
  if (value.includes('.')) {
    const [integerPart, decimalPart] = value.split('.');
    // 只有当整数部分不为0时才进行parseInt转换，避免将合法的0.开头的数字变为0
    const formattedIntegerPart = integerPart !== '0' ? parseInt(integerPart, 10).toString() : integerPart;
    value = formattedIntegerPart + '.' + decimalPart;
  } else {
    // 对于没有小数点的部分，仅当其不是0时才进行转换
    value = value !== '0' ? parseInt(value, 10).toString() : value;
  }

  // 更新价格数据
  this.setData({ price: value });
},

goToPreviousStep: function() {
  this.setData({
    show_a: true, // 显示步骤一
    show_b: false, // 隐藏步骤二
    active: 0 // 更新步骤条的激活状态为步骤一
  });
},



// 发布逻辑
publish() {
  let that = this;
  console.log('Title:', that.data.title);
  console.log('Price:', that.data.price);
  console.log('Contact Info:', that.data.contactInfo);
  if (!that.data.title || that.data.title.length > 20 || !that.data.price || !that.data.contactInfo || that.data.contactInfo.length > 20) {
    wx.showToast({
      title: '请检查标题、价格或联系方式',
      icon: 'none'
    });
    return false;
  }
  
  // wx.showModal({
  //   title: '温馨提示',
  //   content: '经检测您填写的信息无误，是否马上发布？',
  //   success(res) {
  //     if (res.confirm) {
  //       db.collection('publish').add({
  //         data: {
  //           creat: new Date().getTime(),
  //           status: 0, // 状态等其他原有数据保持不变
  //           price: that.data.price,
  //           title: that.data.title,
  //           details: that.data.details,
  //           contactInfo: that.data.contactInfo,
  //           images: that.data.images, // 添加图片数组
  //           kindid: that.data.kindid, // 步骤一中选择的商品或需求类型
  //           category: that.data.selectedCategory, // 步骤一中选择的具体类别
  //           dura: that.data.dura, // 根据选择自动填充的时间
  //         },
  //         success(e) {
  //           that.setData({
  //             show_a: false,
  //             show_b: false,
  //             show_c: true,
  //             active: 2,
  //             detail_id: e._id
  //           });
  //           wx.pageScrollTo({ scrollTop: 0 });
  //         }
  //       })
  //     }
  //   }
  // })

  // 省略数据库上传部分

  // 直接模拟成功发布后的状态更新
  wx.showModal({
    title: '温馨提示',
    content: '经检测您填写的信息无误，是否马上发布？',
    success(res) {
      if (res.confirm) {
        // 模拟发布成功后的状态更新
        that.setData({
          show_a: false,
          show_b: false,
          show_c: true,
          active: 2,
          // 可以为 detail_id 赋一个假值或者留空，根据您的需求
          // detail_id: '模拟ID' 
        });
        wx.pageScrollTo({ scrollTop: 0 });
      }
    }
  });
},
      detail() {
            let that = this;
            wx.navigateTo({
                  url: '/pages/detail/detail?scene=' + that.data.detail_id,
            })
      }
})