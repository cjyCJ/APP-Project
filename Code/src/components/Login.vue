<template>
  <div id="login-container">
    <div id="login-box">
      <div id="login-logo">
        <img src="../assets/img/logo.png" alt>
      </div>

      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username">
            <i slot="prefix" class="iconfont icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item v-if="visible" prop="password">
          <el-input type="password" v-model="loginForm.password">
            <i slot="prefix" class="iconfont icon-3702mima"></i>
            <i slot="suffix" title="显示密码" @click="changePass('show')" style="cursor:pointer;"
               class=" iconfont icon-yanjing-bi"></i>
          </el-input> 
        </el-form-item>
        <el-form-item v-else prop="password">
          <el-input type="text" v-model="loginForm.password">
            <i slot="prefix" class="iconfont icon-3702mima"></i>
            <i slot="suffix" title="隐藏密码" @click="changePass('hide')" style="cursor:pointer;"
               class=" iconfont  icon-yanjing_kai"></i>
          </el-input> 
        </el-form-item>

        <el-row>
          <el-col :offset="15">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetForm">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    // 定义登录表单需要使用的数据部分
    // loginForm：收集登录表单的全部表单域信息
    return {
      visible: true,
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 给登录表单域设置校验规则
      loginFormRules: {
        // 设定具体规则
        username: [
          // required:必须填写  message:检验错误提示信息，trigger:校验触发器
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    changePass(value) {
        this.visible = !(value === 'show');
      },    //判断渲染，true:暗文显示，false:明文显示
    // 用户登录系统
    login() {
      // 对form表单进行校验
      this.$refs.loginFormRef.validate(async valid => {
        // console.log(valid)  valid:true/false 校验成功或失败
        if (valid === true) {
          // 利用axios，把用户信息提交到api进行真实性校验
          const { data: res } = await this.$http.post('login', this.loginForm)
          if (res.meta.status !== 200) {
            return this.$message.error('用户名或密码不存在')
          }

          // 通过sessionStorage记录token
          // window.sessionStorage(名称，值)
          window.sessionStorage.setItem('token', res.data.token)

          // 进行路由跳转(重定向)，具体跳转到(/home)
          this.$router.push('/home')
        }
      })
    },
    // 重置form表单
    resetForm() {
      this.$refs.loginFormRef.resetFields()
    },
    // 显示密码
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    }
  }
}
</script>

<style lang="less" scoped>
#login-container {
  background-color: #2b4b6b;
  height: 100%;
  overflow: hidden;
  #login-box {
    width: 450px;
    height: 304px;
    background-color: #fff;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    #login-logo {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 8px;
      box-shadow: 0 0 10px #eee;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .el-form {
      width: 100%;
      position: absolute;
      bottom: 0;
      padding: 20px;
      box-sizing: border-box;
    }
  }
}
</style>
