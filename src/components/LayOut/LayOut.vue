<template>
  <div id="LayOutWrap">
    <el-container class="layout_con">
      <el-header class="flexC">
        <img src="~assets/home_logo.png" alt />
        <i :class="getCollapse" class="collapseIcon" @click="isCollapse = !isCollapse"></i>
        <div style="marginLeft:15px">
          <transition name="el-fade-in">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ name: 'data' }">面板</el-breadcrumb-item>
              <el-breadcrumb-item v-for="route in routerList" :key="route.name">{{route.meta.title}}</el-breadcrumb-item>
            </el-breadcrumb>
          </transition>
        </div>

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
          <div class="nav_head">
            <div
              v-for="tag in routerTagList"
              :key="tag.name"
              class="tag_view_item"
              :class="{'active-item':tag.name === defaultAvtive}"
              @click="$router.push({name:tag.name})"
            >
              <span v-if="tag.name === defaultAvtive" class="circle_point"></span>
              <span>{{tag.title}}</span>
              <span class="el-icon-close-wrap" @click.stop="closeTag(tag)">
                <i class="el-icon-close"></i>
              </span>
            </div>
          </div>
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
      defaultAvtive: '',
      routerList: []
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
    },
    routerTagList () {
      return this.$store.getters.routerTag
    }
  },
  watch: {
    '$route.path': {
      immediate: true,
      handler () {
        this.routerList = [...this.$route.matched]
        this.routerList.shift()
        this.defaultAvtive = this.$route.name
      }
    }
  },
  created () {
    this.$store.dispatch('loginModule/addRouterTag', {
      name: this.$route.name,
      title: this.$route.meta.title
    })
  },
  methods: {
    handelLoginOut () {
      this.$store.dispatch('loginModule/loginOut')
      this.$router.push('/login')
    },
    handleToView (menu) {
      this.$store.dispatch('loginModule/addRouterTag', {
        name: menu.name,
        title: menu.meta.title
      })
      this.$router.push({ name: menu.name })
    },
    closeTag (tag) {
      this.$store.dispatch('loginModule/deleteRouterTag', tag.name)
      if (this.defaultAvtive === tag.name) {
        // 关闭当前页面tag
        let tagList = this.$store.getters.routerTag
        if (tagList.length !== 0) {
          let lastTag = tagList[tagList.length - 1]
          this.$router.push({ name: lastTag.name })
        } else {
          this.$store.dispatch('loginModule/addRouterTag', {
            name: 'data',
            title: '数据概览'
          })
          this.$router.push({ name: 'data' })
        }
      }
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
      /deep/ .el-breadcrumb__item {
        .el-breadcrumb__inner {
          color: #fff !important;
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
          height: 40px;
          background-color: #fff;
          padding: 0 10px;
          position: fixed;
          top: 70px;
          left: 200px;
          z-index: 1999;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .tag_view_item {
            position: relative;
            height: 26px;
            line-height: 26px;
            border: 1px solid #d8dce5;
            color: #495060;
            background: #fff;
            padding-left: 8px;
            font-size: 12px;
            margin-left: 5px;
            &:hover {
              cursor: pointer;
            }
            .el-icon-close-wrap {
              width: 16px;
              height: 16px;
              margin: 0 5px;
              border-radius: 50%;
              text-align: center;
              vertical-align: 3px;
              transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
              transform-origin: 100% 50%;
              .el-icon-close {
                transform: scale(0.8);
                vertical-align: -3px;
              }
              &:hover {
                background-color: #b4bccc;
                color: #fff;
              }
            }
            .circle_point {
              display: inline-block;
              background: #fff;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              margin-right: 5px;
            }
          }
          .active-item {
            background-color: #1493fa;
            color: #fff;
            border-color: #1493fa;
          }
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
