<template>
  <view class="page">
    <view class="calendar">
      <calendar :open="false" @onDayClick="onDayClick"></calendar>
      <selector
        ref="selector"
        @selectTime="selectTimeEvent"
      ></selector>
    </view>
    <view class="room-info">
      <u-form :model="model" :rules="rules" ref="uForm">
        <u-form-item label-width="150" label="会议名称" prop="name">
          <u-input
            :border="border"
            placeholder="请填写会议室名称"
            v-model="model.name"
            type="text"
          ></u-input>
        </u-form-item>
        <u-form-item label="会议内容" label-width="150" prop="content">
          <u-input
            type="textarea"
            :border="border"
            placeholder="请填写会议内容"
            v-model="model.content"
          />
        </u-form-item>
        <u-form-item label="部门" label-width="150" prop="department">
          <u-input
            type="text"
            :border="border"
            placeholder="请输入部门"
            v-model="model.department"
          />
        </u-form-item>
        <u-form-item label="创建人电话" label-width="150" prop="phone">
          <u-input
            type="text"
            :border="border"
            placeholder="请输入手机号"
            v-model="model.phone"
          />
        </u-form-item>
      </u-form>
    </view>
    <view class="submit">
      <u-button @click="submit" type="success">预定</u-button>
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
      model: {
        name: "",
        content: "",
        department: "",
        phone: "",
      },
      currentDate: "",
      startTime: 0,
      endTime: "",
      selectedTime: [],
      rules: {
        name: [
          {
            required: true,
            message: "请输入会议名称",
            trigger: "blur",
          },
        ],
        content: [
          {
            required: true,
            message: "请输入会议内容",
            trigger: "blur",
          },
        ]
      },
      border: false,
    };
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
  onLoad(options) {
    this.roomId = options.roomId;
    this.currentDate = this.getToday();
    const query = this.Bmob.Query("order");
    query.include("roomId");
    query.equalTo("roomId", "==", options.roomId);
    query.find().then((res) => {
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
    onDayClick(data) {
      this.currentDate = data.date;
      this.$refs.selector.updateData(data.date,this.selectedTime);
    },
    selectTimeEvent(data) {
      this.startTime = data[0];
      this.endTime = data[1];
    },
    submit() {
      this.$refs.uForm.validate((valid) => {
        if (valid) {
          if (!this.endTime) {
            uni.showToast({
              title: "请选择结束时间",
              duration: 2000,
            });
            return;
          }
          let current = this.Bmob.User.current();
          const userPointer = this.Bmob.Pointer("_User");
          const userPoiID = userPointer.set(current.objectId);
          const roomPointer = this.Bmob.Pointer("room");
          const roomPoiID = roomPointer.set(this.roomId);
          const query = this.Bmob.Query("order");
          query.set("name", this.model.name);
          query.set("content", this.model.content);
          query.set("department", this.model.department);
          query.set("phone", this.model.phone);
          query.set("date", this.currentDate);
          query.set("startTime", this.startTime);
          query.set("endTime", this.endTime);
          query.set("roomId", roomPoiID);
          query.set("userId", userPoiID);
          query
            .save()
            .then((res) => {
              uni.showToast({
                title: "预定成功",
                duration: 2000,
              });
              uni.navigateBack();
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("验证失败");
        }
      });
    },
  },
};
</script>
<style>
.page {
  background: #eee;
}

.page .room-info {
  margin-top: 10px;
  background: #ffffff;
  padding-left: 10px;
  padding-right: 10px;
}

.page .submit {
  margin: 10px;
}
</style>