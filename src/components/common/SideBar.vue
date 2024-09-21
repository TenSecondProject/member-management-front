<template>
  <q-list>
    <router-link to="/">
      <q-expansion-item
          hide-expand-icon
          icon="home"
          label="Culcom"
          class="items-center text-weight-bolder hugeLetter text-white q-mt-lg q-mb-lg"
      >
      </q-expansion-item>
    </router-link>
    <router-link to="/announcement">
      <q-expansion-item
          hide-expand-icon
          icon="announcement"
          label="전체 공지"
          class="items-center text-weight-bold smallLetter"
      >
      </q-expansion-item>
    </router-link>

    <router-link to="/bookmarked">
      <q-expansion-item
          icon="star"
          label="즐겨찾기"
          class="items-center text-weight-bold smallLetter"
          :content-inset-level=1
      >
        <router-link v-for="bookmark in bookmarks"
                     :key="bookmark.postId"
                     :to="'/posts/' + bookmark.postId" class="full-width full-height">
          <q-item
              class="bg-grey-9 tinyLetter items-center"
              clickable
          >
            <q-item-section>
              <q-item-label>{{ bookmark.title }}</q-item-label>
            </q-item-section>

          </q-item>
        </router-link>
      </q-expansion-item>
    </router-link>

    <router-link to="/inbox">
      <q-expansion-item
          icon="drafts"
          label="수신함"
          class="items-center text-weight-bold smallLetter"
      >
      </q-expansion-item>
    </router-link>

  </q-list>

</template>

<script setup>

import {onMounted, ref} from "vue";
import {useBookmarkStore} from "@/stores/Bookmark.js";
import {storeToRefs} from "pinia";

const bookmarkStore = useBookmarkStore();

const {bookmarks} = storeToRefs(bookmarkStore);

onMounted(() => {
  bookmarkStore.fetchBookmarks();
})


</script>

<style scoped>

</style>