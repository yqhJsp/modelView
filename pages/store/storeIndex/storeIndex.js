// pages/site/storeIndex/storeIndex.js
const app=getApp();
const api = require('../utils/api_util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    store:{},//门店信息
    sid:0,//门店ID
    tag:[],//标签
    images:[],
    article: {},//详情
    couponlist: [],//优惠卷
    animationData: {},//选择动画
    isCoupon: 0,//隐藏优惠卷弹窗
    showModalStatus: false,//显示遮罩
    member:{},
    maninfo:{},
    appid:'',
    showModalStatus: false,//显示遮罩
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var that=this;
  var id=options.id;
  that.setData({
    sid:id
  })
  var maninfo = app.globalData.maninfo;
  var member = app.globalData.member;
  var appid = app.globalData.appid;
  app.common_util.setBarColor(app.globalData.maninfo.tone);
  that.setData({
    maninfo: maninfo,
    member: member,
    appid:appid,
    sid: id
  });
  that.getStoreData(id);
  },
  //获取数据
  getStoreData:function(id){
    var that=this;
    api.childrenbyid({ id: id }, '加载中...', function success(res){
      if (res.errcode==0){
        var data=res.result;
        wx.setStorage({
          key: 'storeList',
          data: res.result,
        })
        var tag = (res.result.tag).split(",");
        var article = res.result.brief;
          that.setData({
            store: data,
            tag: tag,
            article: app.WxParse.wxParse('article', 'html', article, that, 0)          
          })
        
      }
    },function fail(res){
      
    })
  },
  getCoupon: function (data) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
    })
    animation.translateY(0).step()

    this.animation = animation
    that.setData({
      showModalStatus: true,//显示遮罩       
      animationData: animation.export()
    })
    that.setData({//把选中值，放入判断值中
      isCoupon: 1,
    })
  },
  /*隐藏 */
  hideModal: function (data) {
    var that = this;
    that.setData({//把选中值，放入判断值中
      showModalStatus: false,//显示遮罩       
      isCoupon: 0
    })
  },
  //优惠券列表
  couponlist: function (id) {
    var that = this;
    var memberId = that.data.member.id;
    api.couponlist({ memberId: memberId, childrenInfoId:id}, '加载中..', function success(res) {
          if (res.errcode == 0) {
            that.setData({
              couponlist: res.result,
            })
            var list = that.data.couponlist;
            if (list.length > 0) {
              for (var i = 0; i < list.length; i++) {
                var l = list[i];
                var endTime = (l.endTime).split(' ');
                console.log(endTime + "lll")
                var startTime = (l.startTime).split(' ');
                l.end = endTime[0];
                l.start = startTime[0];
              }
            }
            that.setData({
              couponlist: list
            })
          }

        }, function fail(res) {

        })
  },
  //领取优惠卷
  addcoupon: function (e) {
    var that = this;
    var couponId = e.currentTarget.dataset.idx;
    var memberId = that.data.member.id;
    var appid = that.data.appid;
    var createUserId = app.globalData.createUserId;
    var data={
      couponId: couponId,
      memberId: memberId,
      appid: appid,
      createUserId: createUserId
        }
    api.addcoupon(data, '', function success(res) {
      if (res.errcode == 0) {
        that.couponlist(that.data.sid, memberId);
        app.toast.success("领取成功", 1500)
      }

    }, function fail(res) {

    })
  },
  /*联系*/
  goCall: function (e) {
    var that = this;
    var phone = that.data.store.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    }, function sussess(res) {
        
    }, function fail(res) {
       
    })
  },
  //预约
  goSubScribe:function(){
    var that=this;
    wx.navigateTo({
      url: '../consulting/consulting',
    })
  },
  /*获取当前坐标地理位置*/
  getlocation: function () {
    var that = this;
    var latitude = that.data.store.latitude;
    var longitude = that.data.store.longitude;
    var address = that.data.store.address;
    var name = that.data.store.name;
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
          name: name
        })
      }
    })
  },
  //优惠买单
  goPreferent:function(){
    var id = this.data.store.id;
   wx.navigateTo({
     url: '../preferential/preferential?id=' +id,
    //  success: function (e) {
    //    var page = getCurrentPages().pop();
    //    if (page == undefined || page == null) return;
    //    page.onLoad();
    //  }
   })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that=this;
    that.couponlist(that.data.sid);
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
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res)
    }
    if (res.from === 'menu') {
      // 来自页面内转发按钮
      console.log(res)
    }
    return {
      title: that.data.store.name,
      success: function (res) {

        var tickets = res.shareTickets[0];
        console.log(tickets);
        wx.getShareInfo(tickets, function success(res) {
          console.log(res)
        });
      },
      fail: function (res) {
        console.log(res)
      }
    }
  }
})