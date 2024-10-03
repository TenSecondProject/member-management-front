<template>
  <div class="row items-center" @click="gotoPost">
    <div class="q-pa-md text-h6 text-weight-bold">[ 공지사항 ]</div>
    <div class="q-ml-xl">{{ mainAnnouncementPost.title }}</div>
  </div>
</template>

<script setup>
import globalAxios from "@/axios/axios.js";
import {onMounted, reactive} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();
const mainAnnouncementPost = reactive({});

onMounted(async () => {
  try {
    const response = await globalAxios.get("/api/v1/posts/main");
    mainAnnouncementPost.postId = response.data.data.postId;
    mainAnnouncementPost.title = response.data.data.title;
    mainAnnouncementPost.content = response.data.data.content;
  } catch (e) {
    console.log(e);
    mainAnnouncementPost.title = "현재 등록된 공지사항이 없습니다.";
    mainAnnouncementPost.postId = "#";
  }
})

const gotoPost = () => {
  router.push(`/posts/${mainAnnouncementPost.postId}`);
}

</script>

<style lang="scss" scoped>

</style>