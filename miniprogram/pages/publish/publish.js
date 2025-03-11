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
              { name: '书籍资料', days: 60 , id: -1 },
              { name: '学习用具', days: 60 , id: 0  },
              { name: '数码产品', days: 45 , id: 1  },
              { name: '衣饰化妆', days: 45 , id: 2  },
              { name: '运动器材', days: 45 , id: 3  },
              { name: '寝具用品', days: 45 , id: 4  },
              { name: '委托合作', days: 3 , id: 5   },
              { name: '其他', days: 30 , id: 6 }
            ],
            selectedCategory: '', // 存储用户选择的类别
            isProductOrDemand: '', // 存储用户选择的商品或需求
            cids: '-1', //学院选择的默认值
            dura: 0, // 根据选择自动设定
            details: '', // 新增详情信息输入
            contactInfo: '', // 新增联系方式输入
            images: [], // 存储选择的图片路径
            maxImages: 4, // 最大图片数量
            price: '', // 默认为空字符串
            showPopup: false, // 控制弹出层显示/隐藏
            inputFocused: false // 控制输入框是否自动聚焦
      },
      //恢复初始态
      initial() {
            let that = this;
            that.setData({
                  price: '',
                  selectedCategory: '',
                  isProductOrDemand: '',
                  cids: '-1', //学院选择的默认值
                  details: '',
                  contactInfo: '',
                  images: [],
                  show_a: true, // 初始显示步骤一
                  show_b: false, // 初始不显示步骤二
                  show_c: false,// 初始不显示步骤三
                  active: 0 // 初始激活步骤一
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
    cids:selectedCategory.id,
    selectedCategory: selectedCategory.name,
    dura: selectedCategory.days
  });
},

      
      confirm() {
        console.log("开始执行 confirm 方法");
        //console.log("当前的 openid: ", app.openid);
            let that = this;
           
            if (!that.data.isProductOrDemand || !that.data.selectedCategory) {
              wx.showToast({
                title: '请选择发布类型和类别',
                icon: 'none'
              });
              
              return false;
            }
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
            //console.log("所有条件已满足，准备继续执行");
            
              // 直接进入下一步骤，模拟已登录状态
  that.setData({
    show_a: false,
    show_b: true,
    active: 1,
  });
      },

 

//步骤二上传逻辑

// 新增的事件处理函数

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
      // 上传每一张选中的图片
      Promise.all(tempFilePaths.map(tempFilePath => 
        wx.cloud.uploadFile({
          cloudPath: `your-folder-name/${Date.now()}-${Math.floor(Math.random(0, 1)*1000)}.png`, // 根据需要设置文件路径和名称
          filePath: tempFilePath,
        })
      )).then(results => {
        const fileIds = results.map(result => result.fileID);
        that.setData({
          images: that.data.images.concat(fileIds), // 将fileID存入images数组
        });
      }).catch(error => {
        console.error('图片上传失败:', error);
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

  // 检查并处理输入值
  if (/^\.\d$/.test(value)) { // 如果以单个小数点开头并跟随一个数字，在前面补0
    value = '0' + value;
  } else if (value.includes('.')) { // 包含小数点的情况
    const [integerPart, decimalPart] = value.split('.');
    
    // 整数部分不能超过4位
    let formattedIntegerPart = integerPart;
    if (integerPart.length > 6) {
      formattedIntegerPart = integerPart.substring(0, 6); // 只保留前4位
    }
    // 小数部分不能超过1位
    let formattedDecimalPart = decimalPart.length > 1 ? decimalPart.substring(0, 1) : decimalPart;

    // 合并整数和小数部分
    value = formattedIntegerPart + '.' + formattedDecimalPart;
  } else { // 不包含小数点的部分
    // 整数部分长度限制为4位
    if (value.length > 6) {
      value = value.substring(0, 6); // 只保留前4位
    }
    value = parseInt(value, 10).toString(); // 转换为整数后转回字符串
  }

  // 更新价格数据
  this.setData({ price: value }, () => {
    // 确保即使输入不合规，界面也反映正确的值
    const currentPrice = this.data.price;
    if (currentPrice && currentPrice.includes('.')) {
      const [integerPart, decimalPart] = currentPrice.split('.');
      if (decimalPart.length > 1) {
        // 如果小数部分超过了1位，则调整它
        this.setData({ price: `${integerPart}.${decimalPart.substring(0, 1)}` });
      }
    }
  });
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

  // 检查是否已经获取了用户的openid
  if (!app.openid) {
    wx.showToast({
      title: '请先登录',
      icon: 'none'
    });
    return;
  }

  // 使用openid从user集合中获取用户的昵称
  db.collection('user').where({
    _openid: app.openid
  }).get({
    success: function(res) {
      if (res.data.length > 0) { // 确保找到了用户数据
        const nickname = res.data[0].Nickname; // 假设字段名为Nickname，请根据实际情况修改
        const xinbie = res.data[0].gender.id;
        // 继续进行发布的逻辑
        if (!that.data.details || that.data.details.length > 210 || !that.data.price || !that.data.contactInfo || that.data.contactInfo.length > 20) {
          wx.showToast({
            title: '请检查详情、价格或联系方式',
            icon: 'none'
          });
          return false;
        }
        wx.showModal({
          title: '温馨提示',
          content: '请确保您填写的信息无误，是否马上发布？',
          success(res) {
            if (res.confirm) {
              db.collection('publish').add({
                data: {
                  type: that.data.isProductOrDemand == 'demand' ? '需求':'商品',
                  category: that.data.selectedCategory,
                  collegeid: that.data.cids,
                  details: that.data.details,
                  contactInfo: that.data.contactInfo,
                  images: that.data.images,
                  price: that.data.price,
                  createTime: db.serverDate(),
                  nickname: nickname, // 添加用户昵称
                  openid: app.openid, // 确保openid也被上传
                  gender: xinbie,
                  //campus: that.data.campus,
                  dura: new Date().getTime() + that.data.dura * (24 * 60 * 60 * 1000),
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
                },
                fail(err) {
                  console.error('发布失败:', err);
                  wx.showToast({
                    title: '发布失败，请重试',
                    icon: 'none'
                  })
                }
              })
            }
          }
        });
      } else {
        wx.showToast({
          title: '未找到用户信息，请检查登录状态',
          icon: 'none'
        });
      }
    },
    fail: function(err) {
      console.error('获取用户信息失败:', err);
      wx.showToast({
        title: '获取用户信息失败，请稍后再试',
        icon: 'none'
      });
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