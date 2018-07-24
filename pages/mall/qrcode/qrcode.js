// pages/mall/qrcode/qrcode.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    maninfo:{},//主体信息
    member:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var that=this;
   wx.setNavigationBarTitle({
     title: '生成推广码'
   })
   app.common_util.setBarColor(app.globalData.maninfo.tone);
   that.setData({
     maninfo: app.globalData.maninfo,
     member: app.globalData.member
   })
  },
   //获取推广码
  promocode:function(){
    var that=this;
    var memberId=that.data.member.id;
    app.api_util.promocode({memberId: memberId},'',function success(res){
      if(res.errcode==0){
        app.globalData.member.promoCode = res.msg;
        that.setData({
          member: app.globalData.member
        })
      }
    },function fail(res){
      
    })
  },
  // 图片点击事件
  previewImage: function (e) {
    var that = this;
    var nowImgUrl = e.currentTarget.dataset.src;
    wx.previewImage({
      current: [nowImgUrl], // 当前显示图片的http链接
      urls: [nowImgUrl] // 需要预览的图片http链接列表
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