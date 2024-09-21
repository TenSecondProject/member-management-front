<template>
  <div class="row items-center justify-end q-pr-md">
    <div>
      <q-btn round icon="add" size="sm" @click="toggleLogout" class="text-black bg-white">
        <q-menu>
          <q-list>
            <q-item clickable v-close-popup>
              <q-item-section @click="logout">로그아웃</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <router-link to="/newPost">
                <q-item-section class="text-black">글쓰기</q-item-section>
              </router-link>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>

  </div>
</template>

<script setup>
import {useHeaderStore} from "../../stores/Header.js";
import {ref} from "vue";
import {useUserStore} from "../../stores/User.js";
import {useRouter} from "vue-router";

const showLogout = ref(false);
const router = useRouter();

const headerStore = useHeaderStore();
const userStore = useUserStore();

const toggleLogout = () => {
  showLogout.value = !showLogout.value;
}

const logout = async () => {
  await userStore.logout();
  await router.push("/login");
}
</script>

<style lang="scss" scoped>

</style>