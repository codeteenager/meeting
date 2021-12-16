<template>
  <view class="page">
    <scroll-view scroll-y="true" class="content" v-if="cityList.length > 0">
      <u-swipe-action
        :show="item.show"
        :index="index"
        v-for="(item, index) in cityList"
        :key="index"
        @open="open"
        :options="options"
        @click="deleteCity(item)"
      >
        <view class="city-card">
          <u-image :src="item.cover" width="60px" height="40px"></u-image>
          <view>{{ item.name }}</view>
        </view>
        <u-line />
      </u-swipe-action>
    </scroll-view>
    <u-empty v-else text="暂无数据" mode="list" style="margin-top:100px;"></u-empty>
    <view class="addCity" @tap="toAddCity">
      <view class="add">
        <u-icon name="plus" color="#ffffff" class="icon" :size="30"></u-icon
        >新建分公司
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      cityList: [],
      options: [
        {
          text: "删除",
          style: {
            backgroundColor: "#dd524d",
          },
        },
      ],
    };
  },
  onShow() {
    this.getCityList();
  },
  methods: {
    open(index) {
      this.cityList[index].show = true;
      this.cityList.map((val, idx) => {
        if (index != idx) this.cityList[idx].show = false;
      });
    },
    deleteCity(item) {
      const query = this.Bmob.Query("company");
      query
        .destroy(item.objectId)
        .then((res) => {
          uni.showToast({
            title: "删除成功!",
            duration: 2000,
          });
          this.getCityList();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getCityList() {
      const query = this.Bmob.Query("company");
      query.order("-updatedAt");
      query.find().then((res) => {
        this.cityList = res;
      });
    },
    toAddCity() {
      uni.navigateTo({
        url: "../company/add",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.page {
  height: 100%;
  background: #eee;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.content {
  height: 100%;
}
.content .city-card {
  padding: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: #fff;
}
.addCity {
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