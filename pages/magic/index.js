// pages/model/index.js
const app=getApp();
const api = require('../mall/utils/api_util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  indexList:{},//首页的数据
  maninfo:{},//主体信息
  play: true,//音频播放
  mid:'',//魔法页主键
  tabbar:{},//底部导航
  playIndex: null,
  fileDomain: app.static_data.file_domain_url,
  focus:false,//文本框是否自动焦点
  controls: true,//是否显示默认控件,
  grouProduct: [],//团购的商品长度
  skList: [],//秒杀数据重组
  seckill: [],//秒杀数据
  groupList: [],//团购数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var mid=options.mid;
    that.magicPage(mid);
    var maninfo = app.globalData.maninfo;
    app.common_util.setBarColor(maninfo.tone);
    that.setData({
      maninfo:maninfo,
      mid:mid
    })
    console.log(mid+"mid")
    // that.get_notice();
    // that.seckill();
    // that.group();
  },

  // 点击cover播放，其它视频结束
  videoPlay: function (e) {
    var that = this;
    var id = e.currentTarget.id
    console.log(that.data.playIndex, id) // 当前播放与当前点击
    if (!that.data.playIndex) { // 没有播放时播放视频
      that.setData({
        playIndex: id
      })
      var videoContext = wx.createVideoContext('index' + id)
      videoContext.play()
    } else {                    // 有播放时先将prev暂停到0s，再播放当前点击的current
      var videoContextPrev = wx.createVideoContext('index' + that.data.playIndex)
      videoContextPrev.seek(0)
      videoContextPrev.pause()
      this.setData({
        playIndex: id
      })
      var videoContextCurrent = wx.createVideoContext('index' + that.data.playIndex)
      videoContextCurrent.play()
    }
  },

  /*获取魔法页*/
  magicPage: function (mid) {
    var that = this;
    app.api_util.magicPage(mid,"", function sussess(res) {
      if (res.errcode == 0) {
        var list=res.result;
        wx.setNavigationBarTitle({
          title: list.name
        })
        wx.setStorageSync('magic', list);
        var content = JSON.parse(list.content);
        var tab = '';
        if (content.list.length > 0) {
          for (var i = 0; i < content.list.length; i++) {
            var l = content.list[i];
            if (l.module == 'navigation') {
              tab = l.data;
            }
          }
        }
        app.globalData.tabbar = tab;
        console.log(content +"magic");
        that.setData({
          indexList: content,
          tabbar: tab
        })
      }
    }, function fail(res) {

    })
  },
  //资讯详情
  goInfoDetail: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/mall/infodetail/infodetail?id=' + id
    })
  },
  /*搜索*/
  goSearch: function () {
    var title = this.data.searchName;
    if (title != '') {
      wx.navigateTo({
        url: '/pages/mall/list/shopList?likeTitle=' + title + '&stuats=2',
      })
    } else {
      app.toast.warn("请输入搜索的商品名", 1000);
    }
  },
  /*获取搜索框的内容*/
  bindSearch: function (e) {
    var value = e.detail.value;
    if (value > 0 || value.length > 0) {
      this.setData({
        searchName: value,
      })
    }
  },
  /*获取当前坐标地理位置*/
  getlocation: function (e) {
    var that = this;
    var latitude = e.currentTarget.dataset.latitude;
    var longitude = e.currentTarget.dataset.longitude;
    var address = e.currentTarget.dataset.address;
    var indexDesc = e.currentTarget.dataset.name;
    console.log(latitude + longitude);
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var speed = res.speed;
        var accuracy = res.accuracy;
        wx.openLocation({
          latitude: Number(latitude),
          longitude: Number(longitude),
          scale: 23,
          address: '' + address + '',
          name: indexDesc
        })
      }
    })
  },
  /*联系我们*/
  goCall: function (e) {
    var that = this;
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    }, function sussess(res) {

    }, function fail(res) {

    })
  },
  /*店铺公告*/
  goNotice: function () {
    wx.navigateTo({
      url: '/pages/mall/notice/noticeList'
    })
  },
  //更多资讯
  goInfo: function () {
    wx.navigateTo({
      url: "/pages/mall/information/information",
    })
  },
  /*快捷入口*/
  goQuick: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    var desc = e.currentTarget.dataset.desc;

    //功能链接
    if(type==3){
       //秒杀
      if (desc == 100) {
        wx.navigateTo({
          url: '/pages/marketing/seckill/seckill?stype=' + 2,
        })
      }
      //拼团
      else if (desc == 101) {
        wx.navigateTo({
          url: '/pages/marketing/group/group?stype=' + 3
        })
      }
      //砍价
      else if (desc == 102) {
       
      }
      //优惠卷
      else if (desc == 103){
        wx.navigateTo({
          url: '/pages/marketing/coupon/coupon'
        })
      }
      //积分
      else if (desc == 104) {
        wx.navigateTo({
          url: '/pages/marketing/integral/integral',
        })
      }
      //分销
      else if (desc == 105) {
        wx.navigateTo({
          url: '/pages/marketing/myCampaign/myCampaign',
        })
      }
      //资讯
      else if (desc == 106) {
        wx.navigateTo({
          url: '/pages/mall/information/information',
        })
      }
      //分类
      else if (desc == 206) {
        wx.navigateTo({
          url: '/pages/mall/classify/page',
        })
      }
      //订单
      else if (desc == 207) {
        wx.navigateTo({
          url: '/pages/user/mineOrder/orderItems?id=' + 1
        })
      }
      //促销
      else if (desc == 208) {
        wx.navigateTo({
          url: '/pages/mall/list/shopList'
        })
      }

      //消息
      else if (desc == 209) {
        wx.navigateTo({
          url: '/pages/mall/message/message'
        })
      }
      //购物车
      else if (desc ==210) {
        wx.navigateTo({
          url: '/pages/mall/scart/page'
        })
      }
      //会员卡
      else if (desc == 211) {
        wx.navigateTo({
          url: '/pages/mall/member/member'
        })
      }
      //在线咨询
      else if (desc == 213) {
        wx.navigateTo({
          url: '/pages/mall/consulting/consulting'
        })
      }
      //收获地址
      else if (desc == 214) {
        wx.navigateTo({
          url: '/pages/mall/address/address'
        })
      }
      //个人中心
      else if (desc == 215) {
        wx.navigateTo({
          url: '/pages/user/storeUser/storeUser'
        })
      }
    }
    //魔法页
    else if(type==2){
      wx.navigateTo({
        url: '/pages/magic/index?mid='+desc
      })
      console.log(desc)
    }
  },
  //公告渲染
  get_notice: function () {
    var that = this;
    api.getNoticeList("", function success(res) {
      if (res.errcode == 0) {
        that.setData({
          notice: res.result
        })
      }
      console.log(res.result + "notice");
    }, function fail(res) {

    });
    },
  //获取置顶秒杀
  seckill: function () {
    var that = this;
    api.seckill({}, "", function success(res) {
      if (res.errcode == 0) {
        var sk = [];
        var skList = res.result;
        that.setData({
          seckill: res.result
        })
        for (var i = 0; i < skList.length; i++) {
          var s = skList[i];
          var p = s.products;
          if (p.length > 0) {
            for (var j = 0; j < p.length; j++) {
              p[j].aid = s.id;
              sk.push(p[j]);
            }
          }
        }
        var sks = [];
        var s = new Array;
        for (var n = 0; n < sk.length; n++) {
          s.push(sk[n]);
          if (s.length == 3) {
            sks.push(s);
            s = new Array;
          }
        }
        var k = sk.length % 3;
        console.log(k);
        if (k > 0) {
          for (var m = 1; m < k; m++) {
            s.push(sk[sk.length - m]);
          }
          sks.push(s);
        }


        console.log("获取置顶秒杀");
        console.log(sks);
        that.setData({
          skList: sks
        })

      }
    }, function fail(res) {

    });
  },
  //获取置顶团购
  group: function () {
    var that = this;
    api.group({}, "", function success(res) {
      if (res.errcode == 0) {
        var list = res.result;
        var sp = [];
        for (var i = 0; i < list.length; i++) {
          var s = list[i];
          var p = s.products;
          if (p.length > 0) {
            for (var j = 0; j < p.length; j++) {
              sp.push(p[j]);
            }
          }
        }

        that.setData({
          groupList: list,
          grouProduct: sp
        })
        console.log(that.data.grouProduct.length + 'sp')
      }
    }, function fail(res) {

    });
  },
  //播放音频
  audioPlay: function () {
    var that = this;
    if (that.data.play == true) {
      that.audioCtx.pause();
      that.setData({
        play: false
      })
    }
    else {
      that.audioCtx.play();
      that.setData({
        play: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio');
    that.audioCtx.play();
  },
  onLaunch:function(){
 
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var mid=this.data.mid;
    this.magicPage(mid);
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