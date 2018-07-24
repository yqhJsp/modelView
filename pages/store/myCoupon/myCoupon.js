const app = getApp();
const api = require('../utils/api_util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    currentNavtab:1,
    status: '',
    couponList: [],
    des:'立即使用',
    hidden:false,
    maninfo: {}
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.setNavigationBarTitle({
      title: '我的优惠券',
    })
    var maninfo = app.globalData.maninfo;
    app.common_util.setBarColor(app.globalData.maninfo.tone);
    that.setData({
      maninfo: maninfo
    });
  },
  //切换tab刷新数据
  switchTab: function (o) {
    var that = this;
    var idx = o.currentTarget.dataset.idx;
    if (idx != that.data.currentNavtab) {
      that.setData({
        currentNavtab: idx,
        list: [], //数据源清空
      })
      //刷新数据
      that.getCouponlistbymember();
    }
  },
  /*获取优惠卷信息*/
  getCouponlistbymember: function () {
    var that = this;
    var memberId = app.globalData.member.id;
    var status = that.data.currentNavtab;
    var data = {
      'memberId': memberId,
      'status': status
    }
    api.couponlistbymember(data, "加载中..", function sussess(res) {
      if (res.errcode == 0) {
        if (res.result.length == 0 && res.result == '') {
          that.setData({
            hidden: true,
            couponList:[]
          })
        } else {
          that.setData({
            hidden: false,
            couponList: res.result
          })
          var list = that.data.couponList;
          for (var i = 0; i < list.length; i++) {
            var item = list[i]  //状态
            var userStatus = item.coupon.userStatus;
            var endTime = (item.coupon.endTime).split(' ');
            console.log(endTime + "lll")
            var startTime = (item.coupon.startTime).split(' ');
            item.end = endTime[0];
            item.start = startTime[0];
            if (userStatus == 1) {
              item.des = "立即使用"
            } else if (userStatus == 2) {
              item.des = "已使用"

            } else if (userStatus == 3) {
              item.des = "已过期"
            }
          }
          that.setData({
            hidden: false,
            couponList: list
          })
        }
      }

    },
      function fail(res) {

      })
  },
 
  /*立即使用*/
  couponuser:function(e){
   var that=this;
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getCouponlistbymember();
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