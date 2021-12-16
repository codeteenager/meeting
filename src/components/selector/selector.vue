<template>
  <view class="container">
    <view class="time-box">
      <block v-for="(item, _index) in timeArr" :key="_index">
        <view class="item">
          <view
            class="item-box"
            :class="{
              disable: item.disable,
              active: timeActive.indexOf(_index) >= 0,
            }"
            :style="{
              background:
                _index <= timeActive[1] && _index >= timeActive[0]
                  ? selectedItemColor
                  : '#F1F3F6',
              filter:
                _index < timeActive[1] && _index > timeActive[0]
                  ? 'opacity(0.3)'
                  : '',
            }"
            @click="selectTimeEvent(_index, item)"
          >
            <text>{{ item.time }}</text>
            <text class="all" v-if="item.disable">{{ disableText }}</text>
            <text
              class="all"
              v-if="_index == timeActive[0] && !item.disable"
              style="font-size: 12upx"
              >开始时间</text
            >
            <text
              class="all"
              v-if="_index == timeActive[1] && !item.disable"
              style="font-size: 12upx"
              >结束时间</text
            >
          </view>
        </view>
      </block>
    </view>
  </view>
</template>

<script>
import { timeData, timeStamp } from "./date.js";
let maxIndex;
export default {
  name: "selector",
  props: {
    //开始时间选项
    startTime: {
      type: String,
      default: "08:00",
    },
    //结束时间选项
    endTime: {
      type: String,
      default: "18:00",
    },
    currentDate: {
      type: String,
      default: new Date().toString(),
    },
    // 默认选择的时间段间隔
    timeSlot: {
      type: Number,
      default: 0,
    },
    //时间间隔
    timeInterval: {
      type: [Number, String],
      default: 1, //一小时
    },
    //选中的时间颜色
    selectedItemColor: {
      type: String,
      default: "#00cab7",
    },
    //禁用显示的文本
    disableText: {
      type: String,
      default: "约满",
    },
  },
  data() {
    return {
      timeArr: [], //时间数据
      timeActive: [], //选中的时间索引
      selectTime: [], //选择的时间
      currentTimeStamp: "",
      currentTime: "",
      selectedTime: [],
      tabs: 0,
    };
  },
  mounted() {
    //获取时间数据
    // this.timeArr = timeData(
    //   this.currentDate,
    //   this.startTime,
    //   this.endTime,
    //   this.timeInterval
    // );
    // maxIndex = this.timeArr[this.timeArr.length - 1]["index"];
    // //当前时间戳
    // this.currentTimeStamp = Date.now();
    // this.currentTime = timeStamp(this.currentTimeStamp).hour;
    // let currentDate = this.getToday();
    // this.timeArr.map((item) => {
    //   if (item.time < this.currentTime) {
    //     return (item.disable = 1);
    //   }
    //   for (let i = 0; i < this.selectedTime.length; i++) {
    //     if (
    //       Date.parse(currentDate) == Date.parse(this.selectedTime[i]["date"]) &&
    //       item.index >= this.selectedTime[i]["startTime"] &&
    //       item.index <= this.selectedTime[i]["endTime"]
    //     ) {
    //       return (item.disable = 1);
    //     }
    //   }

    //   return (item.disable = 0);
    // });
    // this.timeArr.some((item, index) => {
    //   // 默认选中的时间段
    //   const endIndex =
    //     this.timeSlot / this.timeInterval + index > maxIndex
    //       ? maxIndex
    //       : this.timeSlot / this.timeInterval + index;
    //   this.selectTime = [
    //     this.timeArr[index]["time"],
    //     this.timeArr[endIndex]["time"],
    //   ]; //默认选中的时间
    //   this.timeActive = [index, endIndex]; //选中的时间索引
    //   return !item.disable;
    // });
  },
  methods: {
    updateData(selectDate,selectedTime) {
      this.selectedTime = selectedTime;
      console.log(JSON.stringify(this.selectedTime));
      //获取时间数据
      this.timeArr = timeData(
        selectDate,
        this.startTime,
        this.endTime,
        this.timeInterval
      );
      maxIndex = this.timeArr[this.timeArr.length - 1]["index"];
      //当前时间戳
      this.currentTimeStamp = Date.now();
      let currentDate = this.getToday();

      this.currentTime = timeStamp(this.currentTimeStamp).hour;
      this.timeArr.map((item) => {
        if (Date.parse(selectDate) < Date.parse(currentDate)) {
          return (item.disable = 1);
        }
        if (
          Date.parse(selectDate) == Date.parse(currentDate) &&
          item.time < this.currentTime
        ) {
          return (item.disable = 1);
        }
        for (let i = 0; i < this.selectedTime.length; i++) {
          if (
            Date.parse(selectDate) ==
              Date.parse(this.selectedTime[i]["date"]) &&
            item.index >= this.selectedTime[i]["startTime"] &&
            item.index <= this.selectedTime[i]["endTime"]
          ) {
            return (item.disable = 1);
          }
        }

        return (item.disable = 0);
      });
      this.timeArr.some((item, index) => {
        // 默认选中的时间段
        const endIndex =
          this.timeSlot / this.timeInterval + index > maxIndex
            ? maxIndex
            : this.timeSlot / this.timeInterval + index;
        this.selectTime = [
          this.timeArr[index]["time"],
          this.timeArr[endIndex]["time"],
        ]; //默认选中的时间
        this.timeActive = [index, endIndex]; //选中的时间索引
        return !item.disable;
      });
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
    selectTimeEvent(index, item) {
      if (item.disable || this.timeActive.indexOf(index) > -1) return;
      this.tabs++;
      if (this.tabs % 2 == 0) {
        this.$set(this.timeActive, 1, index);
        this.selectTime[1] = this.timeArr[index]["time"];
      } else {
        this.$set(this.timeActive, 0, index);
        this.selectTime[0] = this.timeArr[index]["time"];
      }
      // 判断用户选择的时间是否大于第一次选择的时间
      if (this.timeActive[0] > this.timeActive[1]) {
        const tempTime = this.selectTime[0];
        const tempIndex = this.timeActive[0];
        this.selectTime[0] = this.selectTime[1];
        this.selectTime[1] = tempTime;
        this.$set(this.timeActive, 0, this.timeActive[1]);
        this.$set(this.timeActive, 1, tempIndex);
      }
      this.$emit("selectTime", this.timeActive);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  background-color: #fff;
  view,
  text,
  image {
    box-sizing: border-box;
  }
  .time-box {
    padding: 28upx 12upx 26upx;
    display: flex;
    flex-wrap: wrap;
    .item {
      width: 25%;
      padding: 0 9upx;
      margin-bottom: 18upx;
      &-box {
        width: 100%;
        height: 80upx;
        padding: 0 44upx;
        background: #f1f3f6;
        color: #333;
        font-size: 28upx;
        border-radius: 10upx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        &.disable {
          background: #f1f3f6 !important;
          color: #999 !important;
        }
        &.active {
          // background: #0094D7;
          color: #fff;
          font-weight: bold;
        }
        .all {
          font-size: 22upx;
        }
      }
    }
  }
}
</style>
