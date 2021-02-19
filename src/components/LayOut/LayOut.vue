<template>
  <div id="LayOutWrap">
    <el-container class="layout_con">
      <el-header class="flexC">
        <img src="~assets/home_logo.png" alt />
        <i :class="getCollapse" class="collapseIcon" @click="isCollapse = !isCollapse"></i>
        <div class="login_name">
          <el-dropdown>
            <span class="el-dropdown-link">
              {{_loginName}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-s-home" @click.native="$router.push('/hemamm')">首页</el-dropdown-item>
              <el-dropdown-item icon="el-icon-s-custom" @click.native="handelLoginOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container class="layout_body">
        <el-aside width="200px">
          <el-menu
            :default-active="defaultAvtive"
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
          >
            <div v-for="subMenu in menuList.children" :key="subMenu.name">
              <el-submenu :index="subMenu.name" v-if="subMenu.children">
                <template slot="title">
                  <i :class="subMenu.meta.icon"></i>
                  <span slot="title">{{subMenu.meta.title}}</span>
                </template>
                <el-menu-item
                  :index="menu.name"
                  v-for="menu in subMenu.children"
                  :key="menu.name"
                  @click.native="handleToView(menu)"
                >
                  <i :class="menu.meta.icon"></i>
                  <span>{{menu.meta.title}}</span>
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subMenu.name" @click.native="handleToView(subMenu)">
                <i :class="subMenu.meta.icon"></i>
                <span>{{subMenu.meta.title}}</span>
              </el-menu-item>
            </div>
          </el-menu>
        </el-aside>
        <el-main>
          <div class="nav_head"></div>
          <div class="main_body">
            <router-view></router-view>
          </div>
          <div class="bottom">
            <div>
              <i class="github">
                <svg-icon icon-class="github"></svg-icon>
              </i>
            </div>
            <div style="marginTop:5px">
              <span style="marginRight:5px">Copyright</span>
              <i class="github">
                <svg-icon icon-class="copyright"></svg-icon>
              </i>
              <span>2019</span>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { myrouter } from '@/utils/Routers.js'
export default {
  data () {
    return {
      isCollapse: false,
      menuList: myrouter,
      defaultAvtive: ''
    }
  },
  computed: {
    ...mapGetters({ userProfile: 'userProfile' }),
    getCollapse () {
      if (this.isCollapse) {
        return {
          'el-icon-s-unfold': true
        }
      } else {
        return {
          'el-icon-s-fold': true
        }
      }
    },
    _loginName () {
      return this.userProfile.name
    }
  },
  watch: {
    '$route.path': {
      immediate: true,
      handler () {
        this.defaultAvtive = this.$route.name
      }
    }
  },
  methods: {
    handelLoginOut () {
      this.$store.dispatch('loginModule/loginOut')
      this.$router.push('/login')
    },
    handleToView (menu) {
      this.$router.push({ name: menu.name })
    }
  }
}
</script>

<style lang="less" scoped>
#LayOutWrap {
  width: 100%;
  height: 100%;
  .layout_con {
    width: 100%;
    .el-header {
      height: 70px !important;
      z-index: 2000;
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      background: linear-gradient(90deg, #1493fa, #01c6fa);
      .collapseIcon {
        font-size: 18px;
        color: #fff;
        margin-left: 20px;
      }
      .login_name {
        margin-left: auto;
        &:hover {
          cursor: pointer;
        }
        .el-dropdown-link {
          color: #fff;
        }
      }
    }
    .layout_body {
      width: 100%;
      .el-menu {
        height: 100%;
        position: fixed;
        left: 0;
        top: 70px;
        box-shadow: 2px 0 10px rgb(100, 100, 100) !important;
        width: 200px;
        z-index: 2000;
        .el-submenu__title {
          i {
            color: #333;
          }
        }
        .el-menu-item {
          color: #333;

          &:hover,
          &.is-active {
            background: linear-gradient(90deg, #1493fa, #01c6fa);
            color: #fff;
            i {
              color: #fff !important;
            }
          }
          i {
            color: #333;
          }
        }
      }
      .el-main {
        width: 100%;
        padding: 0;
        .nav_head {
          width: 100%;
          height: 35px;
          background-color: #fff;
          padding: 0 10px;
          position: fixed;
          top: 70px;
          left: 200px;
          z-index: 1999;
        }
        .main_body {
          margin-top: 135px;
          padding: 0 10px;
        }
      }
      .bottom {
        padding: 20px 0;
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
        div {
          text-align: center;
        }
      }
    }
  }
}
</style>
