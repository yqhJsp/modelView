// pages/marketing/integral/integral.js
const app = getApp();
const api = require('../../mall/utils/api_util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    contentlist: [],
    size: 10,
    number: 1,
    member: {},
    hasMoreData: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '积分',
    })
    app.common_util.setBarColor(app.globalData.maninfo.tone);
    var that = this;
    var member = app.globalData.member;
    var intelall = member.integralSum + member.integralOut;
    that.setData({
      member: member,
      intelall: intelall
    })
    that.getIntegral();
  },
  //获取数据
  getIntegral: function (message) {
    var that = this;
    var memberId = app.globalData.member.id;
    var data = {
      'memberId': memberId,
      'size': that.data.size,
      'number': that.data.number,
      'appid': app.globalData.appid,
      'createUserId': app.globalData.createUserId
    }
    api.integralloglist(data, '加载中...', function success(res) {
      var contentlistTem = that.data.contentlist
      if (res.errcode == 0) {
        if (that.data.number == 1) {
          contentlistTem = []
        }
        var contentlist = res.result.content;
        if (contentlist.length < that.data.size) {
          that.setData({
            contentlist: contentlistTem.concat(contentlist),
            hasMoreData: false
          })
        } else {
          that.setData({
            contentlist: contentlistTem.concat(contentlist),
            hasMoreData: true,
            number: that.data.number + 1
          })
        }
      }
      var list = that.data.contentlist;
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        if (item.way == 1) {
          item.forWay = '购物送积分';

        } else if (item.way == 2) {
          item.forWay = '积分抵现金';

        } else if (item.way == 3) {
          item.forWay = '退货返还';

        }

      }
      that.setData({
        contentlist: list
      })
    }, function fail(res) {
      app.toast.warn("网络异常", 1000);
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;
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
    this.data.number = 1
    this.getIntegral('正在刷新数据')
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.getIntegral('加载更多数据')
    } else {
      wx.showToast({
        title: '没有更多数据',
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})