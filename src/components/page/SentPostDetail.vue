<template>
  <div class="q-gutter-md row justify-center q-pt-xl">
    <q-card v-if="post" flat class="custom-rounded post-detail-card-container">
      <!--      카드 헤더-->
      <q-card-section class="row items-center justify-between">
        <!-- 좌측 -->
        <div>
          <div class="row items-center justify-start q-gutter-x-sm">
            <div class="text-h6 text-weight-bold">{{post.title}}</div>
            <q-btn unelevated class="custom-rounded-sm text-weight-bold" :label="translateStatusInKorean(post.status)" :color="post.status === 'IN_PROGRESS' ? 'deep-orange' : 'black'" size="sm"/>
            <q-icon v-if="doesPostContainExpiredDate" name="event" size="sm" color="grey"></q-icon>
            <div v-if="doesPostContainExpiredDate"
                class="text-grey text-caption text-weight-bold">
              {{ getDaysWithKorean(date.extractDate(post.expiredDate, 'YYYY.MM.DD HH:mm')) }}
            </div>
          </div>
          <div class="text-grey text-caption text-weight-bold">{{ post.username }}</div>
        </div>
        <!-- 우측 -->
        <div>
          <div class="row text-grey text-caption justify-end">{{ post.createdAt }}</div>
          <div class="row items-center q-gutter-x-sm justify-end" v-if="userInfo.userId === post.userId">
            <div class="text-grey text-caption text-weight-bold">수신자: </div>
            <div v-for="name in post.receiversName" class="text-grey text-caption text-weight-bold">{{ name }}</div>
          </div>
          <div class="row items-center q-gutter-x-sm justify-end" v-if="userInfo.userId === post.userId">
            <div class="text-grey text-caption text-weight-bold cursor-pointer" @click="moveUpdatePage">수정</div>
            <div class="text-grey text-caption text-weight-bold cursor-pointer" @click="deletePost">삭제</div>
          </div>

        </div>

      </q-card-section>
      <!--      카드 본문-->
      <q-card-section class="q-mt-md" style="word-break: break-all">
        <div class="text-black" v-html="post.content"></div>
      </q-card-section>
      <!--      카드 트레일러-->
      <q-card-section class="row items-center justify-between">
        <!-- 좌측 -->
        <div class="row q-gutter-x-sm items-center">
          <q-icon name="notes" class="text-grey" size="xs"></q-icon>
          <div class="text-grey">댓글 수 {{post.comments.length}}</div>
        </div>
        <!-- 우측 -->
        <div>
          <div class="q-gutter-xs row items-center">
            <div class="row items-center" v-for="emojiBtn in post.emojis">
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
<!--            <q-btn flat round size="md" v-if="localBookmarked" @click.stop="toggleBookmark">-->
<!--              <font-awesome-icon  icon="fa-solid fa-bookmark"/>-->
<!--            </q-btn>-->
<!--            <q-btn flat round size="md" v-if="!localBookmarked" @click.stop="toggleBookmark">-->
<!--              <font-awesome-icon  icon="fa-regular fa-bookmark"/>-->
<!--            </q-btn>-->
          </div>
        </div>
      </q-card-section>
      <!--      댓글작성-->
      <q-card-section class="row items-center q-gutter-md">
        <q-input outlined autogrow rounded placeholder="댓글을 남겨주세요." class="post-detail-comment-input" v-model="commentInput"></q-input>
        <q-btn color="grey-8" label="등록" class="post-detail-submit-button" @click="addCommentOnPost"></q-btn>
      </q-card-section>
      <!--      댓글폼-->
      <div v-for="(comment, i) in post.comments" class="">
        <Comment :comment="comment" :userInfo="userInfo" @delete-comment="deleteComment"/>
        <q-separator class="q-mx-lg"/>
      </div>

    </q-card>
  </div>
</template>

<script setup>
import {date} from 'quasar'
import {getDaysWithKorean} from '@/util/DateUtil'
import globalAxios from "@/axios/axios.js";
import {useRoute, useRouter} from "vue-router";
import {useUserStore} from "@/stores/User.js";
import {computed, onMounted, reactive, ref} from "vue";
import {PostDetail} from "@/domain/PostDetail.js";
import Comment from "@/components/common/Comment.vue";
import EmojiAccordion from "@/components/common/EmojiAccordion.vue";
import EmojiResponse from "@/domain/EmojiResponse.js";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const userInfo = userStore.parseAccessToken();

