<template>
  <div>
    <div class="q-px-xxxl q-gutter-y-lg">
<!--      종류 & 마감-->
      <div class="row items-center justify-between">
<!--        종류-->
        <div class="row items-center q-gutter-x-lg">
          <div class="text-h6 text-black text-weight-bold">종류</div>
          <q-btn-dropdown
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
        <div class="row items-center q-gutter-x-md">
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
            v-model="title"
        >
        </q-input>
      </div>
      <div v-if="targetPostCategory.value === 'DELIVERY'" class="row items-center q-gutter-x-md">
        <q-btn-dropdown
            unelevated
            rounded
            color="white"
            text-color="black"
            label="전송대상"
        >
          <q-list>
            <q-item
                clickable v-close-popup
                @click="selectTargetReceiver(i)"
                v-for="(receiver, i) in receivers" :key="i"
                class="rounded-borders"
            >
              <q-item-section>
                <q-item-label>{{ receiver.username }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <div class="q-gutter-sm">
          <q-btn
              color="grey-4"
              rounded
              size="sm"
              unelevated
              text-color="black"
              class="text-weight-bolder"
              @click.stop
              v-for="targetReceiver in targetReceivers"
          >{{targetReceiver.username}}
            <q-icon name="close" size="xss" class="cursor-pointer" @click="targetReceivers.delete(targetReceiver)"/>
          </q-btn>
        </div>
      </div>
<!--      본문-->
      <div class="q-mt-lg">
        <q-editor
            v-model="content"
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
        >작성 완료</q-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {date} from "quasar";
import globalAxios from "@/axios/axios.js";
import {useRouter} from "vue-router";

const router = useRouter();

const postCategories = [
  {label: "공지", value: "ANNOUNCEMENT"},
  {label: "전달", value: "DELIVERY"}
]

const targetPostCategory = reactive({
  label: "",
  value: ""
});

const title = ref('');
const content = ref('');
const receivers = ref([]);
const targetReceivers = ref(new Set());
const expiredDate = ref(date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm'));
const doesExpiredDateExist = ref(false);

onMounted(() => {
  targetPostCategory.label = postCategories[0].label;
  targetPostCategory.value = postCategories[0].value;
  fetchReceivers();
})

const changeTargetPostCategory = (_postCategory) => {
  targetPostCategory.label = _postCategory.label;
  targetPostCategory.value = _postCategory.value;
}

const submit = async () => {
  const requestBody = {};
  requestBody.title = title.value;
  requestBody.content = content.value;
  requestBody.category = targetPostCategory.value;
  requestBody.status = "IN_PROGRESS";
  if (doesExpiredDateExist.value) {
    requestBody.expiredDate = expiredDate.value;
  }

  if (targetPostCategory.value === "DELIVERY") {
    requestBody.sendTargetUserIds = [];
    targetReceivers.value.forEach(r => {requestBody.sendTargetUserIds.push(r.userId)});
  }

  if (requestBody.sendTargetUserIds.length === 0) {
    alert("한 명 이상의 전송대상은 필수입니다.");
    return;
  }

  const response = await globalAxios.post(
      '/api/v1/posts',
      requestBody
  )

  const responseStatusCode = response.data.statusCode;
  if (responseStatusCode === 201) {
    await router.push("/");
  }
  else {
    alert("서버상의 문제로 게시글이 생성되지 않았습니다. 다시 시도해주십쇼.");
  }
}

const fetchReceivers = async () => {
  const response = await globalAxios.get("/api/v1/users/receivers");
  for (let i = 0; i < response.data.data.length; i++) {
    receivers.value.push({
      userId: response.data.data[i].userId,
      username: response.data.data[i].username
    })
  }
}

const selectTargetReceiver = (index) => {
  targetReceivers.value.add(receivers.value[index]);
}

</script>

<style scoped>
.custom-rounded-input .q-field {
  border-radius: 16px !important; /* 원하는 값으로 조정 */
}
</style>