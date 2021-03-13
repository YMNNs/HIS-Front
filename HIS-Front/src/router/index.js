import Vue from 'vue'
import Router from 'vue-router'
import Login from "../components/Login";
import Register from "../components/Register";
import Diagnose from "../components/Diagnose";
import Dispense from "../components/Dispense";
import Refund from "../components/Refund";
import Charge from "../components/Charge";
import NavBar from "../components/NavBar";

Vue.use(Router)


export default new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        name: '首页',
        component: NavBar,
        redirect: "/register",
        children: [
          {
            path: '/register',
            name: '挂号',
            component: Register,
          }, {
            path: '/refund',
            name: '退号',
            component: Refund,
          }, {
            path: '/charge',
            name: '收费',
            component: Charge,
          }
        ]
      },
      {
        path: '/nav2',
        name: '医生',
        component: NavBar,
        children: [
          {
            path: '/diagnose',
            name: '门诊病历',
            component: Diagnose,
          }
        ]
      },
      {
        path: '/nav3',
        name: '药房',
        component: NavBar,
        children: [
          {
            path: '/dispense',
            name: '发药',
            component: Dispense,
          }
        ]
      },
      {
        path: '/login',
        name: '登录',
        component: Login,
      }
    ]

  },
)
