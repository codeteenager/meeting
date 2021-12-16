<template>
  <view class="page">
    <view class="base">
      <view class="header">
        <view class="left">
          <text class="title">{{ roomInfo.name }}</text>
          <view class="content">
            <u-image
              width="15px"
              height="15px"
              src="/static/images/projector.png"
            ></u-image>
            <text>{{ roomInfo.projector ? "有" : "没有" }}</text>
            <span class="line"></span>
            <u-image
              width="15px"
              height="15px"
              src="/static/images/user.png"
            ></u-image>
            <text>{{ roomInfo.number }}</text>
          </view>
        </view>
        <view class="right">
          <u-button type="success" size="mini" @click="advanceRoom"
            >预约</u-button
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
        <text class="text">{{ roomInfo.description }}</text>
      </view>
      <image class="cover" :src="roomInfo.cover"></image>
    </view>
    <view class="calendar">
      <calendar :open="false" @onDayClick="onDayClick"></calendar>
      <selector
        ref="selector"
        @selectTime="selectTimeEvent"
      ></selector>
    </view>
    <view class="room-list">
      <u-section title="会议列表" :right="false"></u-section>
      <view v-if="advanceList.length > 0">
        <view
          v-for="(item, index) in advanceList"
          :key="index"
          class="advance-card"
        >
          <text class="title">{{ item.name }}</text>
          <view class="number">
            <u-image
              width="15px"
              height="15px"
              style="margin-right: 10px"
              src="/static/images/user.png"
            ></u-image>
            <text>{{ item.userId.username }}</text>
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
import Calendar from "@/components/calendar/calendar.vue";
import Selector from "@/components/selector/selector.vue";
export default {
  components: {
    Calendar,
    Selector,
  },
  data() {
    return {
      roomId: "",
      roomInfo: "",
      selectedTime: [],
      advanceList: [],
      currentDate: this.getToday(),
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
    this.roomId = options.objectId;
    const query = this.Bmob.Query("room");
    query
      .get(options.objectId)
      .then((res) => {
        this.roomInfo = res;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  onShow() {
    const query = this.Bmob.Query("order");
    query.include("userId", "roomId");
    query.equalTo("roomId", "==", this.roomId);
    query.order("-updatedAt");
    query.find().then((res) => {
      this.advanceList = res;
      res.forEach((item) => {
        this.selectedTime.push({
          date: item.date,
          startTime: item.startTime,
          endTime: item.endTime,
        });
      });
      this.$refs.selector.updateData(this.currentDate,this.selectedTime);
    });
  },
  methods: {
    onDayClick(data) {
      this.currentDate = data.date;
      this.$refs.selector.updateData(data.date,this.selectedTime);
    },
    getToday() {
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth();
      let d = date.getDate();
      let today = y + "-" + this.formatNum(m + 1) + "-" + this.formatNum(d);
      return today;
    },
    formatNum(num) {
      let res = Number(num);
      return res < 10 ? "0" + res : res;
    },
    selectTimeEvent(data) {
      console.log("==============选中的时间=============");
      console.log(JSON.stringify(data));
    },
    advanceRoom() {
      uni.navigateTo({
        url: `../reserve/reserve?roomId=${this.roomInfo.objectId}`,
      });
    },
  },
};
</script>
<style>
.page {
  height: 100%;
}

.page .base {
  background: #ffffff;
  margin-top: 10px;
  padding: 20rpx;
}

.page .base .header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.page .cover {
  width: 60px;
  height: 60px;
  margin-top: 10px;
}

.page .header .title {
  font-size: 16px;
}

.page .header .content {
  display: flex;
  flex-direction: row;
  align-items: center;
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

.page .calendar {
  margin-top: 10px;
}

.page .room-list {
  padding: 50rpx;
}

.page .advance-card {
  display: flex;
  flex-direction: column;
  padding: 30rpx;
  margin-top: 50rpx;
  background-color: #fafafa;
  border-radius: 12rpx;
}

.page .advance-card .number {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.page .advance-card .time {
  display: flex;
  flex-direction: row;
}

.page .empty-data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 80px;
}
</style>