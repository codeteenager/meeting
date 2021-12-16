<template>
  <view class="page">
    <view class="header">
      <u-dropdown
        :close-on-click-mask="mask"
        :activeColor="activeColor"
        :borderBottom="borderBottom"
      >
        <u-dropdown-item
          @change="change"
          v-model="selectedCompany"
          title="全部公司"
          :options="companyList"
        ></u-dropdown-item>
        <u-dropdown-item
          @change="change"
          v-model="selectedProjector"
          title="投影仪"
          :options="projectorList"
        ></u-dropdown-item>
      </u-dropdown>
    </view>
    <view v-if="roomList.length > 0" class="room-list">
      <u-swipe-action
        :show="item.show"
        :index="index"
        v-for="(item, index) in roomList"
        :key="index"
        @open="open"
        :options="options"
        @click="deleteRoom(item)"
      >
        <view class="room-card" @click="navToDetail(item)">
          <u-image width="60px" height="60px" :src="item.cover"></u-image>
          <view class="main">
            <text class="title">{{ item.name }}</text>
            <view class="content">
              <u-image
                width="15px"
                height="15px"
                src="/static/images/projector.png"
              ></u-image>
              <text>{{ item.projector ? "有" : "没有" }}</text>
              <u-line class="line" color="#bfbfbf" direction="col" />
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
                src="/static/images/description.png"
              ></u-image>
              <text class="text">{{ item.description }}</text>
            </view>
          </view>
        </view>
        <u-line />
      </u-swipe-action>
    </view>
    <view v-else class="empty-data">
      <u-image
        width="100px"
        height="100px"
        src="/static/images/nodata.png"
      ></u-image>
      <text>暂无数据</text>
    </view>
    <view class="addRoom" @tap="toAddRoom">
      <view class="add">
        <u-icon name="plus" color="#ffffff" class="icon" :size="30"></u-icon
        >新建会议室
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      roomList: [],
      options: [
        {
          text: "删除",
          style: {
            backgroundColor: "#dd524d",
          },
        },
      ],
      companyList: [],
      projectorList: [
        {
          label: "是",
          value: 1,
        },
        {
          label: "否",
          value: 0,
        },
      ],
      borderBottom: true,
      activeColor: "#2979ff",
      mask: true,
      selectedCompany: "",
      selectedProjector: "",
    };
  },
  onShow() {
    this.getRoomList();
  },
  onReady() {
    const query = this.Bmob.Query("company");
    query.find().then((res) => {
      res.forEach((item) => {
        this.companyList.push({ label: item.name, value: item.objectId });
      });
    });
  },
  methods: {
    navToDetail(data) {
      uni.navigateTo({
        url: `../roomdetail/index?objectId=${data.objectId}`,
      });
    },
    open(index) {
      this.roomList[index].show = true;
      this.roomList.map((val, idx) => {
        if (index != idx) this.roomList[idx].show = false;
      });
    },
    toAddRoom() {
      uni.navigateTo({
        url: "../room/add",
      });
    },
    change(index) {
      this.getRoomList();
    },
    deleteRoom(item) {
      const query = this.Bmob.Query("room");
      query
        .destroy(item.objectId)
        .then((res) => {
          uni.showToast({
            title: "删除成功!",
            duration: 2000,
          });
          this.getRoomList();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getRoomList() {
      const query = this.Bmob.Query("room");
      if (this.selectedCompany) {
        query.equalTo("companyId", "==",this.selectedCompany);
      }
      if (this.selectedProjector ===  true) {
        query.equalTo(
          "projector",
          "==",
          true
        );
      }
      if (this.selectedProjector ===  false) {
        query.equalTo(
          "projector",
          "==",
          false
        );
      }
      query.order("-updatedAt");
      query.find().then((res) => {
        this.roomList = res;
      });
    },
  },
};
</script>
<style lang="scss">
.page {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

.page .header {
  width: 100%;
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
  background-color: #ffffff;
}

.page .room-card .main {
  margin-left: 10px;
}

.page .room-card .title {
  font-size: 16px;
}

.page .room-card .content {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.page .line {
  width: 5px;
  height: 10px;
}
.page .description {
  display: flex;
  flex-direction: row;
  margin-top: 8px;
}
.page .description .text {
  max-width: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.addRoom {
  display: flex;
  justify-content: space-around;
  position: absolute;
  width: 600rpx;
  line-height: 100rpx;
  bottom: 30px;
  background-color: #00cab7;
  border-radius: 60px;
  font-size: 12px;
  .add {
    display: flex;
    align-items: center;
    color: #ffffff;
    .icon {
      margin-right: 10px;
    }
  }
}
</style>