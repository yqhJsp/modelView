// pages/site/mydiscover/mydiscover.js
const app=getApp();
const api = require('../utils/api_util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    list:[],
    member:{},
    maninfo:{},
    hidden:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var that=this;
  wx.setNavigationBarTitle({
    title: '我的预约',
  })
  var member = app.globalData.member;
  var maninfo = app.globalData.maninfo;
  that.setData({
    member: member,
    maninfo: maninfo
  })
  app.common_util.setBarColor(app.globalData.maninfo.tone);
  },

//获取预约列表
  getSubscribelist:function(){
   var that=this;
   api.subscribelist({ memberId: that.data.member.id},'加载中...',function success(res){
     if (res.errcode==0){
       var data = res.result;
       if(data.length>0){
          that.setData({
            list:data,
            hidden:false
          })
       }else{
         that.setData({
           list:[],
           hidden: true
         })
       }
     }
   },function fail(res){

   })
  },
  //跳转详情
  goConsultDetail:function(e){
   var that=this;
   var id=e.currentTarget.dataset.id;
   var list = that.data.list;
   var consult={};
   if (list.length!=0){
     for(var i=0;i<list.length;i++){
        if(id==list[i].id){
          consult=list[i]
        }
     }
   }
   wx.setStorageSync('consult', consult);
   wx.navigateTo({
     url: '../consultDetail/consultDetail',
   })
  },
  //去预约
  goConsult:function(){
    var that = this;
    wx.navigateTo({
      url: '../consulting/consulting',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that=this;
    that.getSubscribelist();
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