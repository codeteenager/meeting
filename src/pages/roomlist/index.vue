<template>
  <view class="page">
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
      roomList: [],
    };
  },

  onLoad(options) {
    wx.setNavigationBarTitle({
      title: options.name,
    });
    const query = this.Bmob.Query("room");
    console.log(options.companyId);
    query.equalTo("companyId", "==", options.companyId);
    query.find().then((res) => {
      this.roomList = res;
    });
  },

  methods: {
    navToDetail(data) {
      uni.navigateTo({
        url: `../roomdetail/index?objectId=${data.objectId}`,
      });
    },
  },
};
</script>
<style>
.page {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

.page .room-list {
  width: 100%;
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
  padding: 10px;
  margin-left: 12px;
  margin-right: 12px;
  margin-top: 10px;
  background-color: #ffffff;
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