<template>
  <div id="TagWrap">
    <el-card class="box-card">
      <div class="search_wrap flexC">
        <span style="fontWeight:700;marginRight:15px">标签名称</span>
        <el-input v-model.trim="tagName"></el-input>
        <span style="fontWeight:700;marginRight:15px">状态</span>
        <el-select v-model="isUsed">
          <el-option :value="1" label="启用"></el-option>
          <el-option :value="0" label="禁用"></el-option>
        </el-select>
        <el-button style="marginLeft:15px" @click="clearTagName()">清空</el-button>
        <el-button type="primary" @click="getTagList(true)">搜索</el-button>
        <div style="marginLeft:auto">
          <el-button
            icon="el-icon-back"
            type="text"
            @click="$router.push({name:'subjects-list'})"
          >返回学科</el-button>
          <el-button type="success" icon="el-icon-edit" @click="addTagInfo()">新增标签</el-button>
        </div>
      </div>
      <div class="list_info">
        <el-alert :title="_title" type="info" show-icon :closable="false"></el-alert>
      </div>
      <el-table :data="tagList" style="width: 100%" :header-cell-style="setFirstHeadClass">
        <el-table-column label="序号" width="50" align="center" type="index"></el-table-column>
        <el-table-column label="所属学科" width="200" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.subjectName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="目录名称" align="center" width="200">
          <template slot-scope="scope">
            <span>{{scope.row.tagName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建者" align="center" width="200">
          <template slot-scope="scope">
            <span>{{scope.row.username}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" align="center">
          <template slot-scope="scope">
            <span>{{ formatDate(scope.row.addDate)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="130">
          <template slot-scope="scope">
            <span>{{scope.row.state === 1?'已启用':'已禁用'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230">
          <template slot-scope="scope">
            <el-link
              type="primary"
              style="margin:0 5px"
              @click="handleTagUsedState(scope.row)"
            >{{scope.row.state === 1?'禁用':'启用'}}</el-link>
            <el-link
              :type="scope.row.state === 1?'info':'primary'"
              style="margin:0 5px"
              :disabled="scope.row.state === 1"
              @click="editTagInfo(scope.row)"
            >修改</el-link>
            <el-link
              :type="scope.row.state === 1?'info':'primary'"
              style="margin:0 5px"
              :disabled="scope.row.state === 1"
              @click="handleDeleteTagInfo(scope.row.id)"
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
    <el-dialog :title="handleType" :visible.sync="editTagVisible" width="20%" @close='closeDialog'>
      <el-form :model="tagInfo" :rules="rules" ref="tagForm">
        <el-form-item label="所属学科" label-width="100px" prop="subjectID">
          <el-select v-model="tagInfo.subjectID" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in subjectTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签名称" label-width="100px" prop="tagName">
          <el-input v-model.trim="tagInfo.tagName" autocomplete="on" size="medium"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editTagVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleTagInfoOption()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTagListApi,
  editTagInfoApi,
  deleteTagInfoApi,
  addTagInfoApi,
  editTagStateApi,
  getSubjectTypeListApi
} from '@/network/api/HmmmApi'
import Pagination from '@/mixins/pagination.js'
export default {
  mixins: [Pagination],
  data () {
    return {
      subjectId: '',
      tagName: '',
      isUsed: '',
      tagList: [],
      fetchDataList: this.getTagList,
      editTagVisible: false,
      tagInfo: {},
      rules: {
        tagName: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '长度在 1 到 10 个字符',
            trigger: 'blur'
          }
        ],
        subjectID: [
          { required: true, message: '请选择学科', trigger: 'onchange' }
        ]
      },
      handleType: '',
      subjectTypeList: []
    }
  },
  computed: {
    _title () {
      return `共${this.pageInfo.total}条记录`
    }
  },
  watch: {
    '$route.query.id': {
      immediate: true,
      handler (id) {
        this.subjectId = id
        this.getTagList()
      }
    }
  },
  created () {
    this.getSubjectTypeList()
  },
  methods: {
    async getTagList (flag) {
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
      if (this.tagName) params.tagName = this.tagName
      if (this.isUsed !== '') params.state = this.isUsed
      if (this.subjectId) params.subjectID = this.subjectId

      let result = await getTagListApi(params)
      this.pageInfo.total = result.counts
      this.tagList = result.items
    },
    async getSubjectTypeList () {
      let result = await getSubjectTypeListApi()
      this.subjectTypeList = result
    },
    setFirstHeadClass () {
      return { 'background-color': '#fafafa' }
    },
    clearTagName () {
      this.tagName = ''
      this.isUsed = ''
      this.getTagList()
    },
    editTagInfo (tagInfo) {
      this.handleType = '编辑标签'
      this.editTagVisible = true
      this.tagInfo = this._.cloneDeep(tagInfo)
    },
    handleTagInfoOption () {
      this.$refs.tagForm.validate(async (flag) => {
        if (flag) {
          try {
            if (this.handleType === '编辑标签') {
              await editTagInfoApi(
                this.tagInfo.id,
                this.tagInfo
              )
            } else {
              await addTagInfoApi(this.tagInfo)
            }
            this.$message({
              message: `${this.handleType}成功`,
              type: 'success'
            })
            this.editTagVisible = false
            this.getTagList()
          } catch (error) {
            this.$message({
              message: error,
              type: 'error'
            })
          }
        }
      })
    },
    handleDeleteTagInfo (id) {
      this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteTagInfoApi(id)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getTagList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    addTagInfo () {
      this.handleType = '新增标签'
      this.tagInfo = {}
      this.editTagVisible = true
    },
    pageToDirectorys (id) {
      this.$router.push({ name: 'subjects-directorys', query: { id } })
    },
    async handleTagUsedState (row) {
      try {
        let id = row.id
        let state = ~~!row.state
        await editTagStateApi(id, state)
        this.$message.success('操作成功')
        this.getTagList()
      } catch (error) {
        this.$message.error(error)
      }
    },
    closeDialog () {
      this.$refs.tagForm.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
#TagWrap {
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
}
</style>
