<template>
  <LoginPage v-if="!userStore.isLogin"></LoginPage>
  <div class="row" v-if="userStore.isLogin">
    <SideBar id="sideBar" class="bg-grey-9"/>
    <div class="col-8" id="mainContainer">
      <router-view :key="$route.fullPath" class="q-pa-lg"></router-view>
    </div>
    <div class="col-2" id="remainContainer"></div>
  </div>
</template>

<script setup>
import SideBar from "../../components/common/SideBar.vue";
import Header from "./LogoutButton.vue";
import {computed, ref} from "vue";
import LoginPage from "../../components/page/LoginPage.vue";
import {useUserStore} from "../../stores/User.js";

const leftDrawerOpen = ref(true);
const userStore = useUserStore();
</script>

<style scoped>
#sideBar {
  color: white;
  height: 100vh;
  text-align: start;
  position: fixed;
  top: 0;
  left: 0;
  width: 16.6667%;
}

#header {
  height: 5vh;
}

#mainContainer {
  /*height: 100vh;*/
  margin-left: 16.6667%; /* SideBar의 고정된 위치를 피하기 위해 마진 설정 */
  width: calc(100% - 16.6667% - 16.6667%); /* mainContainer의 너비를 조정하여 sidebar의 너비를 뺀 나머지 부분을 차지하도록 설정 */
  background-color: #F4F4F4;
}

#remainContainer {
  color: white;
  height: 100vh;
  width: 16.6667%;
}
</style>
