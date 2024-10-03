<template>
  <div>
    <div class="q-px-xxxl q-gutter-y-lg">
<!--      종류 & 마감-->
      <div class="row items-center justify-between">
<!--        종류-->
        <div class="row items-center q-gutter-x-lg">
          <div class="text-h6 text-black text-weight-bold">종류</div>
          <q-btn-dropdown
              disable
              unelevated
              rounded
              color="white"
              text-color="black"
              :label="targetPostCategory.label"
          >
            <q-list>
              <q-item
                  clickable v-close-popup
                  @click="changeTargetPostCategory(postCategory)"
                  v-for="(postCategory, i) in postCategories" :key="i"
                  class="rounded-borders"
              >
                <q-item-section>
                  <q-item-label>{{ postCategory.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
<!--        마감-->
        <div class="row items-center q-gutter-x-sm">
          <div class="text-h6 text-black text-weight-bold ">마감</div>
          <q-input
              v-model="expiredDate"
              outlined
              dense
              rounded
              :disable="!doesExpiredDateExist"
              bg-color="white"
              class="text-weight-bold text-black"
          >
            <template v-slot:prepend>
              <q-icon name="event" color="black" class="cursor-pointer q-ml-xs">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="expiredDate" mask="YYYY-MM-DD HH:mm">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon name="access_time" color="black" class="cursor-pointer q-mr-md">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="expiredDate" mask="YYYY-MM-DD HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-toggle v-model="doesExpiredDateExist" icon="alarm"></q-toggle>
          <div>
            <q-checkbox v-model="isDone" label="완료" />
          </div>
          <div v-if="isAbleToChangeMainPost">
            <q-checkbox v-model="doesChangeMainPost" label="공지" />
          </div>
        </div>
      </div>
<!--      제목-->
      <div>
        <q-input
            outlined
            rounded
            placeholder="제목을 작성해주세요"
            class="custom-rounded-input text-black text-weight-bold"
            bg-color="white"
            v-model="post.title"
        >
        </q-input>
      </div>
<!--      본문-->
      <div class="q-mt-lg">
        <q-editor
            v-model="post.content"
            min-height="50vh"
            max-height="50vh"
            placeholder="본문을 작성해주세요"
        />
      </div>
<!--      작성완료-->
      <div class="q-mt-md">
        <q-btn
            @click="submit"
            color="red-3"
            rounded
            size="16px"
            class="text-weight-bold text-white full-width"
        >수정 완료</q-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onBeforeMount, onMounted, reactive, ref} from "vue";
import {date} from "quasar";
import globalAxios from "@/axios/axios.js";
import {useRoute, useRouter} from "vue-router";
import {useUserStore} from "@/stores/User.js";

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const postCategories = [
  {label: "공지", value: "ANNOUNCEMENT"},
  {label: "전달", value: "DELIVERY"}
]
const targetPostCategory = reactive({
  label: "",
  value: ""
});

const expiredDate = ref(date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm'));
const doesExpiredDateExist = ref(false);
const post = ref(JSON.parse(history.state.post));
const isDone = ref(post.value.status === "COMPLETE");
const doesChangeMainPost = ref(false);

function assignPostCategory() {
  if (post.value.category === postCategories[0].value) {
    targetPostCategory.label = postCategories[0].label;
    targetPostCategory.value = postCategories[0].value;
  }
  else if (post.value.category === postCategories[1].value) {
    targetPostCategory.label = postCategories[1].label;
    targetPostCategory.value = postCategories[1].value;
  } else {
    targetPostCategory.label = postCategories[0].label;
    targetPostCategory.value = postCategories[0].value;
  }
}

function assignExpirationDate() {
  if (post.value.expiredDate === ""
      || post.value.expiredDate === undefined
      || post.value.expiredDate === null
  ) {
    doesExpiredDateExist.value = false;
    return;
  }
  doesExpiredDateExist.value = true;
  expiredDate.value = post.value.expiredDate.replaceAll('.', '-');
}

onMounted(() => {
  assignPostCategory();
  assignExpirationDate();
})

const changeTargetPostCategory = (_postCategory) => {
  targetPostCategory.label = _postCategory.label;
  targetPostCategory.value = _postCategory.value;
  post.value.category = _postCategory.value;
}

const submit = async () => {
  const requestBody = {};
  requestBody.title = post.value.title;
  requestBody.content = post.value.content;
  requestBody.status = isDone.value === true ? 'COMPLETE' : 'IN_PROGRESS';

  if (doesExpiredDateExist.value) {
    requestBody.expiredDate = expiredDate.value;
  }

  try {
    const response = await globalAxios.put(
        `/api/v1/posts/${post.value.id}`,
        requestBody,
        {
          headers: userStore.accessToken
        }
    )
    const responseStatusCode = response.data.statusCode;
    if (responseStatusCode === 200) {
      await globalAxios.put(`/api/v1/posts/main/${post.value.id}`);
      await router.push("/");
    }
    else {
      alert("서버상의 문제로 게시글이 생성되지 않았습니다. 다시 시도해주세요.");
    }
  } catch (e) {
    console.log(e);
    alert("서버상의 문제로 게시글이 생성되지 않았습니다. 다시 시도해주세요.");
  }

}

const isAbleToChangeMainPost = computed(() => {
  const userInfo = userStore.parseAccessToken();
  return post.value.category === "ANNOUNCEMENT" && userInfo.roles.includes("ROLE_MANAGER");
})

</script>

<style scoped>
.custom-rounded-input .q-field {
  border-radius: 16px !important; /* 원하는 값으로 조정 */
}
</style>