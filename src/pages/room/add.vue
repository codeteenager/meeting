<template>
  <view class="page">
    <u-form :model="model" :rules="rules" ref="uForm">
      <u-form-item label-width="150" label="会议室名称" prop="name">
        <u-input
          :border="border"
          placeholder="请输入会议室名称"
          v-model="model.name"
          type="text"
        ></u-input>
      </u-form-item>
      <u-form-item label="上传图片" prop="cover" label-width="150">
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
      <u-form-item label-width="150" label="会议室描述" prop="description">
        <u-input
          :border="border"
          placeholder="请输入会议室描述"
          v-model="model.description"
          type="text"
        ></u-input>
      </u-form-item>
      <u-form-item label-width="150" label="可容纳人数" prop="number">
        <u-input
          :border="border"
          placeholder="请输入会议室人数"
          v-model="model.number"
          type="number"
        ></u-input>
      </u-form-item>
      <u-form-item label="会议室地点" prop="companyName" label-width="150">
        <u-input
          :border="border"
          type="select"
          :select-open="selectShow"
          v-model="model.companyName"
          placeholder="请选择会议室地点"
          @click="selectShow = true"
        ></u-input>
      </u-form-item>
      <u-form-item label="是否有投影" prop="projector" label-width="150">
        <u-radio-group v-model="projector" @change="projectorGroupChange">
          <u-radio
            v-for="(item, index) in radioList"
            :key="index"
            :name="item.value"
            >{{ item.name }}</u-radio
          >
        </u-radio-group>
      </u-form-item>
    </u-form>
    <u-button type="primary" @click="submit">提交</u-button>
    <u-select
      mode="single-column"
      :list="selectList"
      v-model="selectShow"
      @confirm="selectConfirm"
    ></u-select>
  </view>
</template>

<script>
export default {
  data() {
    return {
      model: {
        name: "",
        cover: "",
        description: "",
        number: "",
        projector: 1,
        companyName: "",
        companyId: "",
      },
      radioList: [
        {
          name: "是",
          value: 1,
        },
        {
          name: "否",
          value: 0,
        },
      ],
      selectList: [],
      rules: {
        name: [
          {
            required: true,
            message: "请输入会议室名称",
            trigger: "blur",
          },
        ],
        description: [
          {
            required: true,
            message: "请输入会议室描述",
            trigger: "blur",
          },
        ],
        number: [
          {
            required: true,
            message: "请输入会议室人数",
            trigger: "blur",
          },
        ],
        companyName: [
          {
            required: true,
            message: "请输入会议室地点",
            trigger: "blur",
          },
        ],
      },
      selectShow: false,
      projector: 1,
      border: false,
    };
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules);
    const query = this.Bmob.Query("company");
    query.find().then((res) => {
      this.selectList = [];
      res.forEach((item) => {
        this.selectList.push({
          label: item.name,
          value: item.objectId,
        });
      });
    });
  },
  methods: {
    submit() {
      this.$refs.uForm.validate((valid) => {
        if (valid) {
          if (!this.model.cover) return this.$u.toast("请上传图片");
          const query = this.Bmob.Query("room");
          query.set("name", this.model.name);
          query.set("cover", this.model.cover);
          query.set("description", this.model.description);
          query.set("number", this.model.number);
          query.set("companyId", this.model.companyId);
          query.set("projector", this.model.projector == 1 ? true : false);
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
    selectConfirm(e) {
      this.model.companyName = e[0].label;
      this.model.companyId = e[0].value;
    },
    projectorGroupChange(e) {
      this.model.projector = e;
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

<style lang="scss" scoped>
.page {
  height: 100%;
  padding: 0px 20px;
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
