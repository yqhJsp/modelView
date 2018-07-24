// pages/site/signUser/signUser.js
const app = getApp();
const api = require('../utils/api_util.js');
Page({
        /**
         * 页面的初始数据
         */
        data: {
                member: {},
                userInfo: {},
                maninfo: {}
        },
        //跳转到我的会员卡
        goMyMember: function (e) {
                var that = this;
                wx.navigateTo({
                        url: '../member/member',
                })
        },
        //我的预约
        goConsult: function () {
                wx.navigateTo({
                        url: '../myconsult/myconsult',
                })
        },
        //我的收藏
        goCollect: function () {
                wx.navigateTo({
                        url: '../myCollect/myCollect',
                })
        },
        //我的优惠买单
        goPreferent: function () {
                wx.navigateTo({
                        url: '../myPreferential/myPreferential',
                })
        },
        //我的优惠卷
        goCoupon: function () {
                wx.navigateTo({
                        url: '../myCoupon/myCoupon',
                })
        },
        //收获地址
        goAddress: function () {
                wx.navigateTo({
                        url: '../address/address',
                })
        },
        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                var that = this;
                var member = app.globalData.member;
                that.setData({
                        member: member,
                        userInfo: member.userInfo,
                        maninfo: app.globalData.maninfo
                })
                app.common_util.setBarColor(app.globalData.maninfo.tone);
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