<template>
  <div id="LoginWrap">
    <div class="login_contain">
      <div class="flexC">
        <img src="~assets/logo.png" alt />
        <span class="login_text">用户登录</span>
      </div>
      <div class="login_form">
        <el-form :model="loginData" :rules="rules" class="demo-ruleForm" ref="loginRef">
          <el-form-item prop="username">
            <el-input prefix-icon="el-icon-user-solid" type="text" v-model="loginData.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              prefix-icon="el-icon-lock"
              type="password"
              v-model="loginData.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-button type="primary" width="100px" @click="handleLogin()">登录</el-button>
        </el-form>
      </div>
    </div>
    <div class="logingBg"></div>
  </div>
</template>

<script>
import shajs from 'sha.js'

const validateTitle = (rule, value, callback) => {
  const reg = /^[a-zA-Z_@.\u4e00-\u9fa5]+$/
  if (!reg.test(value)) {
    callback(new Error('请输入正确用户名'))
  } else {
    callback()
  }
}
export default {
  data () {
    return {
      loginData: {
        username: 'root@admin.com',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { validator: validateTitle, trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleLogin () {
      this.$refs.loginRef.validate(async (flag) => {
        if (flag) {
          let _password = shajs('sha256')
            .update(this.loginData.password)
            .digest('hex')
          let result = await this.$store.dispatch('loginModule/loginUsername', { username: this.loginData.username, password: _password })
          if (result) {
            this.$router.push('/hemamm')
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
#LoginWrap {
  width: 100%;
  height: 100%;
  background: no-repeat url('~assets/bg.jpg') 0 0;
  background-size: cover;
  position: relative;
  .login_contain {
    position: absolute;
    left: 20%;
    top: 50%;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: -200px 0 0 0;
    background: #f5f5f5;
    .login_text {
      font-size: 22px;
      color: #000;
      padding: 0 20px;
    }
    .login_form {
      margin-top: 20px;
      /deep/ .el-input__inner {
        height: 50px !important;
        background-color: #fff !important;
      }
      .el-button {
        margin-top: 10px;
        width: 100%;
        height: 50px;
        font-size: 20px;
      }
    }
  }
  .logingBg {
    position: absolute;
    right: 5%;
    top: 5%;
    width: 700px;
    height: 460px;
    background: no-repeat url('~assets/logingBg.png');
    background-size: cover;
  }
}
</style>
