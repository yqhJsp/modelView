// pages/user/index/page.js
const app = getApp();
const api = require('../../mall/utils/api_util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
          fileDomain: app.static_data.file_domain_url,
          member:{},
          orderNum:{},
          isPayPattern: 0,
          kfMobile: '',
          shopInfo:{}
  },
  getSet:function(e){
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
          var that=this;
          var id = e.currentTarget.dataset.idx;
          wx.navigateTo({
                  url: '../mineOrder/orderItems?id='+id
          })
          console.log(id)
},
/*地址跳转*/
getAddress:function(e){
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
  goCoupon:function(){
   wx.navigateTo({
     url: '/pages/marketing/myCoupon/myCoupon?id='+1,
   })
  },

  //积分中心
  goInteg: function () {
    wx.navigateTo({
      url: '/pages/marketing/integral/integral',
    })
  },
  //分销界面
  getMyCampaign:function(){
    wx.navigateTo({
      url: '/pages/marketing/myCampaign/myCampaign',
    })
  },
  /*订单状态数目*/
  getOrderStuatNum:function(){
          var that = this;
          api.order_getOrderStatusCount({}, "", function sussess(res){
                  console.log(JSON.stringify(res.result));
                  if (res.errcode == 0){
                          that.setData({
                            orderNum:res.result,      
                          })   
                  }

          }, function fail(res) {

          })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
          wx.setNavigationBarTitle({
                  title: '个人中心'
          })
          var that = this;
          var member = app.globalData.member;
          var shopInfo = app.globalData.shopInfo;
          that.setData({
            isPayPattern: app.globalData.isPayPattern,
            kfMobile: app.globalData.kfMobile,
            member: member,
            shopInfo: shopInfo

          })
          that.getOrderStuatNum();
          that.getOrderStuatNum();
  },
  //联系客服
  goCall:function(){
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    that.getOrderStuatNum();
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