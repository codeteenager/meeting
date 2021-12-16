<template>
  <view class="calendar-wrapper">
    <view class="header">
      <image
        class="pre"
        src="/static/images/calendar.png"
      ></image>
      <image
        class="pre"
        @click="changeYear('pre')"
        src="/static/images/left_arrow.png"
      ></image>
      <view>{{ y + "年" }}</view>
      <image
        class="next"
        @click="changeYear('next')"
        src="/static/images/right_arrow.png"
      ></image>
    </view>
    <view
      :class="{ hide: !monthOpen }"
      class="content"
      :style="{ height: height }"
    >
      <view :style="{ top: positionTop + 'rpx' }" class="months">
        <view class="item" v-for="(item, index) in dates" :key="index">
          <view
            class="month"
            @click="selectOne(item, $event)"
            :class="{
              choose: choose == `${item.year}-${item.month}`
            }"
          >
            {{ Number(item.month) }}月
          </view>
        </view>
      </view>
    </view>
    <image
      src="https://i.loli.net/2020/07/16/2MmZsucVTlRjSwK.png"
      mode="scaleToFill"
      v-if="collapsible"
      @click="toggle"
      class="weektoggle"
      :class="{ down: monthOpen }"
    ></image>
  </view>
</template>

<script>
export default {
  name: "month",
  props: {
    // 是否展开
    open: {
      type: Boolean,
      default: true,
    },
    //是否可收缩
    collapsible: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      y: new Date().getFullYear(),
      dates: [],
      positionTop: 0,
      monthOpen: true,
      choose: "",
    };
  },
  created() {
    this.dates = this.monthDay(this.y);
    !this.open && this.toggle();
  },
  mounted() {
    this.choose = this.getToMonth();
  },
  computed: {
    height() {
      return (this.dates.length / 7) * 100 + "rpx";
    },
  },
  methods: {
    formatNum(num) {
      let res = Number(num);
      return res < 10 ? "0" + res : res;
    },
    getToMonth() {
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth();
      return y + "-" + this.formatNum(m + 1);
    },
    monthDay(y) {
      let dates = [];
      for (let i = 1; i <= 12; i++) {
        dates.push({
          month: i,
          year: i - 1 >= 0 ? y : y - 1,
        });
      }
      return dates;
    },
    isToMonth(y, m) {
      let checkD = y + "-" + m;
      let toMonth = this.getToMonth();
      if (checkD == toMonth) {
        return true;
      } else {
        return false;
      }
    },
    // 展开收起
    toggle() {
      this.monthOpen = !this.monthOpen;
      if (this.monthOpen) {
        this.positionTop = 0;
      } else {
        let index = -1;
        this.dates.forEach((i, x) => {
          this.isToMonth(i.year, i.month) && (index = x);
        });
        this.positionTop = -((Math.ceil((index + 1) / 7) || 1) - 1) * 80;
      }
    },
    // 点击回调
    selectOne(i, event) {
      let date = `${i.year}-${i.month}`;
      this.choose = date;
      this.$emit("onMonthClick", date);
      console.log(date);
    },
    changeYear(type) {
      if (type == "pre") {
        this.y = this.y - 1;
      } else {
        this.y = this.y + 1;
      }
      this.dates = this.monthDay(this.y);
    },
  },
};
</script>

<style lang="scss" scoped>
.calendar-wrapper {
  color: #000000;
  font-size: 28rpx;
  text-align: center;
  background-color: #fff;
  padding-bottom: 10rpx;

  .header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-right: 20rpx;
    height: 88rpx;
    color: #42464a;
    font-size: 32rpx;
    font-weight: bold;
    border-top: 2rpx solid #f2f2f2;
    .pre {
      width: 35rpx;
      height: 35rpx;
      margin-right: 30rpx;
    }
    .next {
      width: 35rpx;
      height: 35rpx;
      margin-left: 30rpx;
    }
  }

  .content {
    position: relative;
    overflow: hidden;
    transition: height 0.4s ease;

    .months {
      transition: top 0.3s;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      position: relative;

      .item {
        position: relative;
        display: block;
        height: 80rpx;
        line-height: 80rpx;
        width: calc(100% / 7);

        .month {
          font-style: normal;
          display: inline-block;
          vertical-align: middle;
          width: 60rpx;
          height: 60rpx;
          line-height: 60rpx;
          overflow: hidden;
          border-radius: 60rpx;

          &.choose {
            background-color: #4d7df9;
            color: #fff;
          }
        }
      }
    }
  }

  .hide {
    height: 80rpx !important;
  }

  .weektoggle {
    width: 85rpx;
    height: 32rpx;
    position: relative;
    bottom: -42rpx;
    &.down {
      transform: rotate(180deg);
      bottom: 0;
    }
  }
}
</style>
