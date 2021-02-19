<template>
  <div id="VideoWrap">
    <div class="close" @click="closeVideo">
      <i class="el-icon-close"></i>
    </div>
    <div class="video">
      <video ref="videoRef" :src="videoUrl" width="100%" height="100%"></video>
    </div>
  </div>
</template>

<script>
export default {
  watch: {
    isShow (flag) {
      this.$nextTick(() => {
        if (flag) {
          this.$refs.videoRef.play()
        }
      })
    }
  },
  props: {
    videoUrl: {
      type: String,
      default: ''
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeVideo () {
      let vidoeDom = this.$refs.videoRef
      if (vidoeDom.played) {
        vidoeDom.pause()
      }
      this.$emit('update:isShow', false)
    }
  }
}
</script>
<style lang="less" scoped>
#VideoWrap {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 9999;
  overflow: hidden;
  .close {
    width: 50px;
    height: 50px;
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translate(-50%);
    background: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 5px rgb(0 0 0 / 40%);
    border-radius: 50%;
    text-align: center;
    line-height: 50px;
    color: #fff;
    font-size: 20px;
  }
  .video {
    width: 800px;
    height: 600px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
