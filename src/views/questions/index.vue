<template>
  <div id="BaseQuestionWrap">
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
                <el-option label="天津市" value="天津市"></el-option>
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
      <div class="list_info">
        <el-alert :title="_title" type="info" show-icon :closable="false"></el-alert>
      </div>
      <el-table :data="questionList" style="width: 100%" :header-cell-style="setFirstHeadClass">
        <el-table-column label="试题编号" width="180" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学科" width="180" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.subject }}</span>
          </template>
        </el-table-column>
        <el-table-column label="目录" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.catalog}}</span>
          </template>
        </el-table-column>
        <el-table-column label="题型" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.questionType | filterQuestionType}}</span>
          </template>
        </el-table-column>
        <el-table-column label="题干" align="center">
          <template slot-scope="scope">
            <span v-html="scope.row.question"></span>
          </template>
        </el-table-column>
        <el-table-column label="录入时间" align="center">
          <template slot-scope="scope">
            <span>{{formatDate(scope.row.addDate)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="难度" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.difficulty | filterDifficulty}}</span>
          </template>
        </el-table-column>
        <el-table-column label="录入人" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.creator}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-view"
              circle
              plain
              title="预览"
              size="small"
              @click="handlePreviewQuestion(scope.row.id)"
            ></el-button>

            <el-button
              size="small"
              type="success"
              icon="el-icon-edit"
              circle
              plain
              title="编辑"
              @click="handleEditQuestion(scope.row.id)"
            ></el-button>

            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
              circle
              plain
              title="删除"
              @click="handleDeletetQuestion(scope.row.id)"
            ></el-button>
            <el-button
              size="small"
              type="warning"
              icon="el-icon-check"
              circle
              plain
              title="加入精选"
              @click="handleJoinChoice(scope.row.id)"
            ></el-button>
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

    <el-dialog title="题目预览" :visible.sync="questionDialogVisible" width="50%" @close='closeDialog'>
      <question-detail ref="questionDetail" :questionInfo="questionInfo" :visible.sync = 'questionDialogVisible'></question-detail>
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
  getQuestionListApi,
  joinQuestionChoiceApi,
  deleteQuestionApi,
  getQuestionDetailApi
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
        catalogID: ''
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
      questionInfo: {}
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
      let result = await getQuestionListApi(params)
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
    handleJoinChoice (id) {
      this.$confirm('此操作将该题目加入精选, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await joinQuestionChoiceApi(id, 1)
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
    closeDialog () {
      this.$refs.questionDetail.cancleDialog()
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
    }
  },
  components: { QuestionDetail }
}
</script>

<style lang="less" scoped>
#BaseQuestionWrap {
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
}
</style>
