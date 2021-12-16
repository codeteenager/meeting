<template>
  <view class="page">
    <image
      :src="orderInfo.roomId.cover"
      style="width: 100%; height: 350rpx"
    ></image>
    <view class="room">
      <text style="font-size: 40rpx; display: block">{{
        orderInfo.roomId.name
      }}</text>
      <view class="content">
        <u-image
          width="15px"
          height="15px"
          src="/static/images/location.png"
        ></u-image>
        <text>{{ address }}</text>
      </view>
      <view class="content">
        <u-image
          width="15px"
          height="15px"
          src="/static/images/projector.png"
        ></u-image>
        <text>{{ orderInfo.roomId.projector ? "有" : "没有" }}</text>
        <span class="line"></span>
        <u-image
          width="15px"
          height="15px"
          src="/static/images/user.png"
        ></u-image>
        <text>{{ orderInfo.roomId.number }}</text>
      </view>
      <text class="text" style="margin-top: 10rpx">{{
        orderInfo.roomId.description
      }}</text>
    </view>
    <u-gap height="40" bg-color="#eee"></u-gap>
    <view class="base">
      <view class="header">
        <text class="title">{{ orderInfo.name }}</text>
        <view class="content">
          <u-image
            width="15px"
            height="15px"
            style="margin-right: 8rpx"
            src="/static/images/user.png"
          ></u-image>
          <text>{{ orderInfo.userId.username }}</text>
          <span class="line"></span>
          <u-image
            width="15px"
            height="15px"
            style="margin-right: 8rpx"
            src="/static/images/phone.png"
          ></u-image>
          <text>{{ orderInfo.phone }}</text>
        </view>
        <view class="content">
          <u-image
            width="15px"
            height="15px"
            style="margin-right: 8rpx"
            src="/static/images/time.png"
          ></u-image>
          <text
            >{{ orderInfo.date }} {{ timeArr[orderInfo.startTime]["time"] }}~{{
              timeArr[orderInfo.endTime]["time"]
            }}</text
          >
        </view>
      </view>
      <view class="description">
        <u-image
          width="15px"
          height="15px"
          style="margin-right: 8px"
          src="/static/images/description.png"
        ></u-image>
        <text class="text">{{ orderInfo.content }}</text>
      </view>
      <view style="margin-top: 20rpx;">
        <u-button type="error" @click="deleteRoom" shape="circle">删除</u-button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orderId: "",
      orderInfo: "",
      address: "",
      timeArr: [
        { time: "08:00", disable: 1, index: 0 },
        { time: "09:00", disable: 1, index: 1 },
        { time: "10:00", disable: 1, index: 2 },
        { time: "11:00", disable: 1, index: 3 },
        { time: "12:00", disable: 1, index: 4 },
        { time: "13:00", disable: 1, index: 5 },
        { time: "14:00", disable: 1, index: 6 },
        { time: "15:00", disable: 1, index: 7 },
        { time: "16:00", disable: 1, index: 8 },
        { time: "17:00", disable: 1, index: 9 },
        { time: "18:00", disable: 1, index: 10 },
      ],
    };
  },
  onLoad(options) {
    this.orderId = options.objectId;
    const query = this.Bmob.Query("order");
    query.include("userId", "roomId");
    query
      .get(options.objectId)
      .then((res) => {
        this.orderInfo = res;
        const query = this.Bmob.Query("company");
        query
          .get(res.roomId.companyId)
          .then((res) => {
            this.address = res.name;
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    deleteRoom() {
      let _this = this;
      uni.showModal({
        title: "提示",
        content: "是否删除当前会议!",
        success: function (res) {
          if (res.confirm) {
            const query = _this.Bmob.Query("order");
            query
              .destroy(_this.orderInfo.objectId)
              .then((res) => {
                uni.navigateBack();
              })
              .catch((err) => {
                console.log(err);
              });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        },
      });
    },
  },
};
</script>
<style>
.page {
  height: 100%;
}

.page .room {
  padding: 30rpx 40rpx;
}

.page .room .content {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10rpx;
}

.page .base {
  padding: 30rpx 40rpx;
}

.page .base .header {
  display: flex;
  flex-direction: column;
}

.page .header .title {
  font-size: 16px;
}

.page .header .content {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 8rpx;
}

.page .line {
  width: 1px;
  height: 10px;
  margin-left: 10px;
  margin-right: 10px;
  background-color: #efefef;
}

.page .base .description {
  display: flex;
  flex-direction: row;
  margin-top: 8px;
  align-items: center;
}

.page .base .description .text {
  max-width: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>