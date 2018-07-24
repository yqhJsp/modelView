const app = getApp();
const api = require('../utils/api_util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    maninfo:{},
    topics:[],
    infos:[],
    size: 10,
    number: 1,
    member:{},
    noData:false,
    edtilStatus:0,//编辑状态
    allSelectStatus:0,
    checkArr:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.setNavigationBarTitle({
      title: '我的收藏',
    })
    var member = app.globalData.member;
    var maninfo = app.globalData.maninfo;
    app.common_util.setBarColor(app.globalData.maninfo.tone);
    that.setData({
      member: member,
      maninfo: maninfo
    })
  },

  //获取导航
  gettopics: function () {
    var that = this;
    api.gettopics({}, '', function (res) {
      console.log(res);
      if (res.errcode == 0) {
        var topics = res.result;
        for (var i = 0; i < topics.length; i++) {
          var t = topics[i];
          if (i ==0) {
            t.active = true
            that.getInfos(t.id);
          } else {
            t.active = false
          }
        }
        that.setData({
          topics: topics
        });
      }
    }, function (res) {

    });
  },
  //导航点击事件
  clickInfos: function (e) {
    var that = this;
    var tid = e.currentTarget.dataset.tid;
    var topics = that.data.topics;
    for (var i = 0; i < topics.length; i++) {
      var r = topics[i];
      if (tid == r.id) {
        r.active = true
      } else {
        r.active = false
      }
    }
    that.setData({
      topics: topics,
    });
    that.getInfos(tid);
  },

  //收藏的列表
  getInfos: function (tid) {
    var that = this;
    var data = {
      'topicId': tid,
      'memberId': that.data.member.id,
      'size': that.data.size,
      'number': that.data.number
    }
    api.reinformationmemberlist(data, '', function (res) {
      console.log(res);
      if (res.errcode == 0) {
        var r = res.result.content;
        console.log(r)
        if (r.length>0) {
          for(var i=0;i<r.length;i++){
            r[i].check = 0;
          }
          that.setData({
            infos: r,
            noData: false
          });
        } else {
          that.setData({
            infos: [],
            noData: true
          });
        }

      }
    }, function (res) {

    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that=this;
    that.gettopics();
  },
  //到资讯详情
  goDetail:function(e){
   var that=this;
   var id=e.currentTarget.dataset.id;
   wx.navigateTo({
     url: '../discDetail/discDetail?id='+id,
   })
  },
  //编辑事件
  setEdtil:function(){
    if (this.data.edtilStatus==0){
      this.setData({
        edtilStatus: 1,
      })
    }else{
      this.setData({
        edtilStatus:0
      })
    }
  },
  //全选
  selectAll:function(){
    var that = this;
    var ass = that.data.infos;
    var arr = [];
    var allSelectStatus = that.data.allSelectStatus;
    if (allSelectStatus == 0) {
      for (var i = 0; i < ass.length; i++) {
        console.log(ass[i]);
        ass[i].check = 1;
        arr.push(ass[i].id)
      }
      that.setData({
        allSelectStatus: 1,
        infos: ass,
        checkArr: arr
      })
    } else {
      for (var i = 0; i < ass.length; i++) {
        ass[i].check = 0;
      }
      that.setData({
        allSelectStatus: 0,
        infos: ass,
        checkArr:[]
      })
    }
  },
  //复选框按钮
  checked: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var select = e.currentTarget.dataset.select;
    var arr = [];
    var checkArr = that.data.checkArr;
    var list = that.data.infos;
    for (var i = 0; i < list.length; i++) {
      if (id == list[i].id) {
        if (select == 0) {
          list[i].check = 1;
        } else {
          list[i].check = 0;
        }
      }
    }
    //重声明check=1的值push进数组
    for (var n = 0; n < list.length; n++) {
      if (list[n].check==1) {
        arr.push(list[n].id);
      }
    }
    that.setData({
      infos: list,
      checkArr: arr
    })

    console.log(that.data.checkArr);
  },
  //删除
  delCollect:function(){
   var that=this;
     var ids = (that.data.checkArr).toString();
     api.deletereinformationmembers({ ids: ids }, "", function success(e) {
       if (e.errcode == 0) {
         app.toast.success("取消成功", 2500);
         that.setData({
           allSelectStatus:0,
           edtilStatus:0
         })
         that.gettopics();
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