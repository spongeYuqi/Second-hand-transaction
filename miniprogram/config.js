var data = {
      //云开发环境id
      env: 'cloud1-2g1a3bn549ab3098',
      //分享配置
      share_title: '校园二手仓',
      share_img: '/images/sharehaoy.png', //可以是网络地址，本地文件路径要填绝对位置
      share_poster:'https://mmbiz.qpic.cn/sz_mmbiz_png/apmX6EUWe20TYicbibeicAoiaH0jlL3FMn63WvXPd4eSraz8ibMrN83U7ug6iagYcGwqDHj3bMicwr2apuntwaV7ykdGQ/640?wx_fmt=png&amp;from=appmsg',//必须为网络地址
      //客服联系方式
      kefu: {
            weixin: 'NECAxiaoqq',
            qq: '488372669',
            gzh: 'https://mmbiz.qpic.cn/sz_mmbiz_png/apmX6EUWe20TYicbibeicAoiaH0jlL3FMn632juoicwzotUMo0r76EZ5w4sLIqMo2JlJ1XkyZEibaAK5tL5XzPqh6lNA/640?wx_fmt=png&amp;from=appmsg', //公众号二维码必须为网络地址
            phone: '' //如果你不设置电话客服，就留空
      },
      //默认启动页背景图，防止请求失败完全空白 
      //可以是网络地址，本地文件路径要填绝对位置
      bgurl: '/images/startaa.png',
      //学院
      campus: [{
                  name: '矿业工程学院',
                  id: 0
            },
            {
                  name: '环境与化工学院',
                  id: 1
            },
            {
                  name: '安全工程学院',
                  id: 2
            },
            {
                  name: '电气与控制工程学院',
                  id: 3
            },
            {
                  name: '电子与信息工程学院',
                  id: 4
            },
            {
                  name: '机械工程学院',
                  id: 5
            },
            {
                  name: '材料科学与工程学院',
                  id: 6
            },
            {
                  name: '建筑工程学院',
                  id: 7
            },
            {
                  name: '计算机与信息工程学院',
                  id: 8
            },
            {
                  name: '管理学院',
                  id: 9
            },
            {
                  name: '经济学院',
                  id: 10
            },
            {
                  name: '人文社会科学学院',
                  id: 11
            },
            {
                  name: '马克思主义学院',
                  id: 12
            },
            {
                  name: '理学院',
                  id: 13
            },
            {
                  name: '外国语学院',
                  id: 14
            },
            {
                  name: '研究生学院',
                  id: 15
            },
            
            
      ],

      //性别
      gender: [{
            name: '女',
            id: 0
            
      },
      {
            name: '男',
            id: 1
            
      },
      
      
],
      //配置类别，建议不要添加太多，不然前端不好看
      college: [{
                  name: '书籍',
                  id: -1
            },
            {
                  name: '学具',
                  id: 0
            },
            {
                  name: '数码',
                  id: 1
            },
            {
                  name: '衣妆',
                  id: 2
            },
            {
                  name: '器材',
                  id: 3
            },
            {
                  name: '寝具',
                  id: 4
            },
            {
                  name: '委托',
                  id: 5
            },
            {
                  name: '其他',
                  id: 6
            },
            
      ],
}
//下面的就别动了
function formTime(creatTime) {
      let date = new Date(creatTime),
            Y = date.getFullYear(),
            M = date.getMonth() + 1,
            D = date.getDate(),
            H = date.getHours(),
            m = date.getMinutes(),
            s = date.getSeconds();
      if (M < 10) {
            M = '0' + M;
      }
      if (D < 10) {
            D = '0' + D;
      }
      if (H < 10) {
            H = '0' + H;
      }
      if (m < 10) {
            m = '0' + m;
      }
      if (s < 10) {
            s = '0' + s;
      }
      return Y + '-' + M + '-' + D + ' ' + H + ':' + m + ':' + s;
}

function days() {
      let now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      let day = now.getDate();
      if (month < 10) {
            month = '0' + month;
      }
      if (day < 10) {
            day = '0' + day;
      }
      let date = year + "" + month + day;
      return date;
}
module.exports = {
      data: JSON.stringify(data),
      formTime: formTime,
      days: days
}