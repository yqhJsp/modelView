const app = getApp();
const api = require('../utils/api_util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    info:{},
    member:{},
    maninfo:{},
    pid:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.setNavigationBarTitle({
      title: '优惠买单详情',
    })
    var id=options.id;
    var maninfo = app.globalData.maninfo;
    var member = app.globalData.member;
    app.common_util.setBarColor(app.globalData.maninfo.tone);
    that.setData({
      maninfo: maninfo,
      member: member,
      pid: id
    });
  },
  //获取优惠买单列表
 getData:function(e){
  var that=this;
  var id=that.data.pid;
 api.discountsorderid(id,'加载中..',function success(res){
    if (res.errcode==0){
      var data = res.result;
      if (data!=''){
        that.setData({
          info:data,
        })
      }else{
        that.setData({
          info: [],
        })
      }
    }
  },function fail(res){
    
  })
 },
 //返回首页
 goIndex:function(){
  wx.redirectTo({
    url: '/pages/model/index/index',
  })
 },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that=this;
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