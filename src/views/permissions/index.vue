<template>
  <div id="PermissionWrap">
    <el-card class="box-card">
      <div class="search_wrap flexC">
        <el-input v-model="username" placeholder="根据用户名搜索"></el-input>
        <el-button @click="clearUsername()">清空</el-button>
        <el-button type="primary" @click="getUserList()">搜索</el-button>
        <el-button
          type="success"
          icon="el-icon-edit"
          style="marginLeft:auto"
          @click="addUser()"
        >新增权限组</el-button>
      </div>
      <div class="list_info">
        <el-alert :title="_title" type="info" show-icon></el-alert>
      </div>
      <el-table :data="permissonList" style="width: 100%" :header-cell-style="setFirstHeadClass">
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column label="日期" sortable>
           <template slot-scope="scope">
            <span>{{scope.row.create_date}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              plain
              @click="edituserInfo(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              v-if="canDelete(scope.row)"
              plain
              @click="handleDeleteUserInfo(scope.row.id)"
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

    <!-- 编辑弹窗 -->
    <el-dialog :title="handleType" :visible.sync="editUserVisible" width="40%">
      <el-form :model="userInfo" :rules="rules" ref="editUserform">
        <el-form-item label="用户名" label-width="100px" prop="username">
          <el-input v-model="userInfo.username" autocomplete="on" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px" prop="email">
          <el-input v-model="userInfo.email" autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px" prop="password" v-if="handleType==='新增用户'">
          <el-input type="password" show-password v-model="userInfo.password" autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item label="角色" label-width="100px">
          <el-input v-model="userInfo.role" autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item label="权限组名称" label-width="100px" prop="permission_group_id">
          <el-select v-model="userInfo.permission_group_id">
            <el-option
              v-for="item in permissionList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" label-width="100px">
          <el-input v-model="userInfo.phone" autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item label="介绍" label-width="100px">
          <el-input type="textarea" placeholder="请输入内容" v-model="userInfo.introduction"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditUserinfo()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新增用户 -->
  </div>
</template>

<script>
import {
  getPermissonListApi,
  editUserInfoApi,
  deleteUserInfoApi,
  addUserInfoApi
} from '@/network/api/HmmmApi'
import Pagination from '@/mixins/pagination.js'
export default {
  mixins: [Pagination],
  data () {
    return {
      username: '',
      permissonList: [],
      fetchDataList: this.getUserList,
      editUserVisible: false,
      userInfo: {},
      permissionList: [],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '长度在 1 到 10 个字符',
            trigger: 'blur'
          }
        ],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        permission_group_id: [
          { required: true, message: '请选择权限组', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
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
    this.getUserList()
    this.getPermissionList()
  },
  methods: {
    async getUserList () {
      let params = { ...this.pageInfo, username: this.username }
      let result = await getUserListApi(params)
      this.pageInfo.total = result.counts
      this.userList = result.list
    },
    async getPermissionList () {
      let params = { ...this.pageInfo, username: this.username }
      let result = await getPermissonApi(params)
      this.pageInfo.total = result.counts
      this.userList = result.list
    },
    async getPermissionList () {
      let result = await getPermissionListApi()
      this.permissionList = result
    },
    canDelete (row) {
      if (row.role === 'admin') {
        return false
      }
      return true
    },
    setFirstHeadClass () {
      return { 'background-color': '#fafafa' }
    },
    clearUsername () {
      this.username = ''
      this.getUserList()
    },
    edituserInfo (userInfo) {
      this.handleType = '编辑用户'
      this.editUserVisible = true
      this.userInfo = this._.cloneDeep(userInfo)
    },
    handleEditUserinfo () {
      this.$refs.editUserform.validate(async (flag) => {
        this.$delete(this.userInfo, 'permission_group_title')
        this.$delete(this.userInfo, 'is_deleted')
        this.$delete(this.userInfo, 'last_update_time')
        this.$delete(this.userInfo, 'create_time')
        if (flag) {
          try {
            if (this.handleType === '编辑用户') {
              await editUserInfoApi(this.userInfo.id, this.userInfo)
            } else {
              await addUserInfoApi(this.userInfo)
            }
            this.$message({
              message: `${this.handleType}成功`,
              type: 'success'
            })
            this.editUserVisible = false
            this.getUserList()
          } catch (error) {
            this.$message({
              message: error,
              type: 'error'
            })
          }
        }
      })
    },
    handleDeleteUserInfo (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteUserInfoApi(id)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getUserList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    addUser () {
      this.handleType = '新增用户'
      this.userInfo = {}
      this.editUserVisible = true
    }
  },
  filters: {
    filterPhone (phone) {
      return phone || ''
    }
  }
}
</script>

<style lang="less" scoped>
#PermissionWrap {
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
    // overflow: hidden;
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
      padding: 30px 200px 0px;
      /deep/ .el-form-item__label {
        color: #606266;
        font-weight: 600;
      }
    }
  }
}
</style>
