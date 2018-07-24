// pages/user/index/page.js
const app = getApp();
const api = require('../../mall/utils/api_util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    member: {},
    orderNum: {},
    isPayPattern: 0,
    kfMobile: '',
    maninfo: {},
    isLoad:true
  },
  getSet: function (e) {
    wx.openSetting({
      success: (res) => {
        /*
         * res.authSetting = {
         *   "scope.userInfo": true,
         *   "scope.userLocation": true
         * }
         */
      }
    })
  },
  /*全部订单*/
  getOrder: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.idx;
    wx.navigateTo({
      url: '../mineOrder/orderItems?id=' + id
    })
    console.log(id)
  },
  /*地址跳转*/
  getAddress: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../../mall/address/address',
    })
  },
  /*跳转订单界面*/
  toOrder: function (options) {
    var tab = options.currentTarget.id;
    wx.navigateTo({
      url: '../mineOrder/orderItems?id=' + tab,
    })
  },
  //优惠卷中心
  goCoupon: function () {
    wx.navigateTo({
      url: '/pages/marketing/myCoupon/myCoupon?id=' + 1,
    })
  },

  //积分中心
  goInteg: function () {
    wx.navigateTo({
      url: '/pages/marketing/integral/integral',
    })
  },
  //分销界面
  getMyCampaign: function () {
    wx.navigateTo({
      url: '/pages/marketing/myCampaign/myCampaign',
    })
  },
  //我的预约
  goConsult: function () {
    wx.navigateTo({
      url: '/pages/store/myconsult/myconsult',
    })
  },
  //我的收藏
  goCollect: function () {
    wx.navigateTo({
      url: '/pages/store/myCollect/myCollect',
    })
  },
  //我的优惠买单
  goPreferent: function () {
    wx.navigateTo({
      url: '/pages/store/myPreferential/myPreferential',
    })
  },
  /*订单状态数目*/
  getOrderStuatNum: function () {
    var that = this;
    var memberId = app.globalData.member.id;
    api.order_getOrderStatusCount({ memberId: memberId}, "", function sussess(res) {
      console.log(JSON.stringify(res.result));
      if (res.errcode == 0) {
        that.setData({
          orderNum: res.result,
        })
      }
    }, function fail(res) {

    })
  },

  /**
   * 在线咨询
   */
  goCousiting: function () {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //app.getPromission();    
    wx.setNavigationBarTitle({
      title: '个人中心'
    })
    var that = this;
    that.setData({
      isPayPattern: app.globalData.isPayPattern,
      kfMobile: app.globalData.kfMobile,
    })
    app.common_util.setBarColor(app.globalData.maninfo.tone);
    that.setData({
      member: app.globalData.member,
      maninfo: app.globalData.maninfo
    });
    console.log(app.globalData.member)
  },
  //联系客服
  goCall: function () {
    var that = this;
    var phone = that.data.kfMobile;
    wx.makePhoneCall({
      phoneNumber: phone
    }, function sussess(res) {

    }, function fail(res) {

    })
  },
  //我的预约
  goSubscribe: function () {
    wx.navigateTo({
      url: '../mineOrder/orderItems'
    })
  },
  //跳转到我的会员卡
  goMyMember: function (e) {
    var that = this;
    if(that.data.member.isRole==1){
      wx.navigateTo({
        url: '/pages/mall/member/member',
      })
    }else{
      wx.navigateTo({
        url: '/pages/mall/personalinfo/personalinfo',
      }) 
    }
  },
  //跳转粉丝
  getMyFans: function () {
    wx.navigateTo({
      url: '/pages/mall/myFans/myFans',
    })
  },
  //跳转生成推广码
  getPromocode: function () {
    var that = this;
    if (app.globalData.member.distributorRole==1) {
      wx.navigateTo({
        url: '/pages/mall/qrcode/qrcode',
      })
    } else {
      app.toast.warn("您还不是分销商", 1500);
    }

  },
  //授权登录
  goUserInfo:function(){
    app.getUserInfo();
    console.log("sdsw") 
  },
  bindGetUserInfo: function (e) {
    var that=this;
    app.synUserInfo(e.detail.userInfo);
    that.setData({
      member:app.globalData.member
    })
    console.log(that.data.member)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    that.setData({
      isLoad: false
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getOrderStuatNum(); 
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