import Vue from 'vue'
import Router from 'vue-router'
import App from './components/App'
import Home from './components/Home'
import Login from './components/Login'
import Atlas from './components/Atlas'
import Blog from './components/Blog'
import Carto from './components/Carto'
import Pictures from './components/Pictures'

Vue.config.debug = true
Vue.use(Router)

let router = new Router()

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

        component: Pictures
      },
      '/pictures': {

        component: Pictures
      },
      '/datas': {

        component: Pictures
      },
      '/fonts': {

        component: Pictures
      },
      '/icons': {

        component: Pictures
      }
    }
  }

})

router.redirect({
  '*': '/'
})

router.start(App, '#app')
