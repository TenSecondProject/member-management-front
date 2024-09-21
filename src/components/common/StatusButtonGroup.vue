<template>
  <div class="q-gutter-sm">
    <template v-for="(status, i) in statuses">
      <q-btn
          v-if="(props.status === true && status.searchGroup === 'status') || (props.category === true && status.searchGroup === 'category')"
          :key="status.name"
          :label="status.name"
          :color="selectedStatuses.includes(status) ? status.activeColor : status.inactiveColor"
          @click="toggleStatus(i)"
          unelevated
          class="custom-rounded-sm"
      />
    </template>

  </div>
</template>

<script setup>

import {reactive, ref} from "vue";

const emit = defineEmits(['toggleFilter']);

const props = defineProps({
  category: Boolean,
  status: Boolean
})

const selectedStatuses = reactive([]);
const statuses = [
  {name: '미완료', searchValue: 'UNCOMPLETED', searchGroup: 'status', activeColor: 'deep-orange', inactiveColor: 'grey-5'},
  {name: '진행중', searchValue: 'IN_PROGRESS', searchGroup: 'status', activeColor: 'deep-orange', inactiveColor: 'grey-5'},
  {name: '완료', searchValue: 'COMPLETE', searchGroup: 'status', activeColor: 'deep-orange', inactiveColor: 'grey-5'},
  {name: '공지', searchValue: 'ANNOUNCEMENT', searchGroup: 'category', activeColor: 'deep-orange', inactiveColor: 'grey-5'},
  {name: '기타', searchValue: 'ETC', searchGroup: 'category', activeColor: 'deep-orange', inactiveColor: 'grey-5'}
];


const toggleStatus = (i) => {
  const status = statuses[i];
  if (!selectedStatuses.includes(status)) {
    selectedStatuses.push(status);
  } else {
    selectedStatuses.splice(selectedStatuses.indexOf(status), 1);
  }
  emit('toggleFilter', selectedStatuses);
}

</script>

<style scoped>
.q-btn {
  min-width: 80px; /* 버튼의 최소 너비 설정 */
}
</style>
