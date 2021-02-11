export const myrouter = {
  path: '/hemamm',
  redirect: '/hemamm/data',
  component: () => import('@/components/LayOut/LayOut'),
  children: [
    {
      path: 'data',
      name: 'data',
      component: () => import('@/views/data'),
      meta: {
        title: '数据概览',
        icon: 'el-icon-s-grid'
      }
    },
    {
      path: 'base',
      name: 'base',
      component: () => import('@/components/LayOut/Default'),
      meta: {
        title: '后台管理',
        icon: 'el-icon-s-check'
      },
      children: [
        {
          path: 'users',
          component: () => import('@/views/users'),
          name: 'base-users',
          meta: {
            title: '用户', icon: 'el-icon-menu'
          }
        },
        {
          path: 'menus',
          name: 'base-menus',
          component: () => import('@/views/menus'),
          meta: { title: '菜单', icon: 'el-icon-menu' }
        },
        {
          path: 'permissions',
          name: 'base-permissions',
          component: () => import('@/views/permissions'),
          meta: { title: '权限', icon: 'el-icon-menu' }
        },
        {
          path: 'log',
          name: 'base-log',
          component: () => import('@/views/log'),
          meta: { title: '日志', icon: 'el-icon-menu' }
        }
      ]
    },
    {
      path: 'companys',
      name: 'companys',
      component: () => import('@/views/companys'),
      meta: {
        title: '企业管理',
        icon: 'el-icon-s-cooperation'
      }
    },
    {
      path: 'questions',
      name: 'questions',
      component: () => import('@/components/LayOut/Default'),
      meta: {
        title: '题库管理',
        icon: 'el-icon-s-order'
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/questions'),
          name: 'questions-list',
          meta: { title: '基础题库', icon: 'el-icon-menu' }
        },
        {
          path: 'choice',
          component: () => import('@/views/questions-choice'),
          name: 'questions-choice',
          meta: { title: '精选题库', icon: 'el-icon-menu' }
        },
        {
          path: 'new',
          component: () => import('@/views/questions-new'),
          name: 'questions-new',
          meta: { title: '试题录入', icon: 'el-icon-menu' }
        },
        {
          path: 'randoms',
          component: () => import('@/views/questions-randoms'),
          name: 'questions-randoms',
          meta: { title: '组题列表', icon: 'el-icon-menu' }
        }
      ]
    },
    {
      path: 'subjects',
      name: 'subjects',
      component: () => import('@/components/LayOut/Default'),
      meta: {
        title: '学科管理',
        icon: 'el-icon-s-management'
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/subjects'),
          name: 'subjects-list',
          meta: { title: '学科', icon: 'el-icon-menu' }
        },
        {
          path: 'directorys',
          component: () => import('@/views/directorys'),
          name: 'subjects-directorys',
          meta: { title: '目录', icon: 'el-icon-menu' }
        },
        {
          path: 'tags',
          component: () => import('@/views/tags'),
          name: 'subjects-tags',
          meta: { title: '标签', icon: 'el-icon-menu' }
        }
      ]
    },
    {
      path: 'articles',
      name: 'articles',
      component: () => import('@/views/articles'),
      meta: {
        title: '面试技巧',
        icon: 'el-icon-phone'
      }
    }
  ]
}
