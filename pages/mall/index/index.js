// pages/mall/index/index.js
const app = getApp();
const api = require('../utils/api_util.js');
Page({
        /**
         * 页面的初始数据
         */
        data: {
                fileDomain: app.static_data.file_domain_url,
                swiper: [],
                indexColumns: [],
                notice: [],
                searchName: '',
                variable: 0,
                focus: false,
                member: {},
                isPayPattern: 0,
                isInformation: 0,
                informations: [],
                appid: 0,
                size: 3,
                shopInfo: {},
                number: 1,
                skList: [],
                seckill:[],
                groupList: [],
                isLoad:true,
                quickList:[],//快捷入口
                grouProduct:[],//团购的商品长度
        },
        /*消息通知*/
        openMessage: function () {
                wx.navigateTo({
                        url: '../message/message'
                })
        },
        //资讯详情
        goInfoDetail: function (e) {
                var that = this;
                var id = e.currentTarget.dataset.id;
                wx.navigateTo({
                        url: '../infodetail/infodetail?id=' + id
                })
        },
        /*搜索*/
        goSearch: function () {
                var title = this.data.searchName;
                if (title != '') {
                        wx.navigateTo({
                                url: '../list/shopList?likeTitle=' + title + '&stuats=2',
                        })
                }else{
                      app.toast.warn("请输入搜索的商品名", 1000);
                }
        },
        /*获取搜索框的内容*/
        bindSearch: function (e) {
                var value = e.detail.value;
                if (value > 0 || value.length > 0) {
                        this.setData({
                                searchName: value,
                        })
                }
        },
        //滚动监听  
        scroll: function (e) {
                this.setData({
                        scrollTop: e.detail.scrollTop
                })
        },
        getCartData: function () {
                var that = this;
                api.trolley_list({}, "", function sussess(res) {
                        if (res.errcode == 0) {
                                var ass = res.result;
                                for (var i = 0; i < ass.length; i++) {
                                        ass[i].check = 0;
                                        ass[i].isTouchMove = false;

                                }
                                that.setData({
                                        list: ass
                                });
                                if (ass.length > 0) {
                                        wx.setTabBarBadge({
                                                index: 2,
                                                text: '' + ass.length + ''
                                        })
                                } else {
                                        wx.removeTabBarBadge({ index: 2 });
                                }
                        }
                }, function fail(res) {

                });
        },
        /**
         * 加载首页数据
         */
        get_home: function () {
                wx.showNavigationBarLoading()
                var that = this;
               api.homeData("", function sussess(res) {
                        if (res.errcode == 0) {
                                wx.setNavigationBarTitle({
                                        title: res.result.shopInfo.title
                                })
                                var data = res.result;
                                app.globalData.createUserId = data.shopInfo.createUserId;
                                wx.setStorageSync('shopInfo', data.shopInfo);
                                app.globalData.shopInfo = data.shopInfo;
                                var indexColumns = data.indexColumns;
                                if (indexColumns.length > 0) {
                                        for (var i = 0; i < indexColumns.length; i++) {
                                                var products = indexColumns[i].products;
                                                for (var j = 0; j < products.length; j++) {
                                                        var p = products[j];
                                                        var s = p.imageIds.split(",");
                                                        p.imageIds = s[0];
                                                }
                                        }
                                }
                                // console.log(indexColumns); 
                                that.setData({
                                        swiper: data.reAttachShopList,
                                        indexColumns: indexColumns,
                                        shopInfo: data.shopInfo,
                                        isPayPattern: data.shopInfo.isPayPattern,
                                        isInformation: data.shopInfo.isInformation,
                                        informations: data.informations,
                                        isLoad:false       
                                })
                                
                                //设置导航加载状态
                                app.common_util.setBarColor(data.shopInfo.tone);
                                // 在这里停止加载的提示框  
                                setTimeout(function () {
                                        wx.hideLoading();
                                }, 1000)

                                //mini商城控制
                                app.globalData.isPayPattern = data.shopInfo.isPayPattern;
                                app.globalData.kfMobile = data.shopInfo.kfMobile;
                                console.log(app.globalData.kfMobile);
                                if (data.shopInfo.isPayPattern == 2) {
                                        wx.setTabBarItem({
                                                index: 2,
                                                text: '收藏',
                                                iconPath: '/images/tabbar/scl.png',
                                                selectedIconPath: '/images/tabbar/scl-in.png'
                                        })
                                } else {
                                        wx.setTabBarItem({
                                                index: 2,
                                                text: '购物车',
                                                iconPath: '/images/tabbar/car.png',
                                                selectedIconPath: '/images/tabbar/car-in.png'
                                        })
                                }
                                that.getCartData();
                                wx.hideNavigationBarLoading();
                                console.log(that.data.shopInfo.type)
                                if (that.data.shopInfo.type == 2) {
                                  that.seckill();
                                  that.group();
                                }
                        }
                }, function fail(res) {

                });
        },
        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                var that = this;
                var type = options.type;
                if (type == 1) {
                        console.log("分享分享开发");
                        //分销关系处理
                        var createUserId = app.globalData.createUserId;
                        var childrenId = app.globalData.member.id;
                        var parentId = options.mid;
                        var appid = app.globalData.appid;
                        var data = {
                                'createUserId': createUserId,
                                'parentId': parentId,
                                'childrenId': childrenId,
                                'appid': appid
                        }
                        console.log(data);
                        //分销关系插入
                        api.insertbrokeragerelation(data, '', function success(res) {
                                if (res.errcode == 0) {
                                        console.log(res.result)
                                        var brokerage = res.result;
                                        wx.setStorage({
                                                key: 'brokerage',
                                                data: brokerage,
                                        })
                                }
                        }, function fail(res) {

                        })
                        var id = options.id;
                        wx.navigateTo({
                          url: '../detail/mall_detail?id=' + id
                        })
                }
                app.userInfoReadyCallback = res => {
                that.get_home();
                that.get_notice();
                that.getquickentry();
                }

        },
        goDetail: function (options) {
                var id = options.currentTarget.id;
                wx.navigateTo({
                  url: '../detail/mall_detail?id=' + id
                })
        },
        /*店铺公告*/
        goNotice: function () {
                wx.navigateTo({
                        url: '../notice/noticeList'
                })
        },
        get_notice: function () {
                var that = this;
                api.getNoticeList("", function success(res) {
                        if (res.errcode == 0) {
                                that.setData({
                                        notice: res.result
                                })
                        } else {

                        }
                }, function fail(res) {

                });
        },
        //更多资讯
        goInfo: function () {
                wx.navigateTo({
                        url: "../information/information",
                })
        },
    
        //团购/秒杀
        goGroup: function (e) {
                var stype = e.currentTarget.dataset.type;
                if (stype==2){
                  wx.navigateTo({
                    url: '/pages/marketing/seckill/seckill?stype=' + stype,
                  })
                }
                else{
                  wx.navigateTo({
                    url: '/pages/marketing/group/group?stype=' + stype
                  })
                }
        },
        /*快捷入口*/
        goQuick:function(e){
          var that=this;
          var type=e.currentTarget.dataset.type;
          var desc = e.currentTarget.dataset.desc;
          if(type==3){
            //秒杀
            if (desc == 100){
              wx.navigateTo({
                url: '/pages/marketing/seckill/seckill?stype=' + 2,
              })
            }
            //拼团
            else if (desc == 101) {
              wx.navigateTo({
                url: '/pages/marketing/group/group?stype=' + 3
              })
            }
            //优惠卷
            else if (desc == 103) {
              wx.navigateTo({
                url: '/pages/marketing/coupon/coupon'
              })
            }
            //积分
            else if (desc == 104) {
              wx.navigateTo({
                url: '/pages/marketing/integral/integral',
              })
            }
            //订单
            else if (desc == 207) {
              wx.navigateTo({
                url: '/pages/user/mineOrder/orderItems?id=' + 1
              })
            }
            //促销
            else if (desc == 208) {
              wx.navigateTo({
                url: '../list/shopList'
              })
            }

            //消息
            else if (desc == 209) {
              wx.navigateTo({
                url: '../message/message'
              })
            }
          }
          //分类
          else if(type==1){
            //跳转bar内的链接用switchTab,不能带参数
            app.globalData.groupId = desc;
            wx.switchTab({
              url: '../classify/page'
            })
          }
        },
        //获取快捷入口
        getquickentry:function(){
          var that=this;
          api.getquickentry("", function success(res) {
            if (res.errcode == 0){
              console.log(res.result+"quik")
              that.setData({
                quickList:res.result
              })
            }
          },function fail(res){

          })
        },

        //获取置顶秒杀
        seckill: function () {
                var that = this;
                api.seckill({}, "", function success(res) {
                        if (res.errcode == 0) {
                                var sk = [];
                                var skList = res.result;
                                that.setData({
                                  seckill: res.result
                                })
                                for (var i = 0; i < skList.length; i++) {
                                        var s = skList[i];
                                        var p = s.products;
                                        if (p.length > 0) {
                                                for (var j = 0; j < p.length; j++) {
                                                        p[j].aid = s.id;
                                                        sk.push(p[j]);
                                                }
                                        }
                                }
                                var sks = [];
                                var s = new Array;
                                for (var n = 0; n < sk.length; n++) {
                                        s.push(sk[n]);
                                        if (s.length == 3) {
                                                sks.push(s);
                                                s = new Array;
                                        }
                                }
                                var k = sk.length % 3;
                                console.log(k);
                                if (k > 0) {
                                        for (var m = 1; m < k; m++) {
                                                s.push(sk[sk.length - m]);
                                        }
                                        sks.push(s);
                                }


                                console.log("获取置顶秒杀");
                                console.log(sks);
                                that.setData({
                                        skList: sks
                                })

                        }
                }, function fail(res) {

                });
        },
        //去秒杀
        goMarkProduct: function (e) {
          var that = this;
          var stype = e.currentTarget.dataset.type;
          var id = e.currentTarget.dataset.id;
          var skid = e.currentTarget.dataset.skid;//秒杀id
          var isStart = e.currentTarget.dataset.start;//是否开始  1、开始 2、预告
          var sklist = {};
          var list=[];
          if (stype==2){
            list = that.data.seckill;
          } else if (stype == 3){
            list = that.data.groupList;
          }
          for (var i = 0; i < list.length; i++) {
            if (list[i].id == skid) {
              sklist = list[i];
              console.log(sklist + "sk")
            }
          }
          wx.setStorageSync('sklist', sklist);
          wx.navigateTo({
            url: '/pages/mall/detail/mall_detail?stype=' + stype + '&id=' + id + '&skid=' + skid + '&isStart=' + isStart,
          })
        },
        //获取置顶团购
        group: function () {
                var that = this;
                api.group({}, "", function success(res) {
                        if (res.errcode == 0) {
                          var list = res.result;
                          var sp=[];
                          for(var i=0;i<list.length;i++){
                            var s = list[i];
                            var p = s.products;
                            if(p.length>0){
                              for (var j = 0; j < p.length; j++) {
                                sp.push(p[j]);
                              }
                            }
                            }
                          
                                that.setData({
                                  groupList: list,
                                  grouProduct: sp
                                })
                                console.log(that.data.grouProduct.length + 'sp')
                        }
                }, function fail(res) {

                });
        },
        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function () {
          // this.get_home();

        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function (ops) {
          this.get_home();
          this.getquickentry();
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
                wx.showShareMenu({
                        withShareTicket: true
                })
        },

        /**
         * 页面相关事件处理函数--监听用户下拉动作
         */
        onPullDownRefresh: function () {
                this.get_home();

                setTimeout(() => {
                        wx.stopPullDownRefresh()
                }, 2000)
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
                        title: that.data.shopInfo.title,
                        path: '/pages/mall/index/index',
                        success: function (res) {
                                console.log(res)
                        },
                        fail: function (res) {
                                console.log(res)
                        }
                }
        }
})