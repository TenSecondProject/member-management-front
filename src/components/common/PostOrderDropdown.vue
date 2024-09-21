<template>
    <q-btn-dropdown unelevated outline color="white" text-color="black" :label="orderStandard.label" class="custom-rounded-sm">
      <q-list>
        <q-item clickable v-close-popup @click="setOrderType({label: '최신순', condition: 'createdAt'})">
          <q-item-section>
            <q-item-label>최신순</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="setOrderType({label: '마감일순', condition: 'expiredDate'})">
          <q-item-section>
            <q-item-label>마감일순</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

</template>

<script setup>
import {onBeforeMount, onMounted, reactive, ref} from "vue";

const emit = defineEmits(['setOrderStandard']);

const orderStandard = reactive({
  label: '최신순',
  condition: 'createdAt'
})

const setOrderType = (_orderStandard) => {
  orderStandard.label = _orderStandard.label;
  orderStandard.condition = _orderStandard.condition;
  emit('setOrderStandard', orderStandard);
}

onBeforeMount(() => {
  emit('setOrderStandard', orderStandard);
})

</script>

<style lang="scss" scoped>

</style>