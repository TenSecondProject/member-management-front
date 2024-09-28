import { createRouter, createWebHistory } from 'vue-router'
import Home from "../components/page/Home.vue";
import Announcement from "../components/page/Announcement.vue";
import Bookmark from "../components/page/Bookmark.vue";
import Inbox from "../components/page/Inbox.vue";
import LoginPage from "../components/page/LoginPage.vue";
import {useUserStore} from "../stores/User.js";
import NewPost from "@/components/page/NewPost.vue";
import PostDetail from "@/components/page/PostDetail.vue";
import UpdatePost from "@/components/page/UpdatePost.vue";
import Outbox from "@/components/page/Outbox.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginPage,
    },
    {
      path: '/announcement',
      name: 'Announcement',
      component: Announcement,
      meta: { requiresAuth: true }
    },
    {
      path: '/bookmarked',
      name: 'Bookmark',
      component: Bookmark,
      meta: { requiresAuth: true }
    },
    {
      path: '/inbox',
      name: 'Inbox',
      component: Inbox,
      meta: { requiresAuth: true }
    },
    {
      path: '/outbox',
      name: 'OutBox',
      component: Outbox,
      meta: { requiresAuth: true }
    },
    {
      path: '/posts/:id',
      name: 'PostDetail',
      component: PostDetail,
      meta: { requiresAuth: true }
    },
    {
      path: '/newPost',
      name: 'NewPost',
      component: NewPost,
      meta: { requiresAuth: true }
    },
    {
      path: '/posts/:id/update',
      name: 'UpdatePost',
      component: UpdatePost,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isAuthenticated = userStore.isLogin // 여기서 실제 인증 상태를 확인해야 합니다.
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
