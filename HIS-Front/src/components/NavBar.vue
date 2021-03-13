<template>
  <div>
    <el-container>
      <el-header>
        <!--导航栏-->
        <el-menu class="el-menu-demo" mode="horizontal" router>
          <el-submenu :index="index+''" :key="item.name" v-for="(item,index) in $router.options.routes"
                      v-if="item.children">
            <template slot="title">{{item.name}}</template>
            <el-menu-item :class="$route.path===item2.path?'is-active':''" :index="item2.path" :key="item2.name"
                          v-for="item2 in item.children">
              {{item2.name}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-header>
      <el-container>
        <el-container>
          <el-main>
            <!--页面内容-->
            <router-view/>
          </el-main>
          <el-footer>
            <!--页脚-->
            <el-backtop target=".page-component__scroll .el-scrollbar__wrap"></el-backtop>
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: "NavBar"
  }
</script>

<style scoped>

</style>
