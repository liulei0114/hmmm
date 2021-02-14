<template>
  <div>录入试题</div>
</template>

<script>
export default {
  data () {
    return {
      questionId: ''
    }
  },
  created () {
    this.questionId = this.$route.query.id
  }
}
</script>

<style lang="less" scoped>
</style>
