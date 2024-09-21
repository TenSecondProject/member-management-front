<template>
  <div class="row justify-between q-px-lg q-my-md full-width">
    <!-- 좌측 -->
    <div>
      <div class="text-black text-weight-bold">{{ comment.username }}</div>
      <div class="text-grey" v-if="!doesModify">{{ comment.content }}</div>
      <q-input dense outlined rounded class="full-width" v-if="doesModify" v-model="comment.content"></q-input>
    </div>
    <!-- 우측 -->
    <div class="column items-end">
      <div class="text-caption">{{ comment.writtenDate }}</div>
      <div class="row items-center justify-end q-gutter-x-xs" v-if="userInfo.userId === comment.userId">
        <div class="text-white text-caption bg-primary q-px-sm custom-rounded-sm" v-if="!doesModify"    @click="doesModify = !doesModify">수정</div>
        <div class="text-white text-caption bg-primary q-px-sm custom-rounded-sm" v-if="doesModify"     @click="updateComment">변경</div>
        <div class="text-white text-caption bg-red q-px-sm custom-rounded-sm"     v-if="!doesModify"    @click="deleteComment">삭제</div>
        <div class="text-white text-caption bg-red q-px-sm custom-rounded-sm"     v-if="doesModify"     @click="doesModify = !doesModify">취소</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import globalAxios from "@/axios/axios.js";
import {useRoute} from "vue-router";
import {useUserStore} from "@/stores/User.js";

const props = defineProps(['comment', 'userInfo'])
const emit = defineEmits(['delete-comment'])
const route = useRoute();
const userStore = useUserStore();

const doesModify = ref(false);

const updateComment = async () => {
  const response = await globalAxios.put(
      `/api/v1/posts/${route.params.id}/comments/${props.comment.id}`,
      {
        content: props.comment.content
      },
      {
        headers: userStore.accessToken
      }
  )

  doesModify.value = !doesModify.value;
}

const deleteComment = async () => {
  emit('delete-comment', props.comment.id);
}

</script>

<style lang="scss" scoped>

</style>