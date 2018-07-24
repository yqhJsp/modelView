// pages/store/discover/discover.js
const app = getApp();
const api = require('../utils/api_util.js');
Page({ 

        /**
         * 页面的初始数据
         */
        data: {
               fileDomain: app.static_data.file_domain_url,
                topics: [],
                fristInfo: {},
                infos: [],
                maninfo: {},
                noData:false,
                new:true,
                isTopic:0

        },
        openInfo: function (e) {
                var id = e.currentTarget.dataset.id;
                wx.navigateTo({
                        url: '../discDetail/discDetail?id=' + id,
                })
        },
        clickInfos: function (e) {
                var that = this;
                var tid = e.currentTarget.dataset.tid;
                var topics = that.data.topics;
                for (var i = 0; i < topics.length; i++) {
                        var r = topics[i];
                        if (tid == r.id) {
                                r.active = true;
                        } else {
                                r.active = false
                        }
                }
                that.setData({
                        topics: topics,
                        new:false,
                        isTopic:1
                });
                this.getInfos(tid);
        },
      clickNew:function(){
        var that=this;
        that.setData({
          new: true,
          isTopic:0
        });
        that.getInfos(0);
        },
        getInfos: function (tid) {
                var that = this;
                var data={};
                if (tid!=0){
                  data.topicId=tid
                }
                api.getinformations(data, '', function (res) {
                        console.log(res);
                        if (res.errcode == 0) {
                                var infos = [];
                                var r = res.result;
                                if (r.length > 0) {
                                        for (var i = 0; i < r.length; i++) {
                                                if (i == 0) {
                                                        that.setData({
                                                                fristInfo: r[i]
                                                        });
                                                } else {
                                                        infos.push(r[i]);
                                                }
                                        }
                                        that.setData({
                                                infos: infos,
                                                noData:false
                                        });
                                } else {
                                        that.setData({
                                                infos: [],
                                                fristInfo: {},
                                                noData:true
                                        });
                                }

                        }
                }, function (res) {

                });
        },
        gettopics: function () {
                var that = this;
                api.gettopics({}, '', function (res) {
                        console.log(res);
                        if (res.errcode == 0) {
                                var topics = res.result;
                                for (var i = 0; i < topics.length; i++) {
                                        var t = topics[i];
                                        if (i == 0) {
                                                t.active = true
                                                // that.getInfos(t.id);
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
        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
          wx.setNavigationBarTitle({
            title: '资讯',
          })
          app.common_util.setBarColor(app.globalData.maninfo.tone);
        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function () {
                var that = this;
                this.gettopics();
                that.getInfos(0);
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