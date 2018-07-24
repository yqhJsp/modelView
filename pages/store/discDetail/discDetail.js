const app = getApp();
const api = require('../utils/api_util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    isShow: 1, //展开详情
    isShowList: true, //展开列表
    details: {},
    article: '', //详情内容
    isSign: 2, //是否已报名
    isCollect: 1, //是否已收藏  1、未收藏 2、已收藏
    member: {},
    id: 0,
    size: 10,
    number_: 1,
    commentlist: [],
    isLikenum: false,
    collectCount: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '资讯详情',
    })
    var id = options.id;
    that.setData({
      id: id
    })
    var maninfo = app.globalData.maninfo;
    app.common_util.setBarColor(maninfo.tone);
    wx.getStorage({
      key: 'info:' + id,
      success: function (res) {
        var isLikenum = res.data;
        if (isLikenum != null) {
          that.setData({
            isLikenum: isLikenum
          })
        }
      }
    })
    wx.getStorage({
      key: 'collectCount:' + id,
      success: function (res) {
        var collectCount = res.data;
        if (collectCount != null) {
          that.setData({
            collectCount: collectCount
          })
        }
      }
    })
    var member = app.globalData.member;
    that.setData({
      member: member
    })
    that.getData();
    that.commentlist();
  },
  //获取详情
  getData: function () {
    var that = this;
    var id = that.data.id;
    //获取详情
    api.getinformation({ id: id }, '加载中..', function success(res) {
      if (res.errcode == 0) {
        if (res.result != '') {
          var data = res.result;
          var article = data.detail;
          var title = data.title;
          title = title.length > 20 ? title.substring(0, 20) + '...' : title;
          data.title = title;
          that.setData({
            details: data,
            article: app.WxParse.wxParse('article', 'html', article, that, 0)
          })
        }
      }
    }, function fail(res) {

    })
  },
  //展开内容
  goUpdown: function (e) {
    var that = this;
    if (that.data.isShow == 1) {
      that.setData({
        isShow: 2
      })
    } else {
      that.setData({
        isShow: 1
      })
    }
  },
  goList: function () {
    var that = this;
    if (that.data.isShowList == true) {
      that.setData({
        isShowList: false
      })
    } else {
      that.setData({
        isShowList: true
      })
    }
  },
  bindSearch: function (e) {
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    wx.redirectTo({
      url: '../comment/comment?id=' + id + '&type=' + type,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
  },
  //获取话题咨询评论列表
  commentlist: function () {
    var that = this;
    api.commentlist({ id: that.data.id, size: that.data.size, number: that.data.number_ }, '', function success(res) {
      if (res.errcode == 0) {
        var data = res.result;
        that.setData({
          commentlist: data.content
        })
      }
    }, function fail(res) {

    })
  },
  /**
   * 进行点赞操作
   */
  getLikenum: function () {
    var that = this;
    var id = that.data.id;
    if (!that.data.isLikenum) {
      api.addlikenum({ id: id }, "", function success(e) {
        if (e.errcode == 0) {
          var details = that.data.details;
          details.likenum = details.likenum + 1;
          that.setData({
            isLikenum: true,
            details: details
          })
          wx.setStorage({
            key: 'info:' + id,
            data: true,
          })
          app.toast.success("点赞成功", 2500);
        } else {
          app.toast.error("点赞失败", 2500);
        }
      }, function fail(e) {

      })
    } else {
      that.deleteLikenum();
    }

  },
  deleteLikenum: function () {
    var that = this;
    var id = that.data.id;
    api.deletelikenum({ id: id }, "", function success(e) {
      if (e.errcode == 0) {
        var details = that.data.details;
        details.likenum = details.likenum - 1;
        that.setData({
          isLikenum: false,
          details: details
        })
        wx.setStorage({
          key: 'info:' + id,
          data: false,
        })
        app.toast.success("取消成功", 2500);
      } else {
        app.toast.error("取消失败", 2500);
      }
    }, function fail(e) {

    })
  },

  /**
   * 进行收藏操作
   */
  insertreinformationmember: function () {
    var that = this;
    var id = that.data.id;
    var createUserId = app.globalData.createUserId;
    if (!that.data.collectCount) {
      var member = that.data.member;
      var data = {
        appid: member.appid,
        informationId: id,
        memberId: member.id,
        createUserId: createUserId

      };
      api.insertreinformationmember(data, "", function success(e) {
        if (e.errcode == 0) {
          var details = that.data.details;
          details.collectCount = details.collectCount + 1;
          that.setData({
            collectCount: true,
            details: details,
            isCollect: 2
          })
          wx.setStorage({
            key: 'collectCount:' + id,
            data: true,
          })
          app.toast.success("收藏成功", 2500);
        } else {
          app.toast.error("收藏失败", 2500);
        }
      }, function fail(e) {

      })
    } else {
      that.deletereinformationmember();
    }

  },
  deletereinformationmember: function () {
    var that = this;
    var id = that.data.id;
    api.deletereinformationmember({ id: id }, "", function success(e) {
      if (e.errcode == 0) {
        var details = that.data.details;
        details.collectCount = details.collectCount - 1;
        that.setData({
          collectCount: false,
          details: details,
          isCollect: 1
        })
        wx.setStorage({
          key: 'collectCount:' + id,
          data: false,
        })
        app.toast.success("取消成功", 2500);
      } else {
        app.toast.error("取消失败", 2500);
      }
    }, function fail(e) {

    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;


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
      title: that.data.details.shareTitle,
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
  },
})