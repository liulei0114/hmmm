<template>
  <div id="MenuWrap">
    <el-card class="box-card">
      <el-button
        type="success"
        icon="el-icon-edit"
        style="float: right;marginBottom:20px"
        @click="addMenu()"
      >新增菜单</el-button>
      <zk-table
        :data="menuList"
        :columns="columns"
        :expand-type="false"
        :is-fold="false"
        tree-type
        :selection-type="false"
      >
        <template slot="title" slot-scope="scope">
          <div :style="getMarginLeft(scope.row.level)" class="flexC">
            <i :class="levelTitleIcon(scope.row)" style="fontSize:18px;marginRight:5px"></i>
            <span>{{scope.row.title}}</span>
          </div>
        </template>
        <template slot="handle" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle plain @click="editMenu(scope.row)"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            plain
            @click="handleDeleteMenuInfo(scope.row.id)"
          ></el-button>
        </template>
      </zk-table>
    </el-card>
    <!-- 编辑、新增弹窗 -->
    <!-- 编辑弹窗 -->
    <el-dialog
      :title="handleType"
      :visible.sync="menuDialogVisible"
      width="40%"
      @close="closeDialog"
    >
      <el-form :model="menuInfo" :rules="rules" ref="menuform">
        <el-form-item label="权限组名称" label-width="100px">
          <el-radio v-model="menuInfo.is_point" :label="false" :disabled="handleType==='编辑菜单'">菜单</el-radio>
          <el-radio v-model="menuInfo.is_point" :label="true" :disabled="handleType==='编辑菜单'">权限点</el-radio>
        </el-form-item>

        <el-form-item label="权限组名称" label-width="100px" prop="pid">
          <el-select v-model="menuInfo.pid">
            <el-option label="主导航" :value="0"></el-option>
            <div v-for="subItem in menuList" :key="subItem.id">
              <el-option
                :disabled="menuInfo.is_point"
                :label="subItem.title"
                :value="subItem.id"
                style="textIndent:14px"
              ></el-option>
              <el-option
                v-for="item in subItem.children"
                :key="item.id"
                :label="item.title"
                :value="item.id"
                style="textIndent:24px"
              ></el-option>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="权限标题" label-width="100px" prop="title">
          <el-input v-model="menuInfo.title" autocomplete="on" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="权限代码" label-width="100px" prop="code">
          <el-input v-model="menuInfo.code" autocomplete="on" size="medium"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="menuDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditMenu()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getMenuListApi,
  editMenuApi,
  addMenuApi,
  deleteMenuInfoApi
} from '@/network/api/HmmmApi.js'
export default {
  data () {
    return {
      marginLeft: 20,
      menuList: [],
      columns: [
        {
          label: 'id',
          prop: 'id',
          width: '0'
        },
        {
          label: '标题',
          type: 'template',
          template: 'title'
        },
        {
          label: '权限点代码',
          prop: 'code'
        },
        {
          label: '操作',
          align: 'center',
          headerAlign: 'center',
          type: 'template',
          template: 'handle'
        }
      ],
      menuDialogVisible: false,
      menuInfo: {},
      rules: {
        code: [
          { required: true, message: '请输入权限代码', trigger: 'blur' },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        title: [
          { required: true, message: '权限标题', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '长度在 1 到 10 个字符',
            trigger: 'blur'
          }
        ],
        pid: [{ required: true, message: '请选择权限组', trigger: 'change' }]
      },
      handleType: '创建菜单'
    }
  },
  watch: {
    'menuInfo.is_point' (value) {
      if (this.handleType === '新建菜单') {
        value
          ? this.$set(this.menuInfo, 'pid', '')
          : this.$set(this.menuInfo, 'pid', 0)
      }
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    async getMenuList () {
      let result = await getMenuListApi()
      result.forEach((e) => {
        e.pid = 0
      })
      let resultStr = JSON.stringify(result)
      resultStr = resultStr.replace(/(childs)|(points)/g, 'children')
      this.menuList = JSON.parse(resultStr)
      this.menuItemLevel(this.menuList, 0)
    },
    levelTitleIcon (row) {
      if (row.pid === 0) {
        return 'el-icon-folder-opened'
      } else if (row.pid && row.is_point) {
        return 'el-icon-view'
      } else {
        return 'el-icon-folder'
      }
    },
    getMarginLeft (level) {
      return { marginLeft: level * this.marginLeft + 'px' }
    },
    menuItemLevel (menuList, index) {
      menuList.forEach((e) => {
        let i = index
        e.level = i
        if (e.children) {
          i++
          this.menuItemLevel(e.children, i)
        }
      })
    },
    editMenu (row) {
      this.handleType = '编辑菜单'
      this.menuInfo = this._.cloneDeep(row)
      this.$set(this.menuInfo, 'is_point', row.is_point ? row.is_point : false)
      this.menuDialogVisible = true
    },
    handleEditMenu () {
      this.$refs.menuform.validate(async (flag) => {
        if (flag) {
          try {
            if (this.handleType === '编辑菜单') {
              await editMenuApi(this.menuInfo.id, this.menuInfo)
            } else {
              await addMenuApi(this.menuInfo)
            }
            this.$message({
              message: `${this.handleType}成功`,
              type: 'success'
            })
            this.menuDialogVisible = false
            this.getMenuList()
          } catch (error) {
            this.$message({
              message: error,
              type: 'error'
            })
          }
        }
      })
    },
    addMenu () {
      this.menuInfo = {
        is_point: false
      }
      this.handleType = '新建菜单'
      this.menuDialogVisible = true
      this.$set(this.menuInfo, 'pid', 0)
    },
    handleDeleteMenuInfo (id) {
      this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteMenuInfoApi(id)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getMenuList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    closeDialog () {
      this.$refs.menuform.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
#MenuWrap {
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
