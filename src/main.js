import Vue from 'vue'
import Router from 'vue-router'
import App from './components/App'
import Home from './components/Home'
import Login from './components/Login'
import Atlas from './components/Atlas'
import Blog from './components/Blog'
import Studio from './components/Studio'
import Pictures from './components/Pictures'
import Data from './components/Data'


Vue.config.debug = true
Vue.use(Router)

let router = new Router()

router.map({
  '/': {
    component: Home
  },
  '/home': {
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
  '/studio': {
    component: Studio,
    root: 'studio',
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
  },
  '/data': {
    component: Data
  }

})

// router.redirect({
//   '*': '/'
// })

router.start(App, '#app')
