// pages/model/index.js
const app = getApp();
const api = require('../mall/utils/api_util.js');
const api_store = require('../store/utils/api_util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexList: {},//首页的数据
    maninfo: {},//主体信息
    tabbar: {},//底部导航
    magId: '',//魔法页主键
    playIndex: null,
    play: true,//音频播放
    fileDomain: app.static_data.file_domain_url,
    focus: false,//文本框是否自动焦点
    controls: true,//是否显示默认控件,
    grouProduct: [],//团购的商品长度
    skList: [],//秒杀数据重组
    seckill: [],//秒杀数据
    groupList: [],//团购数据
    tabActive: 0,//当前的界面
    informations: [],//资讯数组
    markers: [],//地图图标
    isLoad: true,//预加载
    istatus: false,//魔法页是否启动
    selects: [],//下拉框数据
    formList: [],//表单的数组
    desc: [],//表单内容
    checkArr: [],//选中的复选框
    couponlist:[],//优惠券
    des: '立即领取',//优惠券状态
    staust: 0,//优惠券点击状态,
    tabType:1,//是否跳tab页
    videoHeight:0,
    videoWidth:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          videoHeight: parseInt(res.windowWidth * 0.75),
        });
      },
      fail: function (res) { 

      }
    });
    var magId = options.magId;
    var tabOne = options.tab;
    console.log("导航")
    console.log(tabOne)
    if (tabOne != 'undefined') {
      that.setData({
        tabActive: tabOne
      })
    }
    if (magId != undefined) {
      that.magicPage(magId);
      that.setData({
        magId: magId
      })
      var maninfo = app.globalData.maninfo;
      that.setData({
        maninfo: maninfo
      })
      app.common_util.setBarColor(maninfo.tone);
    } else {
      that.mainInfo();
    }
    //分销
    var type = options.type;
    var scene = decodeURIComponent(options.scene);
    if (scene !="undefined") {
      setTimeout(() => {
        that.brokeragerelation(scene);
      }, 500)
    }
    if (type==1) {
      var parentId = options.mid;
      var id = options.id;
      setTimeout(() => {
        that.brokeragerelation(parentId)
      }, 500)
      wx.navigateTo({
        url: '/pages/mall/detail/mall_detail?id=' + id
      })
    }
    app.userInfoReadyCallback = res => {
      that.mainInfo();
      that.get_notice();
      that.seckill();
      that.group();
      that.getInfos();
      that.getcouponList();
      console.log("启动")

      if (scene != "undefined") {
        that.brokeragerelation(scene);
        console.log(scene + "结束")
      }
    }
  },
  //插入分销关系
  brokeragerelation: function (parentId) {
    var that = this;
    var createUserId = app.globalData.createUserId;
    var childrenId = app.globalData.member.id;
    var appid = app.globalData.appid;
    var data = {
      'createUserId': createUserId,
      'parentId': parentId,
      'childrenId': childrenId,
      'appid': appid
    }
    //分销关系插入
    api.insertbrokeragerelation(data, '', function success(res) {
      if (res.errcode == 0) {
        console.log(res.result + "brokerage")
        var brokerage = res.result;
        wx.setStorage({
          key: 'brokerage',
          data: brokerage,
        })
      }
    }, function fail(res) {

    })
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

  /*获取主体信息*/
  mainInfo: function () {
    var that = this;
    app.api_util.mainInfo({}, "加载中...", function sussess(res) {
      if (res.errcode == 0) {
        var maninfo = res.result;
        if (maninfo!=''){
        app.globalData.maninfo = res.result;
        app.globalData.isPayPattern = maninfo.isPayPattern;
        app.globalData.appid = maninfo.appid;
        app.globalData.createUserId = maninfo.createUserId;
        app.common_util.setBarColor(maninfo.tone);
        wx.setNavigationBarTitle({
          title: maninfo.page.name
        })
        wx.setStorageSync('maninfo', maninfo);
        var content = JSON.parse(maninfo.page.content);
        console.log(content);
        if (maninfo.page.status == 1) {
          that.setData({
            indexList: content,
            istatus: false
          })
        }
        else {
          that.setData({
            indexList: [],
            istatus:true
          })
        }

        var magicList = that.data.indexList;
        var tab = '';
        var markers = [];
          for (var i = 0; i < magicList.list.length; i++) {
            var l = magicList.list[i];
            if (l.module == 'navigation') {
              tab = l.data;
              var t='';
              for(var y=0;y<tab.info.length;y++){
                 t = tab.info[0].code;
              }
              that.setData({
                tabActive:t
              })
              wx.setStorageSync('tabbar', tab)
            }
            if (l.module == 'dial') {
              app.globalData.kfMobile = l.data.info.text;
            }
            if (l.module == 'map') {
              var m = {
                longitude: l.data.info.longitude,
                latitude: l.data.info.latitude
              }
              markers.push(m);
            }
            if (l.module == 'product') {
              that.getShopData(l);
            }
            if (l.module == 'form') {
              that.getForms(l);
            }

          }
          that.setData({
            maninfo: maninfo,
            indexList: magicList,
            tabbar: tab,
            markers: markers,
            isLoad: false
          })
      }
        that.setData({
          maninfo:'',
          isLoad: false
        })
      }
    }, function fail(res) {

    })
  },
  /*获取魔法页*/
  magicPage: function (mid) {
    var that = this;
    app.api_util.magicPage(mid, "", function sussess(res) {
      if (res.errcode == 0) {
        var list = res.result;
        if (list != '') {
        wx.setNavigationBarTitle({
          title: list.name
        })
        wx.setStorageSync('magic', list);
        var content = JSON.parse(list.content);
        console.log(content);
        if (list.status == 1) {
          that.setData({
            indexList: content,
            istatus: false
          })
        }
        else {
          that.setData({
            indexList: [],
            istatus:true
          })
        }
        var markers = [];
        var magicList = that.data.indexList;
        var tab = '';
        var markers = [];
          for (var i = 0; i < magicList.list.length; i++) {
            var l = magicList.list[i];
            if (l.module == 'navigation') {
              tab = l.data;
              wx.setStorageSync('tabbar', tab)
            }
            if (l.module == 'dial') {
              app.globalData.kfMobile = l.data.info.text;
            }
            if (l.module == 'map') {
              var m = {
                longitude: l.data.info.longitude,
                latitude: l.data.info.latitude
              }
              markers.push(m);
            }
            if (l.module == 'product') {
              that.getShopData(l);
            }
            if (l.module == 'form') {
              that.getForms(l);
            }

          }
          if (tab == '') {
            tab = wx.getStorageSync('tabbar');
          }
          console.log("导航")
          console.log(tab)
          that.setData({
            indexList: magicList,
            tabbar: tab,
            markers: markers,
            isLoad: false,
          })
        }
      }
    }, function fail(res) {

    })
  },
  //获取商品的数据
  getShopData: function (p) {
    var that = this;
    var data = {
      type: p.data.info.type
    }
    if (data.type == 1) {
      data.desc = p.data.info.typeDesc
    } else {
      data.desc = (p.data.info.list).toString();
    }
    api.shopData(data, '', function success(res) {
      if (res.errcode == 0) {
        var shop = res.result;
        if (shop.length > 0) {
          for (var n = 0; n < shop.length; n++) {
            var l = shop[n];
            var s = l.imageIds.split(",");
            l.imageIds = s[0];
          }
        }
        var indexList = that.data.indexList;
        for (var i = 0; i < indexList.list.length; i++) {
          var l = indexList.list[i];
          if (p.code == l.code) {
            l.data.shopList =shop;
            break;
          }
        }
        that.setData({
          indexList: indexList
        })
      }
    }, function fail(res) {

    })
  },
  //获取资讯列表
  getInfos: function () {
    var that = this;
    api_store.getinformations({}, '', function (res) {
      console.log(res);
      if (res.errcode == 0) {
        var r = res.result;
        that.setData({
          informations: r
        });
      }
    }, function (res) {
    });
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
      url: "/pages/store/discover/discover",
    })
  },
  /*快捷入口*/
  goQuick: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    var desc = e.currentTarget.dataset.desc;
    //跳转小程序
    if (type == 5) {
      wx.navigateToMiniProgram({
        appId: desc,
        path: '',
        extraData: {
          foo: 'bar'
        },
        envVersion: 'develop',
        success(res) {

        }
      })
    }
    //功能链接
    if (type == 3) {
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
      else if (desc == 103) {
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
          url: '/pages/store/discover/discover',
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
      else if (desc == 210) {
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
    else if (type == 2) {
      var tab = e.currentTarget.dataset.tab;
      console.log(tab + "tab")
      if (tab != undefined) {
          wx.redirectTo({
            url: '/pages/model/index?magId=' + desc + '&tab=' + tab+"&tabType=1"
          })
      } else {
        wx.navigateTo({
          url: '/pages/model/index?magId=' + desc + "&tabType=2"
        })
      }
      wx.setStorageSync('magId', desc)
    }
    else if(type==1){
      that.previewImage(e);
    }
  },
  //返回首页
  goHome: function () {
    wx.redirectTo({
      url: '/pages/model/index'
    })
  },
  // 图片点击事件
  previewImage: function (e) {
    var that = this;
    var srcList = [];
    var nowImgUrl = e.currentTarget.dataset.src;
    wx.previewImage({
      current: [nowImgUrl], // 当前显示图片的http链接
      urls: [nowImgUrl] // 需要预览的图片http链接列表
    })
  },
  //团购/秒杀更多
  goGroup: function (e) {
    var stype = e.currentTarget.dataset.type;
    if (stype == 2) {
      wx.navigateTo({
        url: '/pages/marketing/seckill/seckill?stype=' + stype,
      })
    }
    else {
      wx.navigateTo({
        url: '/pages/marketing/group/group?stype=' + stype
      })
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
        that.setData({
          skList: sks
        })

      }
    }, function fail(res) {

    });
  },
  //去秒杀
  goMarkProduct: function (e) {
    var that = this;
    var stype = e.currentTarget.dataset.type;
    var id = e.currentTarget.dataset.id;
    var skid = e.currentTarget.dataset.skid;//秒杀id
    var isStart = e.currentTarget.dataset.start;//是否开始  1、开始 2、预告
    var sklist = {};
    var list = [];
    if (stype == 2) {
      list = that.data.seckill;
    } else if (stype == 3) {
      list = that.data.groupList;
    }
    for (var i = 0; i < list.length; i++) {
      if (list[i].id == skid) {
        sklist = list[i];
        console.log(sklist + "sk")
      }
    }
    wx.setStorageSync('sklist', sklist);
    wx.navigateTo({
      url: '/pages/mall/detail/mall_detail?stype=' + stype + '&id=' + id + '&skid=' + skid + '&isStart=' + isStart,
    })
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
  //获取表单数据
  getForms: function (p) {
    var that = this;
    var formIds = p.data.info.list;
    var ids = [];
    if (formIds.length > 0) {
      for (var i = 0; i < formIds.length; i++) {
        ids.push(formIds[i].id);
      }
    }
    var data = {
      ids: ids.toString()
    }
    app.api_util.formsData(data, '', function success(res) {
      if (res.errcode == 0) {
        var selects = [];
        var arr = [];
        var indexList = that.data.indexList;
        for (var i = 0; i < indexList.list.length; i++) {
          var l = indexList.list[i];
          if (p.code == l.code) {
            var list = res.result;
            for (var n = 0; n < list.length; n++) {
              var f = list[n];
              arr.push({ id: f.id, name: f.name, value: '' });
              if (f.desc != '') {
                if (f.type == 6) {
                  selects = (f.desc).split("/")
                }
                var s = (f.desc).split("/");
                var a = [];
                for (var y = 0; y < s.length; y++) {
                  var sdata = {
                    desc: s[y],
                    check: 0
                  }
                  a.push(sdata);
                }
                f.descList = a;
              }

            }
            l.data.formList = list;
            break;
          }
        }
        that.setData({
          indexList: indexList,
          selects: selects,
          desc: arr
        })
        console.log(that.data.desc)
      }
    }, function fail(res) {

    })
  },

  //获取文本框内容
  getInput: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var value = e.detail.value;
    console.log(value + "getInput")
    var desc = that.data.desc;
    if (desc.length != 0) {
      for (var i = 0; i < desc.length; i++) {
        var fid = desc[i].id;
        if (fid == id) {
          if (value != '') {
            desc[i].value = value;
          }
          else {
            desc[i].value = '';
          }
        }
      }
    }
    that.setData({
      desc: desc
    })
  },
  //获取下拉框的内容
  bindCasPickerChange: function (e) {
    var that = this;
    var desc = that.data.desc;
    var id = e.currentTarget.dataset.id;
    var value = that.data.selects[e.detail.value];
    if (desc.length != 0) {
      for (var i = 0; i < desc.length; i++) {
        var fid = desc[i].id;
        if (fid == id) {
          if (value != '') {
            desc[i].value = value;
          }
          else {
            desc[i].value = '';
          }
        }
      }
    }
    that.setData({
      casIndex: e.detail.value,
      desc: desc
    })
  },
  //复选框按钮
  checked: function (e) {
    var that = this;
    var status = false;
    var id = e.currentTarget.dataset.id;
    var select = e.currentTarget.dataset.select;
    var index = e.currentTarget.dataset.index;
    var value = e.currentTarget.dataset.desc;
    var type = e.currentTarget.dataset.type;
    var desc = that.data.desc;
    var indexList = that.data.indexList;
    for (var i = 0; i < indexList.list.length; i++) {
      var l = indexList.list[i];
      if (l.module == 'form') {
        var f = l.data.formList;
        if (f.length > 0) {
          for (var y = 0; y < f.length; y++) {
            if (f[y].desc != '') {
              if (id == f[y].id) {
                for (var x = 0; x < f[y].descList.length; x++) {
                  var dl = f[y].descList[x];
                    //单选
                    if(type==4){
                      if (index == x) {
                      if (select == 1 && select == dl.check){
                        dl.check = 0;
                      } else {
                        dl.check = 1;
                        status = true;
                      }
                      }else{
                        dl.check = 0;
                      }
                    }
                     //复选框
                  else{
                      if (index == x) {
                        if (select == 1 && select == dl.check) {
                          dl.check = 0;
                        } else {
                          dl.check = 1;
                        }
                      }
                  }
                
                }
              }
            }
          }
        }
      }
    }
    console.log(indexList);
    that.setData({
      indexList: indexList,
      desc: desc
    })
  },
  //提交表单数据
  saveForm: function () {
    var that = this;
    var magicPageId = that.data.magId;
    if (magicPageId==''){
      magicPageId=app.globalData.maninfo.page.id;
    }
    var memberId = app.globalData.member.id;
    var indexList = that.data.indexList;
    var desc=that.data.desc;
    var arr = [];
    for (var i = 0; i < indexList.list.length; i++) {
      var l = indexList.list[i];
      if (l.module == 'form') {
        var f= l.data.formList;
        if (f.length > 0) {
          for (var y = 0; y < f.length; y++) {
            for (var n = 0; n < desc.length; n++) {
              if (desc[n].id == f[y].id) {
                if (f[y].isRequiRed == 1) {
                  if (desc[n].value == '') {
                    app.toast.warn(desc[n].name + '不能为空', 1500);
                    return false;
                  }
                }
              }
            }
            console.log(f[y].desc +"f[y].desc")
               if (f[y].desc!=''){
                  for (var m = 0; m < f[y].descList.length;m++){
                    var d = f[y].descList[m];
                    var rarr = [];
                    if (d.check==1){
                      if (f[y].type==4){
                        rarr.push(d.desc);
                      }else{
                        arr.push(d.desc);
                      }
                      for (var n = 0; n < desc.length; n++) {
                      if (desc[n].id == f[y].id) {
                        if (f[y].type==4){
                          desc[n].value = rarr.toString();
                        }
                        else{
                          desc[n].value = arr.toString();
                        }
                        }
                      }
                    }
                  
               }
            }
              }
          } 
      }
    }
    var descs = JSON.stringify(desc);
    var data = {
      magicPageId: magicPageId,
      memberId: memberId,
      desc: descs
    }
    app.api_util.SaveFormsData(data, '', function success(res) {
      if (res.errcode == 0) {
        app.toast.success('提交成功', 1500);
        wx.redirectTo({
          url: '/pages/model/index'
        })
      } else {
        app.toast.error('提交失败', 1500);
      }

    }, function fail(res) {
      app.toast.error('提交失败', 1500);
    })
  },
  //跳转商品详情
  goDetail: function (e) {
    var id = e.currentTarget.id;
    if (id != '') {
      wx.navigateTo({
        url: '/pages/mall/detail/mall_detail?id=' + id
      })
    }
  },
  //资讯详情
  goInfoDetail: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/store/discDetail/discDetail?id=' + id
    })
  },
  //获取优惠卷列表
  getcouponList: function () {
    var that = this;
    var memberId = app.globalData.member.id;
    api.getcouponlist({ memberId: memberId }, '加载中...', function success(res) {
      if (res.errcode == 0) {
        var list = res.result;
        for (var i = 0; i < list.length; i++) {
          var item = list[i];
          var endTime = (item.endTime).split(' ');
          var startTime = (item.startTime).split(' ');
          item.end = endTime[0];
          item.start = startTime[0];
          item.des = '立即领取';
          item.disabled = false;
        }
        that.setData({
          couponlist: list
        })
      }
    }, function fail(res) {
      app.toast.warn("网络异常", 1000);
    })
  },

  //领取优惠卷
  addcoupon: function (e) {
    var that = this;
    var couponId = e.currentTarget.dataset.id;
    var inNumber = e.currentTarget.dataset.inNumber;
    var outNumber = e.currentTarget.dataset.outNumber;
    var memberId = app.globalData.member.id;
    var appid=app.globalData.appid;
    var data = {
      'couponId': couponId,
      'memberId': memberId,
      'appid': appid
    }
    api.insertcouponuser(data, '', function success(res) {
      if (res.errcode == 0) {
        app.toast.success("领取成功", 1500);
        var list = that.data.list;
        for (var i = 0; i < list.length; i++) {
          var item = list[i];
          item.disabled = true;
        }
        that.setData({ 

          
          couponlist: list
        });
        that.getcouponList();

      } else {
        app.toast.error("领取失败", 1500);
      }
    }, function fail(res) {
      app.toast.warn("网络异常", 1500);
    })

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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.get_notice();
    that.seckill();
    that.group();
    that.getInfos();
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
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    if (that.data.magId == undefined) {
      that.mainInfo();
    } else {
      that.magicPage(that.data.magId)
    }
    wx.stopPullDownRefresh()
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