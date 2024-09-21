<template>
  <div class="row items-center q-gutter-sm">
    <q-input outlined dense v-model="searchValue" label="검색어를 입력해주세요." @keyup.enter="search" rounded>
      <template v-slot:prepend>
        <q-icon name="search"/>
      </template>
      <template v-slot:append>
        <q-icon name="close" class="cursor-pointer" @click="searchValue=''"/>
      </template>
    </q-input>

    <q-btn-dropdown unelevated outline color="white" text-color="black" :label="searchType.label" class="custom-rounded-sm">
      <q-list>
        <q-item clickable v-close-popup @click="setSearchType('제목', 'TITLE')">
          <q-item-section>
            <q-item-label>제목</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="setSearchType('내용', 'CONTENT')">
          <q-item-section>
            <q-item-label>내용</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="setSearchType('작성자', 'WRITTEN_USER')">
          <q-item-section>
            <q-item-label>작성자</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <q-btn @click="search" >검색</q-btn>
  </div>
</template>

<script setup>
import {reactive, ref} from "vue";

const emit = defineEmits(['search']);

let searchType = reactive({
  label: '제목',
  condition: 'TITLE'
});
const searchValue = ref('');

const setSearchType = (label, condition) => {
  searchType.label = label;
  searchType.condition = condition;
}

const search = () => {
  emit('search', searchType, searchValue.value);
}

</script>

<style scoped>

</style>