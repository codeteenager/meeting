<script>
export default {
  onLaunch() {
    let current = this.Bmob.User.current();
    if (current) {
      uni.switchTab({ url: "pages/home/index" });
    } else {
      uni.reLaunch({ url: "pages/login/index" });
    }
  }
};
</script>
<style lang="scss">
@import "uview-ui/index.scss";
page {
  height: 100%;
  background-color: #ffffff;
}
</style>