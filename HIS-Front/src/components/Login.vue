<template>
  <div>
    <!--flex弹性盒子模型，justify-content：主抽 -->
    <div style="display: flex;justify-content: center;margin-top: 150px">
      <el-card style="width: 350px">
        <div class="clearfix" slot="header">
          <span>登录</span>
        </div>
        <el-form :model="user" :rules="rules" ref="loginForm">
          <table>
            <tr>
              <td>
                <el-form-item prop="username">
                  <el-input placeholder="用户名" v-model="user.username"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item prop="password">
                  <el-input @keydown.enter.native="submitForm('loginForm')" placeholder="密码" type="password"
                            v-model="user.password"></el-input>
                </el-form-item>
                <!-- @keydown.enter.native="doLogin"当按下enter键的时候也会执行doLogin方法-->
              </td>
            </tr>
            <tr>
              <!-- 占两行-->
              <td colspan="2">
                <!-- 点击事件的两种不同的写法v-on:click和 @click-->
                <!--<el-button style="width: 300px" type="primary" v-on:click="doLogin">登录</el-button>-->
                <el-form-item>
                  <el-button @click="submitForm('loginForm')" style="width: 300px" type="primary">登录</el-button>
                </el-form-item>
              </td>
            </tr>
          </table>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>
  export default {

    //单页面中不支持前面的data:{}方式
    name: 'Login',
    data() {
      //相当于以前的function data(){},这是es5之前的写法，新版本可以省略掉function
      return {
        //之前是在里面直接写username，password等等，但是这里要写return
        //因为一个组件不管要不要被其他组件用，只要这样定义了，它就会认为可能这个组件会在其他的组件中使用
        //比如说在这里定义了一个变量，然后把这个组件引入到A组件中，A组件中修改了这个变量
        //同时这个组件也在B组件中引用了，这时候A里面一修改，B里面也变了，它们用的是一个值
        //可是一般来说可能希望在不同的组件中引用的时候，使用不同的值，所以这里要用return
        //这样在A组件和B组件分别引用这个变量的时候是不会互相影响的
        user: {
          username: '',
          password: '',
          //为了登录方便，可以直接在这里写好用户名和密码的值
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
          ],
        }
      }
    },
    methods: {
      submitForm(formName) {
        //TODO 提交表单
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$router.push({path:'/register'})
          } else {
            console.log('error submit!!');
            //this.$refs[formName].resetFields();
            return false;
          }
        });
      },
    }
  }
</script>
