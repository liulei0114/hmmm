<template>
  <div id="ArticleWrap">
    <el-card class="box-card">
      <div class="search_wrap flexC">
        <span style="fontWeight:700;marginRight:15px">关键字</span>
        <el-input v-model.trim="keyword"></el-input>
        <span style="fontWeight:700;marginRight:15px">状态</span>
        <el-select v-model="isUsed">
          <el-option :value="1" label="启用"></el-option>
          <el-option :value="0" label="禁用"></el-option>
        </el-select>
        <el-button style="marginLeft:15px" @click="clearKeyword()">清空</el-button>
        <el-button type="primary" @click="getArticleList(true)">搜索</el-button>
        <div style="marginLeft:auto">
          <el-button type="success" icon="el-icon-edit" @click="addArticleInfo()">新增技巧</el-button>
        </div>
      </div>
      <div class="list_info">
        <el-alert :title="_title" type="info" show-icon :closable="false"></el-alert>
      </div>
      <el-table :data="articleList" style="width: 100%" :header-cell-style="setFirstHeadClass">
        <el-table-column label="序号" align="left" width="150" type="index"></el-table-column>
        <el-table-column label="文章标题" width="400" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
            <i
              class="el-icon-film playVideo"
              v-if="scope.row.videoURL"
              @click="playVideo(scope.row.videoURL)"
            ></i>
          </template>
        </el-table-column>
        <el-table-column label="阅读数" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.visits}}</span>
          </template>
        </el-table-column>
        <el-table-column label="录入人" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.username}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" align="center">
          <template slot-scope="scope">
            <span>{{ formatDate(scope.row.createTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.state === 1?'已启用':'已禁用'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230">
          <template slot-scope="scope">
            <el-link type="primary" style="margin:0 5px" @click="handleArticlePreview(scope.row)">预览</el-link>
            <el-link
              type="primary"
              style="margin:0 5px"
              @click="handleArticleUsedState(scope.row)"
            >{{scope.row.state === 1?'禁用':'启用'}}</el-link>
            <el-link
              :type="scope.row.state === 1?'info':'primary'"
              style="margin:0 5px"
              :disabled="scope.row.state === 1"
              @click="editArticleInfo(scope.row)"
            >修改</el-link>
            <el-link
              :type="scope.row.state === 1?'info':'primary'"
              style="margin:0 5px"
              :disabled="scope.row.state === 1"
              @click="handleDeleteArticleInfo(scope.row.id)"
            >删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageInfo.page"
          :page-sizes="[1, 10, 15, 20]"
          :page-size="pageInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageInfo.total"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 编辑弹窗 -->
    <el-dialog :title="handleType" :visible.sync="editArticleVisible" width="=40%" @close='closeDialog'>
      <el-form :model="articleInfo" :rules="rules" ref="articleForm">
        <el-form-item label="文章标题" label-width="100px" prop="title">
          <el-input v-model.trim="articleInfo.title" placeholder="请输入文章标题"></el-input>
        </el-form-item>
        <el-form-item label="文章内容" label-width="100px" prop="articleBody">
            <quill-editor
            class="editor"
            v-model.trim="articleInfo.articleBody"
            ref="myQuillEditor"
            :options="editorOption"
          ></quill-editor>
        </el-form-item>
         <el-form-item label="视频地址" label-width="100px" prop="videoURL" style="marginTop:75px">
          <el-input v-model.trim="articleInfo.videoURL"></el-input>
         </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editArticleVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleArticleInfoOption()">确 定</el-button>
      </div>
    </el-dialog>
    <play-video :videoUrl="videoUrl" v-show="isShowVideo" :isShow.sync="isShowVideo"></play-video>
    <article-preview :articleInfo='previewArticleInfo'></article-preview>
  </div>
</template>

<script>
import {
  getArticleListApi,
  editArticleInfoApi,
  deleteArticleInfoApi,
  addArticleInfoApi,
  editArticleStateApi
} from '@/network/api/HmmmApi'
import Pagination from '@/mixins/pagination.js'
import PlayVideo from '@/components/video/PlayVideo.vue'
import ArticlePreview from '@/components/articlePreview/ArticlePreview.vue'
import { toolbar } from '@/views/questions-new/vue-quill-editor.config'
export default {
  mixins: [Pagination],
  data () {
    return {
      keyword: '',
      isUsed: '',
      articleList: [],
      fetchDataList: this.getArticleList,
      editArticleVisible: false,
      articleInfo: {},
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          {
            min: 1,
            max: 40,
            message: '长度在 1 到 40 个字符',
            trigger: 'blur'
          }
        ],
        articleBody: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ]
      },
      handleType: '',
      videoUrl: '',
      isShowVideo: false,
      previewArticleInfo: {},
      editorOption: {
        theme: 'snow',
        placeholder: '请输入正文',
        modules: {
          //  富文本编辑器配置
          toolbar: toolbar
        }
      }
    }
  },
  computed: {
    _title () {
      return `共${this.pageInfo.total}条记录`
    }
  },
  created () {
    this.getArticleList()
  },
  methods: {
    async getArticleList (flag) {
      if (flag) {
        this.pageInfo = {
          page: 1,
          pagesize: 10,
          total: 0
        }
      }
      let params = {
        ...this.pageInfo
      }
      if (this.keyword) params.keyword = this.keyword
      if (this.isUsed !== '') params.state = this.isUsed

      let result = await getArticleListApi(params)
      this.pageInfo.total = result.counts
      this.articleList = result.items
    },

    setFirstHeadClass () {
      return { 'background-color': '#fafafa' }
    },
    clearKeyword () {
      this.keyword = ''
      this.isUsed = ''
      this.getArticleList()
    },
    editArticleInfo (articleInfo) {
      this.handleType = '编辑技巧'
      this.editArticleVisible = true
      this.articleInfo = this._.cloneDeep(articleInfo)
    },
    handleArticleInfoOption () {
      this.$refs.articleForm.validate(async (flag) => {
        if (flag) {
          try {
            if (this.handleType === '编辑技巧') {
              await editArticleInfoApi(this.articleInfo.id, this.articleInfo)
            } else {
              await addArticleInfoApi(this.articleInfo)
            }
            this.$message({
              message: `${this.handleType}成功`,
              type: 'success'
            })
            this.editArticleVisible = false
            this.getArticleList()
          } catch (error) {
            this.$message({
              message: error,
              type: 'error'
            })
          }
        }
      })
    },
    handleDeleteArticleInfo (id) {
      this.$confirm('此操作将永久删除该该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteArticleInfoApi(id)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getArticleList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    addArticleInfo () {
      this.handleType = '新增技巧'
      this.articleInfo = {}
      this.editArticleVisible = true
    },
    playVideo (videoUrl) {
      this.videoUrl = videoUrl
      this.isShowVideo = true
    },
    async handleArticleUsedState (row) {
      try {
        let id = row.id
        let state = ~~!row.state
        await editArticleStateApi(id, state)
        this.$message.success('操作成功')
        this.getArticleList()
      } catch (error) {
        this.$message.error(error)
      }
    },
    handleArticlePreview (articleInfo) {
      this.previewArticleInfo = articleInfo
      this.$bus.$emit('openArticlePreview', true)
    },
    closeDialog () {
      this.$refs.articleForm.resetFields()
    }
  },
  components: { PlayVideo, ArticlePreview }

}
</script>

<style lang="less" scoped>
#ArticleWrap {
  .search_wrap {
    .el-input {
      width: 200px;
      margin-right: 20px;
    }
  }
  .list_info {
    margin: 20px 0;
  }
  .el-table {
    margin-top: 20px;
  }
  .pagination {
    margin: 20px 10px 0 0;
    text-align: right;
  }
  /deep/ .el-dialog {
    border-radius: 15px;
    overflow: hidden;
    .el-dialog__header {
      background-color: #409eff;
      .el-dialog__title {
        color: #fff;
      }
      .el-dialog__close {
        color: #fff;
      }
    }
    .el-dialog__body {
      // padding: 30px  0px;
      /deep/ .el-form-item__label {
        color: #606266;
        font-weight: 600;
      }
    }
  }
  .playVideo {
    color: #00f;
    margin-left: 10px;
    font-size: 18px;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
