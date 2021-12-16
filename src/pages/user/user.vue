<template>
  <view class="page">
    <view class="user-box">
      <view class="avatar">
        <u-avatar :src="avatar" size="100"></u-avatar>
        <view class="username">{{ username }}</view>
      </view>
      <view>
        <u-icon name="arrow-right" color="#969799" size="28"></u-icon>
      </view>
    </view>

    <view class="section">
      <u-cell-group>
        <u-cell-item title="分公司管理" @click="navToCompany"></u-cell-item>
        <u-cell-item title="会议室管理" @click="navToRoom"></u-cell-item>
      </u-cell-group>
    </view>

    <view class="section">
      <u-cell-group>
        <u-cell-item
          title="退出登录"
          @click="logout"
        ></u-cell-item>
      </u-cell-group>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      avatar: "/static/images/avatar.png",
      username: "",
    };
  },
  onLoad() {
    let current = this.Bmob.User.current();
    if (current) {
      this.username = current.username;
    }
  },
  methods: {
    logout() {
      let _this = this;
      uni.showModal({
        title: "提示",
        content: "是否退出当前账号",
        success: function (res) {
          if (res.confirm) {
            _this.Bmob.User.logout();
            uni.reLaunch({ url: "../login/index" });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        },
      });
    },
    navToRoom() {
      uni.navigateTo({
        url: "../room/index"
      });
    },
    navToCompany(){
      uni.navigateTo({
        url: "../company/index"
      });
    }
  },
};
</script>
<style scoped>
.page {
  height: 100%;
  background: #eee;
}
.user-box {
  height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 26rpx 32rpx;
}
.user-box .avatar {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.user-box .username {
  margin-left: 10px;
}
.section {
  margin-top: 10px;
}
</style>