<template>
  <div id="QuestionChoiceWrap">
    <el-card class="box-card">
      <div class="flexBetween" style="marginBottom:20px">
        <div style="font-size: 12px; color: pink;">说明：目前支持学科和关键字条件筛选</div>
        <div>
          <el-button
            size="small"
            type="success"
            icon="el-icon-edit"
            style="marginLeft:auto;marginRight:22px"
            @click="handleAddQuestion()"
          >新增试题</el-button>
        </div>
      </div>
      <div class="search_wrap">
        <el-form ref="questionSearchKey" :model="searchkey">
          <div class="search_line_con">
            <el-form-item label="学科" size="small" prop="subjectID">
              <el-select
                v-model="searchkey.subjectID"
                placeholder="请选择"
                @change="handleSubjectChange"
              >
                <el-option
                  v-for="item in subjectTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="二级目录" size="small" prop="catalogID">
              <el-select v-model="searchkey.catalogID" placeholder="请选择">
                <el-option
                  v-for="item in subjectDirList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="标签" size="small" prop="tags">
              <el-select v-model="searchkey.tags" placeholder="请选择">
                <el-option
                  v-for="item in subjectTagList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关键字" size="small" prop="keyword">
              <el-input v-model="searchkey.keyword" placeholder="根据题干搜索"></el-input>
            </el-form-item>
          </div>
          <div class="search_line_con">
            <el-form-item label="试题类型" size="small" prop="questionType">
              <el-select v-model="searchkey.questionType" placeholder="请选择">
                <el-option label="单选" :value="1"></el-option>
                <el-option label="多选" :value="2"></el-option>
                <el-option label="简答" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="难度" size="small" prop="difficulty">
              <el-select v-model="searchkey.difficulty" placeholder="请选择">
                <el-option label="简单" :value="1"></el-option>
                <el-option label="一般" :value="2"></el-option>
                <el-option label="困难" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="方向" size="small" prop="direction">
              <el-select v-model="searchkey.direction" placeholder="请选择">
                <el-option label="o2o" value="o2o"></el-option>
                <el-option label="外包服务" value="外包服务"></el-option>
                <el-option label="企业服务" value="企业服务"></el-option>
                <el-option label="互联网金融" value="互联网金融"></el-option>
                <el-option label="企业咨询" value="企业咨询"></el-option>
                <el-option label="互联网" value="互联网"></el-option>
                <el-option label="电子商务" value="电子商务"></el-option>
                <el-option label="其他" value="其他"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="录入人" size="small" prop="creatorID">
              <el-select v-model="searchkey.creatorID" placeholder="请选择">
                <el-option
                  v-for="item in permissionList"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="search_line_con">
            <el-form-item label="题目备注" size="small" prop="remarks">
              <el-input v-model="searchkey.remarks"></el-input>
            </el-form-item>
            <el-form-item label="企业简称" size="small" prop="shortName">
              <el-input v-model="searchkey.shortName"></el-input>
            </el-form-item>
            <el-form-item label="城市" size="small" class="province_area">
              <el-form-item prop="province" size="small" class="province">
                <el-select
                  v-model="searchkey.province"
                  placeholder="请选择"
                  @change="handleProvinceChange"
                >
                  <el-option label="北京市" value="北京市"></el-option>
                  <el-option label="天津市" value="天津市"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item size="small" prop="city" class="city">
                <el-select v-model="searchkey.city" placeholder="请选择">
                  <el-option
                    v-for="(area,index) in areaList"
                    :key="index"
                    :label="area.label"
                    :value="area.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form-item>
            <el-form-item size="small" class="searchBtn">
              <el-button size="small" @click="clearSearchWrap()">清空</el-button>
              <el-button size="small" type="primary" @click="getQuestionList(true)">搜索</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <el-tabs v-model="searchkey.chkState" type="card" @tab-click="getQuestionList(true)">
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane label="待审核" name="0"></el-tab-pane>
        <el-tab-pane label="已审核" name="1"></el-tab-pane>
        <el-tab-pane label="已拒绝" name="2"></el-tab-pane>
      </el-tabs>
      <div class="list_info">
        <el-alert :title="_title" type="info" show-icon :closable="false"></el-alert>
      </div>
      <el-table :data="questionList" style="width: 100%" :header-cell-style="setFirstHeadClass">
        <el-table-column label="试题编号" width="120" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学科" width="120" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.subject }}</span>
          </template>
        </el-table-column>
        <el-table-column label="目录" align="center" width="120">
          <template slot-scope="scope">
            <span>{{scope.row.catalog}}</span>
          </template>
        </el-table-column>
        <el-table-column label="题型" align="center" width="120">
          <template slot-scope="scope">
            <span>{{scope.row.questionType | filterQuestionType}}</span>
          </template>
        </el-table-column>
        <el-table-column label="题干" align="center" width="280">
          <template slot-scope="scope">
            <span v-html="scope.row.question"></span>
          </template>
        </el-table-column>
        <el-table-column label="录入时间" align="center" width="180">
          <template slot-scope="scope">
            <span>{{formatDate(scope.row.addDate)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="难度" align="center" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.difficulty | filterDifficulty}}</span>
          </template>
        </el-table-column>
        <el-table-column label="录入人" align="center" width="120">
          <template slot-scope="scope">
            <span>{{scope.row.creator}}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" align="center" width="120">
          <template slot-scope="scope">
            <span>{{scope.row.chkState | filterChkState}}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核意见" align="center" width="150">
          <template slot-scope="scope">
            <span>{{scope.row.chkRemarks}}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核人" align="center" width="120">
          <template slot-scope="scope">
            <span>{{scope.row.chkUser}}</span>
          </template>
        </el-table-column>
        <el-table-column label="发布状态" align="center" width="150">
          <template slot-scope="scope">
            <span>{{scope.row.publishState | filterPublistState(scope.row.chkState)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200" align="center">
          <template slot-scope="scope">
            <el-link type="primary" @click="handlePreviewQuestion(scope.row.id)">预览</el-link>
            <el-link
              :type="chkStateType(scope.row)"
              :disabled="chkStateType(scope.row) === 'info'"
              @click="quesetionCheck(scope.row.id)"
            >审核</el-link>
            <el-link
              :type="editStateType(scope.row)"
              :disabled="editStateType(scope.row) === 'info'"
              @click="handleEditQuestion(scope.row.id)"
            >修改</el-link>
            <el-link
              type="primary"
              @click="handleEditPublishState(scope.row.id,scope.row.publishState)"
            >{{isPublish(scope.row)}}</el-link>
            <el-link
              :type="editStateType(scope.row)"
              :disabled="editStateType(scope.row) === 'info'"
              @click="handleDeletetQuestion(scope.row.id)"
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

    <el-dialog title="题目预览" :visible.sync="questionDialogVisible" width="50%" @close="closeDialog">
      <question-detail
        ref="questionDetail"
        :questionInfo="questionInfo"
        :visible.sync="questionDialogVisible"
      ></question-detail>
    </el-dialog>
    <el-dialog title="题目审核" :visible.sync="questionDialogCheckVisible" width="20%">
      <el-radio v-model="chkState" :label="1">通过</el-radio>
      <el-radio v-model="chkState" :label="2">拒绝</el-radio>
      <el-input style="marginTop:20px" type="textarea" placeholder="请输入审核意见" v-model="checkAdvice" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="questionDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleQuesetionCheck()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/mixins/pagination.js'
import {
  getPermissionListApi,
  getSubjectTypeListApi,
  getSubjectDirectorysListApi,
  getSubjectTagListApi,
  getQuestionChoiceListApi,
  deleteQuestionApi,
  getQuestionDetailApi,
  editQuestionChoicePublishStateApi,
  editQuestionChoiceCheckStateApi
} from '@/network/api/HmmmApi'
import QuestionDetail from '@/components/question/QuestionDetail.vue'
export default {
  mixins: [Pagination],
  data () {
    return {
      searchkey: {
        subjectID: '',
        difficulty: '',
        questionType: '',
        tags: '',
        province: '',
        city: '',
        keyword: '',
        remarks: '',
        shortName: '',
        direction: '',
        creatorID: '',
        catalogID: '',
        chkState: 'all'
      },
      baseAreaList: [
        { lable: '东城区', value: '东城区' },
        { lable: '西城区', value: '西城区' },
        { lable: '朝阳区', value: '朝阳区' },
        { lable: '丰台区', value: '丰台区' },
        { lable: '石景山区', value: '石景山区' },
        { lable: '海淀区', value: '海淀区' },
        { lable: '门头沟区', value: '门头沟区' },
        { lable: '房山区', value: '房山区' },
        { lable: '通州区', value: '通州区' },
        { lable: '顺义区', value: '顺义区' },
        { lable: '昌平区', value: '昌平区' },
        { lable: '大兴区', value: '大兴区' },
        { lable: '怀柔区', value: '怀柔区' },
        { lable: '平谷区', value: '平谷区' },
        { lable: '密云区', value: '密云区' },
        { lable: '延庆区', value: '延庆区' }
      ],
      areaList: [],
      permissionList: [],
      subjectTypeList: [],
      subjectDirList: [],
      subjectTagList: [],
      questionList: [],
      fetchDataList: this.getQuestionList,
      questionDialogVisible: false,
      questionInfo: {},
      questionDialogCheckVisible: false,
      chkState: 1,
      curChkQuestionId: '',
      checkAdvice: ''
    }
  },
  computed: {
    _title () {
      return `共${this.pageInfo.total}条记录`
    }
  },
  created () {
    this.getPermissionList()
    this.getSubjectTypeList()
    this.getQuestionList()
  },
  methods: {
    async getQuestionList (flag) {
      if (flag) {
        this.pageInfo = {
          page: 1,
          pagesize: 10,
          total: 0
        }
      }
      let params = { ...this.pageInfo }
      for (let key in this.searchkey) {
        if (
          typeof this.searchkey[key] === 'number' ||
          this.searchkey[key].trim()
        ) {
          params[key] = this.searchkey[key]
        }
      }
      if (this.searchkey.chkState === 'all') {
        delete params.chkState
      }
      let result = await getQuestionChoiceListApi(params)
      this.pageInfo.total = result.counts
      this.questionList = result.items
    },
    async getPermissionList () {
      let result = await getPermissionListApi()
      this.permissionList = result
    },
    async getSubjectTypeList () {
      let result = await getSubjectTypeListApi()
      this.subjectTypeList = result
    },
    handleSubjectChange (subjecId) {
      this.searchkey.catalogID = ''
      this.searchkey.tags = ''
      let params = new URLSearchParams()
      params.append('subjectID', subjecId)
      Promise.all([
        getSubjectDirectorysListApi(params),
        getSubjectTagListApi(params)
      ])
        .then((result) => {
          this.subjectDirList = result[0]
          this.subjectTagList = result[1]
          this.searchkey.catalogID = ''
          this.searchkey.tags = ''
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'error'
          })
        })
    },
    handleProvinceChange (value) {
      if (value.trim() !== '' && value === '北京市') {
        this.areaList = [...this.baseAreaList]
      } else {
        this.areaList = []
        this.searchkey.city = ''
      }
    },
    setFirstHeadClass () {
      return { 'background-color': '#fafafa' }
    },
    clearSearchWrap () {
      this.$refs.questionSearchKey.resetFields()
      this.getQuestionList()
    },
    async handlePreviewQuestion (id) {
      this.questionDialogVisible = true
      let result = await getQuestionDetailApi(id)
      this.questionInfo = result
    },
    handleEditQuestion (id) {
      this.$router.push({ name: 'questions-new', query: { id } })
    },
    handleDeletetQuestion (id) {
      this.$confirm('此操作将永久删除该题目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteQuestionApi(id)
          this.$message({
            type: 'success',
            message: '加入精选成功!'
          })
          this.getQuestionList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    handleAddQuestion () {
      this.$router.push({ name: 'questions-new' })
    },
    handleEditPublishState (id, state) {
      this.$confirm('您确认上架这道题目吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await editQuestionChoicePublishStateApi(id, ~~!state)
          this.$message({
            type: 'success',
            message: '上架成功!'
          })
          this.getQuestionList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async handleQuesetionCheck () {
      let data = {
        chkRemarks: this.checkAdvice,
        chkState: this.chkState,
        id: this.curChkQuestionId
      }
      try {
        await editQuestionChoiceCheckStateApi(this.curChkQuestionId, data)
        this.$message({
          type: 'success',
          message: '上架成功!'
        })
        this.getQuestionList()
        this.questionDialogCheckVisible = false
        this.checkAdvice = ''
        this.chkState = 1
      } catch (error) {
        this.$message({
          type: 'error',
          message: error
        })
      }
    },
    quesetionCheck (id) {
      this.curChkQuestionId = id
      this.questionDialogCheckVisible = true
    },
    closeDialog () {
      this.$refs.questionDetail.cancleDialog()
    },
    chkStateType (question) {
      return question.chkState === 0 ? 'primary' : 'info'
    },
    editStateType (question) {
      return question.publishState === 1 ? 'info' : 'primary'
    },
    isPublish (question) {
      return question.publishState === 1 ? '下架' : '上架'
    }
  },
  filters: {
    filterQuestionType (type) {
      switch (type) {
        case '1': {
          return '单选'
        }
        case '2': {
          return '多选'
        }
        case '3': {
          return '简答'
        }
      }
    },
    filterDifficulty (type) {
      switch (type) {
        case '1': {
          return '简单'
        }
        case '2': {
          return '一般'
        }
        case '3': {
          return '困难'
        }
      }
    },
    filterChkState (state) {
      switch (state) {
        case 0: {
          return '待审核'
        }
        case 1: {
          return '已审核'
        }
        case 2: {
          return '已拒绝'
        }
      }
    },
    filterPublistState (pubState, chkState) {
      if (chkState === 1) {
        return pubState === 0 ? '已下架' : '已发布'
      } else {
        return '待发布'
      }
    }
  },
  components: { QuestionDetail }
}
</script>

<style lang="less" scoped>
#QuestionChoiceWrap {
  .search_wrap {
    width: 100%;
    .el-form-item {
      width: 25%;
      margin-bottom: 0;
      .el-input,
      .el-select {
        width: 320px;
      }
      /deep/.el-form-item__label {
        width: 68px;
        font-weight: 700 !important;
      }
    }
    .search_line_con {
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-bottom: 20px;
      .province_area {
        /deep/ .el-form-item__content {
          display: flex;
          .province,
          .city {
            width: 45%;
          }
          .province {
            margin-right: 8px;
          }
        }
      }
      .searchBtn {
        /deep/ .el-form-item__content {
          text-align: right;
          margin-right: 25px;
        }
      }
    }
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
  }
  .el-table {
    margin-top: 20px;
  }
  .pagination {
    margin: 20px 10px 0 0;
    text-align: right;
  }
  .el-link {
    margin: 0 4px;
  }
}
</style>
