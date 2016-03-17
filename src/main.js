import Vue from 'vue'
import Router from 'vue-router'
import App from './components/App'
import Home from './components/Home'
import Login from './components/Login'
import Atlas from './components/Atlas'
import Blog from './components/Blog'
import Carto from './components/Carto'
import Programs from './components/Programs'
import Data from './components/Data'


Vue.config.debug = true
Vue.use(Router)

let router = new Router({hashbang:false})

router.map({
  '/': {
    component: Home
  },
  '/login': {
    component: Login
  },
  '/atlas': {
  	component: Atlas
  },
  '/blog': {
    component: Blog
  },
  '/carto': {
    component: Carto,
    root: 'carto',
    subRoutes: {
      '/': {

        component: Programs
      },
      '/programs': {

        component: Programs
      },
      '/datas': {

        component: Programs
      },
      '/fonts': {

        component: Programs
      },
      '/icons': {

        component: Programs
      }
    }
  },
  '/data': {
    component: Data
  }

})

router.redirect({
  '*': '/'
})

router.start(App, '#app')
