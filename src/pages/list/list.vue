<template>
  <view class="page">
    <view class="header">
      <image src="/static/images/room-bg.png" class="bg"></image>
      <view style="padding: 40rpx">
        <text style="font-size: 40rpx; display: block; font-weight: bold"
          >选择会议室</text
        >
        <view
          style="display: flex; align-items: center; margin-top: 40rpx"
          @click="selectCity"
        >
          <image
            src="/static/images/location.png"
            style="width: 30rpx; height: 30rpx"
          ></image>
          <text style="margin-left: 10rpx">{{ selectedCity.label }}</text>
          <image
            src="/static/images/arrow-down.png"
            style="width: 20rpx; height: 20rpx"
          ></image>
        </view>
        <u-select
          v-model="show"
          mode="single-column"
          :list="cityList"
          @confirm="confirm"
        ></u-select>
      </view>
    </view>
    <view v-if="roomList.length > 0" class="room-list">
      <view
        v-for="(item, index) in roomList"
        :key="index"
        class="room-card"
        @click="navToDetail(item)"
      >
        <u-image width="60px" height="60px" :src="item.cover"></u-image>
        <view class="main">
          <text style="font-weight: bold; font-size: 12px">{{
            item.name
          }}</text>
          <view class="content">
            <u-image
              width="15px"
              height="15px"
              src="/static/images/projector.png"
            ></u-image>
            <text>{{ item.projector ? "有" : "没有" }}</text>
            <span class="line"></span>
            <u-image
              width="15px"
              height="15px"
              src="/static/images/user.png"
            ></u-image>
            <text>{{ item.number }}</text>
          </view>
          <view class="description">
            <u-image
              width="15px"
              height="15px"
              style="margin-right: 8px"
              src="/static/images/description.png"
            ></u-image>
            <text class="text">{{ item.description }}</text>
          </view>
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
</template>

<script>
export default {
  data() {
    return {
      show: false,
      cityList: [],
      roomList: [],
      selectedCity: {},
    };
  },
  onShow() {
    this.getCityList();
  },
  methods: {
    navToDetail(data) {
      uni.navigateTo({
        url: `../roomdetail/index?objectId=${data.objectId}`,
      });
    },
    selectCity() {
      this.show = true;
    },
    confirm(e) {
      this.show = false;
      this.selectedCity = e[0];
      this.getRoomList();
    },
    getCityList() {
      const query = this.Bmob.Query("company");
      query.find().then((res) => {
        this.cityList = [];
        res.forEach((item) => {
          this.cityList.push({
            value: item.objectId,
            label: item.name,
          });
          this.selectedCity = this.cityList[0];
          this.getRoomList();
        });
      });
    },
    getRoomList() {
      const query = this.Bmob.Query("room");
      query.equalTo("companyId", "==", this.selectedCity.value);
      query.find().then((res) => {
        this.roomList = res;
      });
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
  width: 100%;
  height:700rpx;
  position: absolute;
  z-index: -10;
}

.page .room-list {
  width: 100%;
  padding: 50rpx;
}

.page .empty-data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 80px;
}

.page .room-card {
  display: flex;
  flex-direction: row;
  padding: 30rpx;
  margin-top: 50rpx;
  background-color: #FAFAFA;
  border-radius: 12rpx;
}

.page .room-card .main {
  margin-left: 10px;
}

.page .room-card .content {
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
.page .description {
  display: flex;
  flex-direction: row;
  margin-top: 8px;
  align-items: center;
}
.page .description .text {
  max-width: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>