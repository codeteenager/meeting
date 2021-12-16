<template>
  <view class="page">
    <u-notice-bar
      mode="vertical"
      :list="list"
      bg-color="#ffffff"
    ></u-notice-bar>
    <view class="header">
      <image src="/static/images/home-bg.png" class="bg"></image>
      <view style="padding: 40rpx">
        <text style="font-size: 50rpx; display: block; font-weight: bold"
          >Hi~{{ username }}</text
        >
        <view style="display:flex;align-items: center;">
          <image
            src="/static/images/calendar.png"
            style="width: 30rpx; height: 30rpx"
          ></image>
          <text style="margin-left:10rpx;">{{date}}</text>
        </view>
        <text
          style="
            font-size: 40rpx;
            display: block;
            margin-top: 150rpx;
            font-weight: bold;
          "
          >已预约会议室 {{ advanceList.length }}</text
        >
      </view>
    </view>
    <view class="room-list">
      <view v-if="advanceList.length > 0">
        <view
          v-for="(item, index) in advanceList"
          :key="index"
          class="advance-card"
          @click="navToDetail(item)"
        >
          <text style="font-weight: bold; font-size: 12px">{{
            item.name
          }}</text>
          <view class="number">
            <u-image
              width="15px"
              height="15px"
              style="margin-right: 10px"
              src="/static/images/user.png"
            ></u-image>
            <text>{{ item.userId.username }}</text>
            <span class="line"></span>
            <u-image
              width="15px"
              height="15px"
              src="/static/images/projector.png"
            ></u-image>
            <text>{{ item.roomId.name }}</text>
          </view>
          <view class="number">
            <u-image
              width="15px"
              height="15px"
              style="margin-right: 10px"
              src="/static/images/time.png"
            ></u-image>
            <text
              >{{ item.date }} {{ timeArr[item.startTime]["time"] }}~{{
                timeArr[item.endTime]["time"]
              }}</text
            >
          </view>
        </view>
      </view>
      <view v-else class="empty-data">
        <u-image
          width="100px"
          height="100px"
          src="/static/images/nodata.png"
        ></u-image>
        <text>暂无数据</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      advanceList: [],
      username: "",
      date:"",
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
      list: [
        "会议室展示屏解决方案",
        "如何向团队介绍赞同会议",
        "好消息！好消息！会议室预约审批功能上线啦！",
        "版本升级公告",
      ],
    };
  },
  onShow() {
    let current = this.Bmob.User.current();
    if (current) {
      this.username = current.username;
    }
    const query = this.Bmob.Query("order");
    query.include("userId", "roomId");
    query.equalTo("userId", "==", current.objectId);
    query.order("-updatedAt");
    query.find().then((res) => {
      this.advanceList = res;
    });
    this.date = this.getCurrentDate();
  },
  methods: {
    navToDetail(data) {
      uni.navigateTo({
        url: `../reservedetail/index?objectId=${data.objectId}`,
      });
    },
    getCurrentDate() {
      let myDate = new Date();
      let year = myDate.getFullYear(); //年
      let month = myDate.getMonth() + 1; //月
      let day = myDate.getDate(); //日
      let days = myDate.getDay();
      switch (days) {
        case 1:
          days = "星期一";
          break;
        case 2:
          days = "星期二";
          break;
        case 3:
          days = "星期三";
          break;
        case 4:
          days = "星期四";
          break;
        case 5:
          days = "星期五";
          break;
        case 6:
          days = "星期六";
          break;
        case 0:
          days = "星期日";
          break;
      }
      let str = year + "年" + month + "月" + day + "日  " + days;
      return str;
    },
  },
};
</script>
<style>
.page {
  height: 100%;
}

.page .header {
  width: 100%;
  height: 300rpx;
}
.page .header .bg {
  width:100%;
  height: 350rpx;
  position: absolute;
  z-index: -10;
}

.page .room-list {
  padding: 50rpx;
}

.page .advance-card {
  display: flex;
  flex-direction: column;
  padding: 30rpx;
  margin-top: 50rpx;
  background-color: #FAFAFA;
  border-radius: 12rpx;
}

.page .line {
  width: 1px;
  height: 10px;
  margin-left: 10px;
  margin-right: 10px;
  background-color: #efefef;
}

.page .advance-card .number {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.page .empty-data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 80px;
}
</style>