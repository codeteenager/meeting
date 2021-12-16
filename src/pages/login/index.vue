<template>
  <view class="page">
    <image class="logo" src="/static/images/logo.png"></image>
    <text class="title">赞同会议室</text>
    <text class="subtitle">每一次讨论，都会激发我们无线灵感~</text>
    <view class="form">
      <u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
        <u-form-item label="账号" prop="username">
          <u-input
            :border="border"
            placeholder="请输入账号"
            v-model="model.username"
            type="text"
          ></u-input>
        </u-form-item>
        <u-form-item label="密码" prop="password">
          <u-input
            :password-icon="true"
            :border="border"
            type="password"
            v-model="model.password"
            placeholder="请输入密码"
          ></u-input>
        </u-form-item>
      </u-form>
    </view>
    <view class="login-btn">
      <u-button @click="submit" type="success" shape="circle">登录</u-button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      model: {
        username: "A6745",
        password: "123456",
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur",
          },
          {
            min: 3,
            max: 5,
            message: "账号长度在3到5个字符",
            trigger: ["change", "blur"],
          },
          {
            validator: (rule, value, callback) => {
              return this.$u.test.chinese(value);
            },
            trigger: ["change", "blur"],
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: ["change", "blur"],
          },
          {
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]+\S{5,12}$/,
            message: "需同时含有字母和数字，长度在6-12之间",
            trigger: ["change", "blur"],
          },
        ],
        border: false,
      },
    };
  },
  methods: {
    submit() {
      this.$refs.uForm.validate((valid) => {
        if (valid) {
          console.log(this.model.username);
          console.log(this.model.password);
          this.Bmob.User.login(this.model.username, this.model.password)
            .then((res) => {
              uni.switchTab({
                url: "../home/index",
              });
            })
            .catch((err) => {
              console.log(err);
              uni.showToast({
                title: "账号密码错误!",
                icon: "error",
                duration: 2000,
              });
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
  height: 100%;
  background: #fff;
  padding: 40rpx;
}
.page .logo {
  width: 544rpx;
  height: 376rpx;
  margin-left: 120rpx;
  margin-top: 30rpx;
}
.page .title {
  color: #333333;
  display: block;
  font-size: 50rpx;
  font-weight: bold;
}
.page .subtitle {
  color: #bfbfbf;
  display: block;
  margin-top: 5rpx;
  font-size: 30rpx;
}
.page .form {
  margin-top:30rpx;
}
.page .login-btn {
  margin-top: 40rpx;
}
</style>