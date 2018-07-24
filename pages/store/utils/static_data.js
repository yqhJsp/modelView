var API_DOMAIN_URL = "https://spa.sefve.com/store/mini";
var SOURCE_DOMAIN_URL = "https://spa.sefve.com/store/";
var API_PAY_URL = "https://spa.sefve.com/store/";
module.exports = {
    api_domain_url: API_DOMAIN_URL,
    //微信统一下单
    unifiedorder_url: API_PAY_URL + 'wxpay/v1/unifiedorder',
    //微信订单查询接口
    orderquery_url: API_PAY_URL + 'wxpay/v1/orderquery',
    order_pendingshipment_url: API_PAY_URL + 'wxpay/v1/pendingshipment',
    //获取话题列表
    get_topics_url: API_DOMAIN_URL + '/v1/gettopics',
    //获取话题咨询列表
    get_informations_url: API_DOMAIN_URL + '/v1/getinformations',
    //获取话题咨询详情
    get_information_url: API_DOMAIN_URL + '/v1/getinformation',
    //获取话题咨询评论列表
    commentlist_url: API_DOMAIN_URL + '/v1/commentlist',
    //评论插入
    insert_comment_url: API_DOMAIN_URL + '/v1/insertcomment',
    //添加点赞数量
    add_likenum_url: API_DOMAIN_URL + '/v1/addlikenum',
    //取消点赞
    delete_likenum_url: API_DOMAIN_URL + '/v1/deletelikenum',

    //获取用户收藏列表接口
    reinformationmemberlist_url: API_DOMAIN_URL + '/v1/reinformationmemberlist',
    //插入用户收藏
    insertreinformationmember_url: API_DOMAIN_URL + '/v1/insertreinformationmember',
    //删除用户收藏
    deletereinformationmember_url: API_DOMAIN_URL + '/v1/deletereinformationmember',
    //批量删除用户收藏
    deletereinformationmembers_url: API_DOMAIN_URL + '/v1/deletereinformationmembers',

    //获取首页数据
    get_maininfo_url: API_DOMAIN_URL + '/v1/getmaininfo',
    //获取门店列表
    childreninfolist_url: API_DOMAIN_URL + '/v1/childreninfolist',
    //获取单个门店数据
    childrenbyid_url: API_DOMAIN_URL + '/v1/childrenbyid',

    //预约信息插入
    savesubscribe_url: API_DOMAIN_URL + '/v1/savesubscribe',
    //用户预约列表
    subscribelist_url: API_DOMAIN_URL + '/v1/subscribelist',
    //取消预约
    delscribelist_url: API_DOMAIN_URL + '/v1/delscribelist',

    //优惠买单下单
    insertdiscountsorder_url: API_DOMAIN_URL + '/v1/insertdiscountsorder',
    //优惠买单列表
    discountsorderlist_url: API_DOMAIN_URL + '/v1/discountsorderlist',
    //单条优惠买单记录
    discountsorderid_url: API_DOMAIN_URL + '/v1/discountsorderid',
    //优惠券列表
    couponlist_url: API_DOMAIN_URL + '/v1/couponlist',
    //领取优惠券
    addcoupon_url: API_DOMAIN_URL + '/v1/addcoupon',
    //用户优惠券列表
    couponlistbymember_url: API_DOMAIN_URL + '/v1/couponlistbymember',

    //领取会员卡
    addmember_url: API_DOMAIN_URL + '/v1/addmember',
    //领取会员信息
    getmember_url: API_DOMAIN_URL + '/v1/getmember',
    //用户积分列表
    integralloglist_url: API_DOMAIN_URL + '/v1/integralloglist',

    //微信订单关闭接口
    closeorder_url: API_DOMAIN_URL + '/wxpay/v1/closeorder'


};