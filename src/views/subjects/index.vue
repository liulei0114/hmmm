<template>
  <div id="SubjectWrap">
    <el-card class="box-card">
      <div class="search_wrap flexC">
        <span style="fontWeight:700;marginRight:15px">学科名称</span>
        <el-input v-model="subjectName"></el-input>
        <el-button @click="clearSubjectName()">清空</el-button>
        <el-button type="primary" @click="getSubjectList(true)">搜索</el-button>
        <el-button
          type="success"
          icon="el-icon-edit"
          style="marginLeft:auto"
          @click="addSubject()"
        >新增学科</el-button>
      </div>
      <div class="list_info">
        <el-alert :title="_title" type="info" show-icon :closable="false"></el-alert>
      </div>
      <el-table :data="subjectList" style="width: 100%" :header-cell-style="setFirstHeadClass">
        <el-table-column label="序号" width="50" align="center" type="index"></el-table-column>
        <el-table-column label="学科名称" width="200" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.subjectName }}</span>
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
        <el-table-column label="前台是否显示" align="center" width="150">
          <template slot-scope="scope">
            <span>{{scope.row.isFrontDisplay === 1?'是':'否'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="二级目录数量" align="center" width="130">
          <template slot-scope="scope">
            <span>{{scope.row.twoLevelDirectory}}</span>
          </template>
        </el-table-column>
        <el-table-column label="标签数量" align="center" width="130">
          <template slot-scope="scope">
            <span>{{scope.row.tags}}</span>
          </template>
        </el-table-column>
        <el-table-column label="题目数量" align="center" width="130">
          <template slot-scope="scope">
            <span>{{scope.row.totals}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230">
          <template slot-scope="scope">
            <el-link
              type="primary"
              style="margin:0 5px"
              @click="pageToDirectorys(scope.row.id)"
            >学科分类</el-link>
            <el-link type="primary" style="margin:0 5px" @click="pageToTags(scope.row.id)">学科标签</el-link>
            <el-link type="primary" style="margin:0 5px" @click="editSubjectInfo(scope.row)">修改</el-link>
            <el-link
              type="primary"
              style="margin:0 5px"
              @click="handleDeleteSubjectInfo(scope.row.id)"
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
    <el-dialog :title="handleType" :visible.sync="editSubjectVisible" width="20%" @close='closeDialog'>
      <el-form :model="subjectInfo" :rules="rules" ref="subjectForm">
        <el-form-item label="学科名称" label-width="100px" prop="subjectName">
          <el-input v-model.trim="subjectInfo.subjectName" autocomplete="on" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="是否显示" label-width="100px">
          <el-switch
            v-model="subjectInfo.isFrontDisplay"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editSubjectVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubjectInfoOption()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSubjectListApi,
  editSubjectInfoApi,
  deleteSubjectInfoApi,
  addSubjectInfoApi
} from '@/network/api/HmmmApi'
import Pagination from '@/mixins/pagination.js'
export default {
  mixins: [Pagination],
  data () {
    return {
      subjectName: '',
      subjectList: [],
      directoryListMap: {},
      tagListMap: {},
      fetchDataList: this.getSubjectList,
      editSubjectVisible: false,
      subjectInfo: {},
      rules: {
        subjectName: [
          { required: true, message: '请输入学科名称', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '长度在 1 到 10 个字符',
            trigger: 'blur'
          }
        ]
      },
      handleType: ''
    }
  },
  computed: {
    _title () {
      return `共${this.pageInfo.total}条记录`
    }
  },
  created () {
    this.getSubjectList()
  },
  methods: {
    async getSubjectList (flag) {
      if (flag) {
        this.pageInfo = {
          page: 1,
          pagesize: 10,
          total: 0
        }
      }
      let params = { ...this.pageInfo, subjectName: this.subjectName }
      let result = await getSubjectListApi(params)
      this.pageInfo.total = result.counts
      this.subjectList = result.items
    },
    setFirstHeadClass () {
      return { 'background-color': '#fafafa' }
    },
    clearSubjectName () {
      this.subjectName = ''
      this.getSubjectList()
    },
    editSubjectInfo (subjectInfo) {
      this.handleType = '编辑学科'
      this.editSubjectVisible = true
      this.subjectInfo = this._.cloneDeep(subjectInfo)
    },
    handleSubjectInfoOption () {
      this.$refs.subjectForm.validate(async (flag) => {
        if (flag) {
          try {
            if (this.handleType === '编辑学科') {
              await editSubjectInfoApi(this.subjectInfo.id, this.subjectInfo)
            } else {
              await addSubjectInfoApi(this.subjectInfo)
            }
            this.$message({
              message: `${this.handleType}成功`,
              type: 'success'
            })
            this.editSubjectVisible = false
            this.getSubjectList()
          } catch (error) {
            this.$message({
              message: error,
              type: 'error'
            })
          }
        }
      })
    },
    handleDeleteSubjectInfo (id) {
      this.$confirm('此操作将永久删除该学科, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteSubjectInfoApi(id)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getSubjectList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    addSubject () {
      this.handleType = '新增学科'
      this.subjectInfo = {
        isFrontDisplay: 1
      }
      this.editSubjectVisible = true
    },
    pageToDirectorys (id) {
      this.$router.push({ name: 'subjects-directorys', query: { id } })
    },
    pageToTags (id) {
      this.$router.push({ name: 'subjects-tags', query: { id } })
    },
    closeDialog () {
      this.$refs.subjectForm.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
#SubjectWrap {
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
