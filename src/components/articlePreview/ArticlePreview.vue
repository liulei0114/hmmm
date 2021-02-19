<template>
  <div id="ArticlePreviewWrap">
    <el-dialog title="预览文章" :visible.sync="articleDialogVisible" width="41%" @close="closeDialog">
      <div class="article_header">
        <h2>{{articleInfo.title}}</h2>
        <div>
          <span style="margin:0 10px">{{formatDate(articleInfo.createTime)}}</span>
          <span style="marginRight:10px">{{articleInfo.username}}</span>
          <i style="marginRight:10px" class="el-icon-view"></i>
          <span>{{articleInfo.visits}}</span>
        </div>
      </div>
      <div class="article_body">
        <div v-html="articleInfo.articleBody"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      articleDialogVisible: false
    }
  },
  props: {
    articleInfo: {
      type: Object,
      default: () => {}
    }
  },
  created () {
    this.$bus.$on('openArticlePreview', (flag) => {
      this.articleDialogVisible = flag
    })
  },
  methods: {
    closeDialog () {
      this.articleDialogVisible = false
    },
    formatDate (date) {
      return this.$moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style lang="less" scoped>
#ArticlePreviewWrap {
  /deep/ .el-dialog {
    .el-dialog__body {
      padding: 10px 20px !important;
      .article_header {
        border-bottom: 1px dashed #ccc;
        padding-bottom: 10px;
        h2{
          margin: 0;
          padding: 0;
        }
      }
      .article_body {
        background: #f5f5f5;
        padding: 10px;
        .ql-align-center{
          text-align: center;
        }
      }
    }
  }
}
</style>
