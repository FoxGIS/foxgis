import Vue from 'vue'
import Router from 'vue-router'
import App from './components/App'
import Home from './components/Home'
import Login from './components/Login'
import Atlas from './components/Atlas'
import Blog from './components/Blog'

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
  }
})

router.redirect({
  '*': '/'
})

router.start(App, '#app')
