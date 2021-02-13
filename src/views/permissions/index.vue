<template>
  <div id="UserWrap">
    <el-card class="box-card">
      <div class="search_wrap flexC">
        <el-input v-model="permissionName" placeholder="根据用户名搜索"></el-input>
        <el-button @click="clearPermissionName()">清空</el-button>
        <el-button type="primary" @click="getPermissionRoleList(true)">搜索</el-button>
        <el-button
          type="success"
          icon="el-icon-edit"
          style="marginLeft:auto"
          @click="addPermissionRole()"
        >新增权限组</el-button>
      </div>
      <div class="list_info">
        <el-alert :title="_title" type="info" show-icon :closable='false'></el-alert>
      </div>
      <el-table
        :data="permissionDetailList"
        style="width: 100%"
        :header-cell-style="setFirstHeadClass"
      >
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column label="日期" sortable prop="create_date">
          <template slot-scope="scope">
            <span>{{formatDate(scope.row.create_date)}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              plain
              @click="editPermissionRole(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              plain
              @click="handleDeletePermissionRole(scope.row.id)"
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

    <!-- 保存/编辑弹窗 -->
    <el-dialog :title="handleType" :visible.sync="permissionVisible" width="40%">
      <el-form :model="permissionRole" :rules="rules" ref="permissionRole">
        <el-form-item label="用户名" label-width="100px" prop="title">
          <el-input v-model="permissionRole.title" autocomplete="on" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="权限分配" label-width="100px">
          <el-tree
            :data="menuList"
            show-checkbox
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps"
            :default-expanded-keys="[0]"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="permissionVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlePermissionRole()">确 定</el-button>
      </div>
    </el-dialog>-->
  </div>
</template>

<script>
import {
  getPermissionRoleListApi,
  deletePermissionRoleApi,
  editPermissionRoleApi,
  addPermissionRoleApi,
  getMenuListApi,
  selectPermissionByRoleApi
} from '@/network/api/HmmmApi'
import Pagination from '@/mixins/pagination.js'
export default {
  mixins: [Pagination],
  data () {
    return {
      permissionName: '',
      fetchDataList: this.getPermissionRoleList,
      permissionVisible: false,
      permissionDetailList: [],
      rules: {
        title: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '长度在 1 到 10 个字符',
            trigger: 'blur'
          }
        ]
      },
      handleType: '',
      permissionRole: {},
      menuList: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  computed: {
    _title () {
      return `共${this.pageInfo.total}条记录`
    }
  },
  created () {
    this.getMenuList()
    this.getPermissionRoleList()
  },
  methods: {
    async getPermissionRoleList (flag) {
      if (flag) {
        this.pageInfo = {
          page: 1,
          pagesize: 10,
          total: 0
        }
      }
      let params = { ...this.pageInfo, title: this.permissionName }
      let result = await getPermissionRoleListApi(params)
      this.pageInfo.total = result.counts
      this.permissionDetailList = result.list
    },
    async getMenuList () {
      let result = await getMenuListApi()
      result.forEach((e, i) => {
        e.pid = 0
      })
      let resultStr = JSON.stringify(result)
      resultStr = resultStr.replace(/(childs)|(points)/g, 'children')
      let temp = JSON.parse(resultStr)
      this.menuList = [
        {
          title: '系统菜单和页面权限点',
          children: [...temp],
          id: 0
        }
      ]
    },
    setFirstHeadClass () {
      return { 'background-color': '#fafafa' }
    },
    clearPermissionName () {
      this.permissionName = ''
      this.getPermissionRoleList()
    },
    async editPermissionRole (permissionRole) {
      let reuslt = await selectPermissionByRoleApi(permissionRole.id)
      this.handleType = '编辑权限组'
      this.permissionVisible = true
      this.permissionRole = reuslt
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.permissionRole.permissions)
      })
    },
    handlePermissionRole () {
      let checkKeys = this.$refs.tree.getCheckedKeys()
      if (checkKeys.length === 0) {
        this.$message({
          message: '请选择权限组',
          type: 'error'
        })
        return
      }
      if (!checkKeys[0]) checkKeys.shift()
      this.permissionRole.permissions = checkKeys
      this.$refs.permissionRole.validate(async (flag) => {
        if (flag) {
          try {
            if (this.handleType === '编辑权限组') {
              await editPermissionRoleApi(
                this.permissionRole.id,
                this.permissionRole
              )
            } else {
              await addPermissionRoleApi(this.permissionRole)
            }
            this.$message({
              message: `${this.handleType}成功`,
              type: 'success'
            })
            this.permissionVisible = false
            this.getPermissionRoleList()
          } catch (error) {
            this.$message({
              message: error,
              type: 'error'
            })
          }
        }
      })
    },
    handleDeletePermissionRole (id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deletePermissionRoleApi(id)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getPermissionRoleList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    addPermissionRole () {
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys([])
      }
      this.handleType = '新增权限组'
      this.permissionRole = {}
      this.permissionVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
#UserWrap {
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
      padding: 30px 200px 0px;
      /deep/ .el-form-item__label {
        color: #606266;
        font-weight: 600;
      }
    }
  }
}
</style>