const post = ref(null);

const commentInput = ref('');

onMounted(() => {
  fetchPostDetail();
})

const fetchPostDetail = async () => {
  const response = await globalAxios.get(`/api/v1/posts/sent/${route.params.id}`);
  await assignDataInPost(response.data.data);
}

const assignDataInPost = (data) => {
  post.value = new PostDetail(
      data.id,
      data.title,
      data.content,
      data.category,
      data.status,
      data.expiredDate,
      data.userId,
      data.username,
      data.createdAt,
      data.bookmarked,
      data.commentResponseDtos,
      data.emojiResponseDtos,
      data.receiversName
  );
}

const handleEmojiSelected = (emoji) => {
  const existEmojiIndex = post.value.emojis.findIndex(emojiObject => emojiObject.emoji === emoji);
  const userInfo = userStore.parseAccessToken();
  // 이모지가 존재하면
  if (existEmojiIndex !== -1) {
    const targetEmoji = post.value.emojis[existEmojiIndex];
    // 이미 본인이 클릭한 이모지라면
    if (targetEmoji.usernames.includes(userInfo.username)) {
      post.value.emojis[existEmojiIndex].totalCount -= 1;

      // 삭제 후 totalCount가 0
      if (post.value.emojis[existEmojiIndex].totalCount === 0) {
        post.value.emojis.splice(existEmojiIndex, 1);
      }

      // 삭제 후 totalCount가 0이 아님
      else {
        const targetUsernameIndex = post.value.emojis[existEmojiIndex].usernames.findIndex(_username => _username === userInfo.username);
        post.value.emojis[existEmojiIndex].usernames.splice(targetUsernameIndex, 1);
      }
      globalAxios.put(`/api/v1/posts/${post.value.id}/emojis`, {content: emoji});
    }
    // 본인이 클릭하지 않은 이모지라면
    else {
      post.value.emojis[existEmojiIndex].totalCount += 1;
      post.value.emojis[existEmojiIndex].usernames.push(userInfo.username);
      globalAxios.post(`/api/v1/posts/${post.value.id}/emojis`, {content: emoji});
    }
  }
  // 이모지 클릭이 된적 없다면
  else {
    post.value.emojis.push(new EmojiResponse(emoji, 1, [userInfo.username]));
    globalAxios.post(`/api/v1/posts/${post.value.id}/emojis`, {content: emoji});
  }
}


const addCommentOnPost = async () => {
  if (commentInput.value === '') return;

  const response = await globalAxios.post(
      `/api/v1/posts/${route.params.id}/comments`,
      {content: commentInput.value},
  );
  commentInput.value = '';
  await fetchPostDetail();
}

const deleteComment = async (commentId) => {
  const response = await globalAxios.delete(`/api/v1/posts/${route.params.id}/comments/${commentId}`);
  await fetchPostDetail();
}

const deletePost = async () => {
  const response = await globalAxios.delete(`/api/v1/posts/${route.params.id}`);
  router.back();
}

const translateStatusInKorean = (status) => {
  if (status === "IN_PROGRESS") {
    return "진행중"
  } else if (status === "UNCOMPLETED") {
    return "미완료"
  } else if (status === "COMPLETE") {
    return "완료"
  }
  return "상태미정";
}

const moveUpdatePage = () => {
  router.push({
    path: `/posts/${post.value.id}/update`,
    state: {
      post: JSON.stringify(post.value)
    }
  })
}

const doesPostContainExpiredDate = computed(() => {
  return post.expiredDate !== ''  && post.expiredDate !== undefined  && post.expiredDate !== null;
})

</script>

<style scoped>
.post-detail-card-container {
  max-width: 850px; /* 카드의 최대 너비 */
  width: 100%; /* 기본 너비는 100% */
  min-width: 300px; /* 카드의 최소 너비 */
}

.post-detail-comment-input {
  flex: 1; /* 기본 너비는 100% */
}

.post-detail-submit-button {
  width: 72px;
  height: 52px;
  border-radius: 8px;
  font-weight: 800;
  letter-spacing: 2px;
}

.post-detail-comment-separator {
  width: 100%;
  border-bottom: 1px solid lightgrey;
}
</style>