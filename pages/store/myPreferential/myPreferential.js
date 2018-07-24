// pages/site/myPreferential/myPreferential.js
const app = getApp();
const api = require('../utils/api_util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    list: [],
    hidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '我的优惠买单',
    })
    var maninfo = app.globalData.maninfo;
    app.common_util.setBarColor(app.globalData.maninfo.tone);
    that.setData({
      maninfo: maninfo
    });
  },
  //获取优惠买单列表
  getData: function () {
    var that = this;
    var memberId = app.globalData.member.id;
    api.discountsorderlist({ memberId: memberId },'加载中...', function success(res) {
      if (res.errcode == 0) {
        var data = res.result;
        console.log(data)
        if (data.length > 0) {
          that.setData({
            list: data,
            hidden: false
          })
        } else {
          that.setData({
            list: [],
            hidden: true
          })
        }

      }
    }, function fail(res) {

    })
  },
  //详情
  gopreferent:function(e){
   var id=e.currentTarget.dataset.id;
   wx.navigateTo({
     url: '../preferentList/preferentList?id='+id,
   })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    that.getData();
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