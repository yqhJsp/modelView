// pages/site/preferential/preferential.js
const app = getApp();
const api = require('../utils/api_util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    favourable: 0,//参与优惠金额
    nofavourable: 0,//不参与优惠金额
    realPrice: 0,//实际付款金额,
    maninfo: {},
    appid: '',
    member:{},
    count: 0,
    zksum: 0,
    sfsum: 0,
    isNofav:0,
    isAbled:'disabled',//是否禁止文本框
    animationData: {},//选择动画
    isCoupon: 0,//隐藏优惠卷弹窗
    showModalStatus: false,//显示遮罩
    couponList: [],//优惠卷
    hidden: false,
    isDefault: 0,
    isDefault: 0,
    couponDes: '',
    limit: 0,
    facevalue: 0,
    isCouponStatus: 2,
    couponId: 0,
   //积分
    integSum: 0,//剩余的总积分
    integralKy: 0,
    integLabel: 0,//抵扣的积分
    childrenInfoId:0,
    status: false,
    
  },
  getZkSum: function () {
    var that = this;
    var d = that.data;
    var s =0;
    if (d.maninfo.discounts!=0){
      s = ((d.favourable * (d.maninfo.discounts / 100)) / 100).toFixed(2);
    }
    else{
      s = ((d.favourable) / 100).toFixed(2);
    }  
    that.setData({
      zksum: s
    })
  },
  getSfSum: function () {
    var that = this;
    var d = that.data;
    var s = 0;
    //积分抵扣
    var intelMoney = d.integLabel;
    var f= d.facevalue;
    if (d.maninfo.discounts != 0) {
      s = (((d.favourable * (d.maninfo.discounts / 100)) + d.nofavourable) / 100-f).toFixed(2);
    }
    else {
      s = ((d.favourable+ d.nofavourable) / 100-f).toFixed(2);
    }
    if (s - intelMoney> 0) {
      s = (s - intelMoney).toFixed(2);
    } else{
      s = 0;
    }
    that.setData({
      sfsum: s
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '优惠买单',
    })
    var maninfo = app.globalData.maninfo;
    var member = app.globalData.member;
    var appid = app.globalData.appid;
    var id = options.id;
    api.setBarColor(app.globalData.maninfo.tone);
    that.setData({
      maninfo: maninfo,
      member: member,
      appid: appid,
      childrenInfoId: id
    });
    that.getCouponlistbymember();
  },
  prefInput: function (e) {
    var that = this;
    var value = e.detail.value;

    if (value.indexOf(".") != -1) {
      if (value.length <= 2) {
        return;
      }s
      var s = value.split(".")[1];
      console.log(s);
      if (s.length > 2) {
        app.toast.error('格式不正确', 1500);
        return;
      }

    }
    console.log("ss:" + value)
    if (value==0) {
      that.setData({
        favourable: 0
      })
    }else{
      that.setData({
        favourable: value * 100
      })
    }
    that.getSfSum();
    that.getZkSum();
  },
  noPrefInput: function (e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      nofavourable: value * 100
    })
    that.getSfSum();
    that.getZkSum();
  },

  //保存
  savePreferent: function () {
    var that = this;
    var intPrice = that.data.favourable;
    var outPrice = that.data.nofavourable;
    var discounts = Number(that.data.maninfo.discounts);
    var realPrice = that.data.sfsum*100;
    var appid =that.data.appid;
    var childrenInfoId = Number(that.data.childrenInfoId);
    if (intPrice == '') {
      app.toast.error('请填写优惠金额', 1500);
      return false
    }
    if (that.data.sfsum<=0) {
      app.toast.error('金额异常', 1500);
      return false
    }
    
        var data = {
          "appid": appid,
          "intPrice": intPrice,
          "outPrice": outPrice,
          "discounts": discounts,
          "realPrice": realPrice,
          "createUserId": app.globalData.createUserId,
           "memberId":that.data.member.id,
           "childrenInfoId": childrenInfoId
        }
        if (that.data.couponDes!=''){
          data.couponId = that.data.couponId;
          data.couponValue = (that.data.facevalue)*100;
        }
        if (that.data.integSum!=0){
          data.integralValue = Number(that.data.integLabel)
        }
       api.insertdiscountsorder(data, '', function success(res) {
          if (res.errcode == 0) {
            app.toast.success('提交成功', 1000);
            api.wechat_pay('优惠买单', res.result.id, res.result.realPrice, that.data.member.openId);
          }
          else if (res.errcode ==2){
            app.toast.error('积分不可用', 1500);
          } else if (res.errcode ==3) {
            app.toast.error('优惠卷不可用', 1500);
          }

        }, function fail(res) {
          app.toast.error('提交失败', 1500);
        })
  },
  //优惠卷弹窗事件
  getCoupon: function (data) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
    })
    animation.translateY(0).step()

    this.animation = animation
    that.setData({
      showModalStatus: true,//显示遮罩       
      animationData: animation.export()
    })
    that.setData({//把选中值，放入判断值中
      isCoupon: 1,
    })
  },
  /*隐藏 */
  hideModal: function (data) {
    var that = this;
    that.setData({//把选中值，放入判断值中
      showModalStatus: false,//显示遮罩       
      isCoupon: 0
    })
  },
  /*获取优惠卷信息*/
  getCouponlistbymember: function () {
    var that = this;
    var memberId = app.globalData.member.id;;
    var data = {
      'memberId':memberId,
      'status': 1
    }
   api.couponlistbymember(data, "加载中..", function sussess(res) {
      if (res.errcode == 0) {
        if (res.result.length == 0 && res.result == '') {
          that.setData({
            hidden: true
          })
        } else {
          that.setData({
            hidden: false,
            list: res.result
          })
          var list = that.data.list;
          for (var i = 0; i < list.length; i++) {
            var item = list[i]  //状态
            item.coupon.isDefault = 0;
            var userStatus = item.coupon.userStatus;
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
   //优惠券主要处理逻辑
  couponDetail: function (e) {
    var that = this;
    var status =false;
    var selected = e.target.dataset.select;
    var id = e.currentTarget.dataset.id;
    var cid = e.currentTarget.dataset.cid;
    var scope = e.currentTarget.dataset.scope;
    var facevalue = e.currentTarget.dataset.facevalue;
    var name = e.currentTarget.dataset.name;
    var limit = e.currentTarget.dataset.limit;
    var clist = that.data.couponList;
    var favourable = that.data.favourable;
    var nofavourable =that.data.nofavourable;
    var integLabel = that.data.integLabel;
    var sum = (((favourable * (that.data.maninfo.discounts / 100)) + nofavourable) / 100) - integLabel;
    console.log(sum + "优惠卷")
    for (var i = 0; i < clist.length; i++) {
      var c = clist[i];
      if (c.id == id) {
        if (selected == clist[i].coupon.isDefault && selected == 1) {
          clist[i].coupon.isDefault = 0;
        } else {
          clist[i].coupon.isDefault = 1;
          status=true
        }
      } else {
        c.coupon.isDefault = 0;
      }
    }
    //选中情况下
    if (status) {
      console.log(status+"ssss")
      var total = (sum-facevalue / 100).toFixed(2);
      if (total < 0) {
        total = 0;
      }
      that.setData({
        couponId: cid,
        couponDes: name,
        facevalue: facevalue/100,
        sfsum: total,
        couponList: clist,
        isCouponStatus: 1,
      })
      app.toast.success('已抵扣', 1500);
    } else {
      console.log(status + "ssss")
      var total = sum.toFixed(2);
      that.setData({
        couponId: cid,
        couponList: clist,
        couponDes: '',
        facevalue: 0,
        sfsum: total,
        isCouponStatus:2,
      })
      app.toast.success('已取消', 1500);
    }
    that.hideModal();
  },
  //优惠券点击事件 ：复选框
  checkedChange: function (e) {
    var that = this;
    var scope = e.currentTarget.dataset.scope;
    var sum = that.data.sfsum;
    var limit = (e.currentTarget.dataset.limit)/100;
    if (scope == 2) {
      if (sum >= limit && sum >=0) {
        that.couponDetail(e);
      } 
      else {
        app.toast.warn('不可使用', 1500);
      }
    }
    else {
      that.couponDetail(e);
    }
  },

  //是否勾选不参与金额
  checked: function (e) {
    var that=this;
    var selected = that.data.isNofav;
    if (selected == 0) {
      this.setData({
        isNofav: 1,
        isAbled:''
      })
    } else {
      this.setData({
        isNofav: 0,
        isAbled: 'disabled'
      })
    }

  },

  //获取积分
  integLabel: function (e) {
    var that = this;
    var value = Number(e.detail.value);
    var nj = that.data.member.integralSum - that.data.member.integralOut;
    var favourable = that.data.favourable;
    var nofavourable = that.data.nofavourable;
    var facevalue = that.data.facevalue;
    var sum = (((favourable * (that.data.maninfo.discounts / 100)) + nofavourable) / 100) - (facevalue/100);
    if (value > nj) {
      app.toast.warn("积分余额不足", 1000);
      return 0;
    }
    if (value != 0) {
      var money = value / Number(that.data.maninfo.integralDeDuction)
      var total = (sum - money).toFixed(2);
      if (total < 0) {
        total = 0
      }
      that.setData({
        integLabel: money.toFixed(2),
        integSum: nj - value,
        sfsum: total
      })
    } else {
      var total = sum.toFixed(2);
      that.setData({
        integLabel: 0,
        integSum: nj,
        sfsum: total
      })
    }
    that.getSfSum();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that=this;
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