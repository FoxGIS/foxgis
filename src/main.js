import Vue from 'vue'
import Router from 'vue-router'
import App from './components/App'
import Home from './components/Home'

Vue.use(Router)

let router = new Router()

router.map({
  '/': {
    component: Home
  }
})

router.redirect({
  '*': '/'
})

router.start(App, '#app')
