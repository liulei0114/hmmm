<template>
  <div id="CompanyWrap">
    <el-card class="box-card">
      <div class="search_wrap">
        <el-form ref="companySearchKey" :model="searchkey">
          <div class="search_line_con">
            <el-form-item label="标签名称" size="small" prop="tags">
              <el-input v-model="searchkey.tags" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="城市" size="small" prop="province">
              <el-select
                v-model="searchkey.province"
                placeholder="请选择"
                @change="handleProvinceChange"
              >
                <el-option label="北京市" value="北京市"></el-option>
                <el-option label="天津市" value="天津市"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="地区" size="small" prop="city">
              <el-select v-model="searchkey.city" placeholder="请选择">
                <el-option
                  v-for="(area,index) in areaList"
                  :key="index"
                  :label="area.label"
                  :value="area.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="企业简称" size="small" prop="shortName">
              <el-input v-model="searchkey.shortName" placeholder="企业简称"></el-input>
            </el-form-item>
          </div>
          <div class="search_line_con">
            <el-form-item label="状态" size="small" prop="state">
              <el-select v-model="searchkey.state" placeholder="请选择">
                <el-option label="启用" value="1"></el-option>
                <el-option label="禁止" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="small"  class="searchBtn">
              <el-button size="small" @click="clearSearchWrap()">清空</el-button>
              <el-button size="small" type="primary" @click="getCompanyList(true)">搜索</el-button>
            </el-form-item>

            <el-button
              size="small"
              type="success"
              icon="el-icon-edit"
              style="marginLeft:auto;marginRight:23px"
              @click="addCompany()"
            >新增企业</el-button>
          </div>
        </el-form>
      </div>
      <div class="list_info">
        <el-alert :title="_title" type="info" show-icon :closable="false"></el-alert>
      </div>
      <el-table :data="companyList" style="width: 100%" :header-cell-style="setFirstHeadClass">
        <el-table-column label="序号" width="180" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="企业编号" width="180" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="企业简称" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.shortName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="标签" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.tags}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建者" align="center">
          <template slot-scope="scope">
            <span>{{getCreateName(scope.row.creatorID)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" align="center">
          <template slot-scope="scope">
            <span>{{formatDate(scope.row.addDate)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.remarks}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.state | filterState}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              plain
              @click="editCompanyInfo(scope.row)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row.state === 1?'禁用':'启用'"
              placement="top"
            >
              <el-button
                :type="scope.row.state === 1?'warning':'success'"
                :icon="scope.row.state === 1?'el-icon-close':'el-icon-check'"
                circle
                :plain="scope.row.state === 1"
                @click="handleEditCompanyState(scope.row.id,scope.row.state)"
              ></el-button>
            </el-tooltip>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              plain
              @click="handleDeleteCompanyInfo(scope.row.id)"
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

    <!-- 新增、编辑弹窗 -->
    <el-dialog
      :title="handleType"
      :visible.sync="companyDialogVisible"
      width="50%"
      :before-close="cancleDialog"
    >
      <el-form :model="companyInfo" ref="companyForm" :rules="rules">
        <el-form-item label="企业名称" label-width="140px" prop="shortName">
          <el-input v-model="companyInfo.shortName" autocomplete="on" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="所属公司" label-width="140px" prop="company">
          <el-input v-model="companyInfo.company" autocomplete="on"></el-input>
        </el-form-item>
        <p style="marginLeft:130px;lineHeight:50px">https://www.tianyancha.com （在此可查询所属公司全称及简称）</p>
        <el-form-item label="城市地区" label-width="140px" required class="provice_area">
          <el-form-item prop="province">
            <el-select v-model="companyInfo.province" @change="handleProvinceChange">
              <el-option label="北京市" value="北京市"></el-option>
              <el-option label="天津市" value="天津市"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="city">
            <el-select v-model="companyInfo.city" placeholder="请选择">
              <el-option
                v-for="(area,index) in dialogAreaList"
                :key="index"
                :label="area.label"
                :value="area.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item label="方向（企业标签）" label-width="140px" prop="tags">
          <el-input v-model="companyInfo.tags" autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="140px" prop="remarks">
          <el-input type="textarea" placeholder="请输入内容" v-model="companyInfo.remarks"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleDialog()">取 消</el-button>
        <el-button type="primary" @click="handleOptionCompanyInfo()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCompanyListApi,
  getPermissionListApi,
  editCompanyStateApi,
  deleteCompanyApi,
  addCompanyInfoApi,
  editCompanyInfoApi
} from '@/network/api/HmmmApi.js'
import Pagination from '@/mixins/pagination.js'
export default {
  mixins: [Pagination],
  data () {
    return {
      searchkey: {
        province: '',
        city: '',
        tags: '',
        shortName: '',
        state: ''
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
      fetchDataList: this.getCompanyList,
      companyList: [],
      permissionList: [],
      handleType: '',
      companyDialogVisible: false,
      companyInfo: {
        city: '',
        company: '',
        isFamous: '',
        province: '',
        remarks: '',
        shortName: '',
        tags: ''
      },
      rules: {
        shortName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '长度在 1 到 10 个字符',
            trigger: 'blur'
          }
        ],
        company: [
          { required: true, message: '请输入所属公司', trigger: 'blur' }
        ],
        province: [
          { required: true, message: '请选择城市', trigger: 'change' }
        ],
        city: [{ required: true, message: '请选择地区', trigger: 'change' }],
        tags: [
          { required: true, message: '请输入企业标签', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '长度在 1 到 10 个字符',
            trigger: 'blur'
          }
        ],
        remarks: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      },
      dialogAreaList: []
    }
  },
  computed: {
    _title () {
      return `共${this.pageInfo.total}条记录`
    }
  },
  created () {
    this.getPermissionList()
    this.getCompanyList()
  },
  methods: {
    async getCompanyList (flag) {
      if (flag) {
        this.pageInfo = {
          page: 1,
          pagesize: 10,
          total: 0
        }
      }
      let params = { ...this.pageInfo }
      for (let key in this.searchkey) {
        if (this.searchkey[key].trim()) {
          params[key] = this.searchkey[key]
        }
      }
      let result = await getCompanyListApi(params)
      this.pageInfo.total = result.counts
      this.companyList = result.items
    },
    async getPermissionList () {
      let result = await getPermissionListApi()
      this.permissionList = result
    },
    handleProvinceChange (value) {
      if (value.trim() !== '' && value === '北京市') {
        if (this.companyDialogVisible) {
          this.dialogAreaList = [...this.baseAreaList]
        } else {
          this.areaList = [...this.baseAreaList]
        }
      } else {
        if (this.companyDialogVisible) {
          this.dialogAreaList = []
        } else {
          this.areaList = []
        }
      }
    },
    setFirstHeadClass () {
      return { 'background-color': '#fafafa' }
    },
    getCreateName (createId) {
      if (this.permissionList.length === 0) return
      let temp = this.permissionList.find((item) => item.id === ~~createId)
      return temp.title
    },
    clearSearchWrap () {
      this.$refs.companySearchKey.resetFields()
      this.getCompanyList()
    },
    handleEditCompanyState (id, state) {
      this.$confirm('此操作将永久修改企业状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await editCompanyStateApi(id, ~~!state)
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.getCompanyList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    editCompanyInfo (companyInfo) {
      this.handleType = '编辑企业信息'
      this.companyDialogVisible = true
      this.companyInfo = companyInfo
      this.companyInfo.isFamous = Boolean(companyInfo.isFamous)
    },
    handleDeleteCompanyInfo (id) {
      this.$confirm('此操作将永久删除该企业, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteCompanyApi(id)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getCompanyList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    addCompany () {
      this.handleType = '新增企业信息'
      this.companyDialogVisible = true
    },
    handleOptionCompanyInfo () {
      this.$refs.companyForm.validate(async (flag) => {
        if (flag) {
          try {
            if (this.handleType === '编辑企业信息') {
              await editCompanyInfoApi(this.companyInfo.id, this.companyInfo)
            } else {
              let data = { ...this.companyInfo, isFamous: true }
              await addCompanyInfoApi(data)
            }
            this.$message({
              message: `${this.handleType}成功`,
              type: 'success'
            })
            this.companyInfo = {}
            this.cancleDialog()
            this.getCompanyList()
          } catch (error) {
            this.$message({
              message: error,
              type: 'error'
            })
          }
        }
      })
    },
    cancleDialog (done) {
      this.$refs.companyForm.resetFields()
      this.companyDialogVisible = false
      done && done()
    }
  },
  filters: {
    filterState (state) {
      return state === 0 ? '禁用' : '启用'
    }
  }
}
</script>

<style lang="less" scoped>
#CompanyWrap {
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
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
       .searchBtn {
        /deep/ .el-form-item__content {
          text-align: left;
          margin-left: 25px;
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
    .el-dialog__body {
      padding: 30px 150px 0px;
      /deep/ .el-form-item__label {
        color: #606266;
        font-weight: 600;
      }
      .provice_area {
        .el-form-item__content {
          display: flex;
          .el-form-item:first-child {
            margin-right: 75px;
          }
        }
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
