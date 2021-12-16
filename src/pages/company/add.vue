<template>
  <view class="wrap">
    <u-form :model="model" :rules="rules" ref="uForm">
      <u-form-item label-width="120" label="名称" prop="name">
        <u-input
          :border="border"
          placeholder="请输入名称"
          v-model="model.name"
          type="text"
        ></u-input>
      </u-form-item>
      <u-form-item label="上传图片" prop="cover" label-width="120">
        <view class="upload-content">
          <image v-if="model.cover" :src="model.cover" class="preview"></image>
          <view
            class="u-list-item u-add-wrap"
            hover-class="u-add-wrap__hover"
            hover-stay-time="150"
            @tap="selectFile"
          >
            <u-icon name="plus" class="u-add-btn" size="40"></u-icon>
            <view class="u-add-tips">选择图片</view>
          </view>
        </view>
      </u-form-item>
    </u-form>
    <u-button type="primary" @click="submit">提交</u-button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      model: {
        name: "",
        cover: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur",
          },
        ],
      },
      border: false,
    };
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
  methods: {
    submit() {
      this.$refs.uForm.validate((valid) => {
        if (valid) {
          const query = this.Bmob.Query("company");
          query.set("name", this.model.name);
          query.set("cover", this.model.cover);
          query
            .save()
            .then((res) => {
              uni.showToast({
                title: "新建成功",
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
    selectFile() {
      let _this = this;
      uni.chooseImage({
        success: function (res) {
          let tempFilePaths = res.tempFilePaths;
          let filePath = tempFilePaths[0];
          let index = filePath.lastIndexOf("/");
          let fileName = filePath.substr(index + 1);
          let file = _this.Bmob.File(fileName, tempFilePaths[0]);
          file.save().then((res) => {
            let fileInfo = res[0];
            _this.model.cover = fileInfo.url;
          });
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.wrap {
  padding: 20px;
  background-color: #ffffff;
}

.upload-content {
  display: flex;
  flex-direction: row;
}

.u-list-item {
  width: 60px;
  height: 60px;
  overflow: hidden;
  background: rgb(244, 245, 246);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview {
  width: 60px;
  height: 60px;
  margin-right: 10px;
}

.u-add-wrap {
  flex-direction: column;
  color: $u-content-color;
  font-size: 10px;
}

.u-add-tips {
  margin-top: 10px;
  line-height: 10px;
}
</style>
