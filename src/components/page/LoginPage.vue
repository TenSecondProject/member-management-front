<template>
  <div class="login-container column justify-center content-center">
    <div class="text-h4 text-weight-bold text-center">안녕하세요!</div>
    <q-form @submit.prevent="onSubmit">
      <q-input outlined name="username" v-model="username" label="ID를 입력해주세요." dense class="q-ma-xs"
               style="width: 300px;"/>
      <q-input outlined name="password" type="password" v-model="password" label="비밀번호를 입력해주세요." dense class="q-ma-xs"
               style="width: 300px;"/>
      <div v-if="wrongIdOrPassword" class="text-red text-weight-bold"> ID 혹은 비밀번호가 틀렸습니다. 다시 시도해주세요.</div>
      <div v-if="doesLoginFail" class="text-red text-weight-bold">원인 미상의 이유로 로그인이 실패했습니다. 개발자에게 문의주세요.</div>
      <div class="row items-center justify-between">

        <div class="text-weight-bold">회원이 아니신가요?</div>
        <q-btn
            type="submit"
            label="로그인"
            color="grey-9"
            rounded
            unelevated
            class="login-button q-ma-xs text-white"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import {ref} from "vue";
import globalAxios from "@/axios/axios.js";
import qs from 'qs';
import {useUserStore} from "@/stores/User.js";
import {useRouter} from "vue-router";
import axios from "axios";
import Home from "@/components/page/Home.vue";

const router = useRouter();
const userStore = useUserStore();

const username = ref('');
const password = ref('');

const wrongIdOrPassword = ref(false);
const doesLoginFail = ref(false);

const loginHeader = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
}

const onSubmit = async () => {
  const loginInfo = qs.stringify({
    "username": username.value,
    "password": password.value
  });


  try {
    const response = await axios.post(
        import.meta.env.VITE_SERVER_BASE_URL + '/api/login',
        loginInfo,
        loginHeader
    );
    await userStore.login(response.data.accessToken, JSON.stringify(response.data.refreshToken));
    await router.push("/");
  } catch (e) {
    if (e.response.status === 401) {
      wrongIdOrPassword.value = true;
    }
    else {
      doesLoginFail.value = true;
      post.log("login failed", e);
    }
  }

}
</script>

<style scoped>
.login-container {
  height: 100vh;
}
</style>
