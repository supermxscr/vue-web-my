import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
    path: '/dashboard',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: '/dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'Dashboard',
      meta: {
        title: 'dashboard',
        icon: 'home',
        affix: true,
        noCache: true
      }
    }]
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
      path: '/redirect/:path*',
      component: () => import('@/views/redirect/index')
    }]
  },
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/member',
    component: Layout,
    children: [{
      path: '/member',
      component: () => import('@/views/member/list'),
      name: 'Member',
      meta: {
        title: 'member',
        icon: 'member'
      }
    }]
  },
  {
    path: '/product',
    component: Layout,
    children: [{
      path: '/product',
      component: () => import('@/views/product/list'),
      name: 'Product',
      meta: {
        title: 'product',
        icon: 'shopping'
      }
    }, {
      path: 'info',
      hidden: true,
      component: () => import('@/views/product/info'),
      name: 'productInfo',
      meta: {
        title: 'productInfo',
        icon: 'dashboard'
      }
    }]
  },
  {
    path: '/order',
    component: Layout,
    children: [{
      path: '/order',
      component: () => import('@/views/order/list'),
      name: 'Order',
      meta: {
        title: 'order',
        icon: 'order'
      }
    }]
  },
  {
    path: '/group',
    component: Layout,
    meta: {
      title: 'group',
      icon: 'group'
    },
    children: [{
      path: '/group/list',
      component: () => import('@/views/group/list'),
      name: 'group',
      meta: {
        title: 'groupList',
        icon: 'grouplist'
      }
    }, {
      path: '/group/info',
      hidden: true,
      component: () => import('@/views/group/info'),
      name: 'groupInfo',
      meta: {
        title: 'groupInfo',
        icon: 'dashboard'
      }
    }, {
      path: '/group/data',
      component: () => import('@/views/group/data'),
      name: 'groupData',
      meta: {
        title: 'groupData',
        icon: 'count'
      }
    }]
  },
  {
    path: '/saler',
    component: Layout,
    children: [{
      path: '/saler/list',
      component: () => import('@/views/saler/list'),
      name: 'saler',
      meta: {
        title: 'saler',
        icon: 'saler'
      }
    }, {
      path: '/saler/info',
      hidden: true,
      component: () => import('@/views/saler/info'),
      name: 'salerInfo',
      meta: {
        title: 'salerInfo',
        icon: 'dashboard'
      }
    }]
  },
  {
    path: '/explore',
    component: Layout,
    children: [{
      path: '/explore/list',
      component: () => import('@/views/explore/list'),
      name: 'explore',
      meta: {
        title: 'explore',
        icon: 'explore'
      }
    }, {
      path: '/explore/info',
      hidden: true,
      component: () => import('@/views/explore/info'),
      name: 'exploreInfo',
      meta: {
        title: 'exploreInfo',
        icon: 'dashboard'
      }
    }]
  },
  {
    path: '/banner',
    component: Layout,
    children: [{
      path: '/banner/list',
      component: () => import('@/views/banner/list'),
      name: 'banner',
      meta: {
        title: 'banner',
        icon: 'banner'
      }
    }, {
      path: '/banner/info',
      hidden: true,
      component: () => import('@/views/banner/info'),
      name: 'bannerInfo',
      meta: {
        title: 'bannerInfo',
        icon: 'dashboard'
      }
    }]
  },
  {
    path: '/coupon',
    component: Layout,
    meta: {
      title: 'coupon',
      icon: 'coupon'
    },
    children: [{
      path: '/coupon/list',
      component: () => import('@/views/coupon/list'),
      name: 'couponList',
      meta: {
        title: 'couponList',
        icon: 'couponlist'
      }
    }, {
      path: '/coupon/write-off',
      component: () => import('@/views/coupon/write-off'),
      name: 'couponWriteOff',
      meta: {
        title: 'couponWriteOff',
        icon: 'writeOff'
      }
    }, {
      path: '/coupon/info',
      hidden: true,
      component: () => import('@/views/coupon/info'),
      name: 'couponInfo',
      meta: {
        title: 'couponInfo',
        icon: 'writeOff'
      }
    }]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
