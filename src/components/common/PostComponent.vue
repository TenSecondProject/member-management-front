<template>
  <div>
    <q-card flat class="bg-white q-pl-lg q-pr-lg q-pt-sm q-pb-sm custom-rounded" @click="moveDetailPage">
      <div class="row items-start justify-between">
        <div class="row items-center q-gutter-md">
          <div class="text-h6 text-black text-weight-bold">{{ title }}</div>
          <q-btn flat class="custom-rounded-sm text-white" :class="status === '진행중' ? 'bg-deep-orange' : 'bg-black'"> {{ status }}</q-btn>
        </div>
        <div class="text-right text-black tinyLetter">
          <p class="q-my-none">{{ createdAt }}</p>
          <p class="q-my-none">{{ writtenBy }}</p>
        </div>
      </div>
      <div class="q-mt-sm">
        <p class="text-left">
          {{ truncate(content, 120) }}
        </p>
      </div>
      <div class="row items-center justify-between">
        <div class="row items-center q-gutter-sm">
          <q-icon name="comment"></q-icon>
          <div class="tinyLetter">댓글 수 : {{ commentsCount }}</div>
        </div>
        <div class="q-gutter-xs row items-center">
          <div class="row items-center" v-for="emojiBtn in props.emojiResponse">
            <q-btn
                color="grey-3"
                rounded
                size="sm"
                unelevated
                text-color="black"
                class="text-weight-bolder"
                @click.stop
            >
              {{ emojiBtn.emoji }} {{ emojiBtn.totalCount }}
            </q-btn>
          </div>
          <EmojiAccordion @emoji-selected="handleEmojiSelected"/>
          <q-btn flat round size="md" v-if="localBookmarked" @click.stop="toggleBookmark">
            <font-awesome-icon  icon="fa-solid fa-bookmark"/>
          </q-btn>
          <q-btn flat round size="md" v-if="!localBookmarked" @click.stop="toggleBookmark">
            <font-awesome-icon  icon="fa-regular fa-bookmark"/>
          </q-btn>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup>

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import EmojiAccordion from "../../components/common/EmojiAccordion.vue";
import {reactive, ref} from "vue";
import globalAxios from "@/axios/axios.js";
import {useBookmarkStore} from "@/stores/Bookmark.js";
import {useRouter} from "vue-router";
import EmojiResponse from "@/domain/EmojiResponse.js";
import {useUserStore} from "@/stores/User.js";

const props = defineProps({
  id: Number,
  title: String,
  status: String,
  createdAt: String,
  writtenBy: String,
  bookmarked: Boolean,
  content: String,
  commentsCount: Number,
  emojiResponse: Array,
  receiversName: Array,
  type: String
});

const emojiList = reactive([]);
const localBookmarked = ref(props.bookmarked);
const bookmarkStore = useBookmarkStore();
const userStore = useUserStore();
const router = useRouter();

const moveDetailPage = () => {
  if (props.type === "sentPost") {
    router.push(`/posts/sent/${props.id}`);
    return;
  }
  router.push(`/posts/${props.id}`);
}

const handleEmojiSelected = (emoji) => {
  const existEmojiIndex = props.emojiResponse.findIndex(emojiObject => emojiObject.emoji === emoji);
  const userInfo = userStore.parseAccessToken();
  // 이모지가 이미 존재하는 경우
  if (existEmojiIndex !== -1) {
    const targetEmoji = props.emojiResponse[existEmojiIndex];
    // 이미 본인이 클릭한 이모지라면
    if (targetEmoji.usernames.includes(userInfo.username)) {
      props.emojiResponse[existEmojiIndex].totalCount -= 1;
      if (props.emojiResponse[existEmojiIndex].totalCount === 0) {
        props.emojiResponse.splice(existEmojiIndex, 1);
      }

      // 삭제 후 totalCount가 0이 아님
      else {
        const targetUsernameIndex = props.emojiResponse[existEmojiIndex].usernames.findIndex(_username => _username === userInfo.username);
        props.emojiResponse[existEmojiIndex].usernames.splice(targetUsernameIndex, 1);
      }
      globalAxios.put(`/api/v1/posts/${props.id}/emojis`, {content: emoji});
    }
    // 본인이 클릭하지 않은 이모지라면
    else {
      props.emojiResponse[existEmojiIndex].totalCount += 1;
      props.emojiResponse[existEmojiIndex].usernames.push(userInfo.username);
      globalAxios.post(`/api/v1/posts/${props.id}/emojis`, {content: emoji});
    }
  }
  // 이모지 클릭이 된적 없다면
  else {
    props.emojiResponse.push(new EmojiResponse(emoji, 1, [userInfo.username]));
    globalAxios.post(`/api/v1/posts/${props.id}/emojis`, {content: emoji});
  }
}

const truncate = (text, maxLength) => {
  text = text.replace(/<\/?[^>]+(>|$)/g, "");
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}

const toggleBookmark = () => {
  localBookmarked.value = !localBookmarked.value;
  if (localBookmarked.value) {
    bookmarkStore.addBookmark(props.id, props.title);
  } else {
    bookmarkStore.removeBookmark(props.id);
  }
}

</script>

<style lang="scss" scoped>

</style>