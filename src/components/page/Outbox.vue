<template>
  <div>
    <div class="row items-center justify-between bg-grey-5 rounded-borders">
      <MainAnnouncement/>
      <LogoutButton/>
    </div>

    <!-- 필터 및 검색 기능 -->
    <div class="row items-center justify-between q-mt-lg">
      <!-- 필터 기능 -->
      <div class="row items-center">
        <PostOrderDropdown
            @set-order-standard="setOrderStandard"
        />

        <StatusButtonGroup
            class="q-ml-md"
            @toggle-filter="setSearchFilter"
            :category="false"
            :status="true"
        />
      </div>

      <div>
        <SearchBar
            @search="setSearchKeyword"
        />
      </div>
    </div>

    <!-- 게시글기능 -->
    <div v-if="isEmptyPost" class="text-weight-bold absolute-center">검색 결과가 없습니다.</div>
    <div v-if="posts && !isEmptyPost" v-for="post in posts" v-bind:key="post.id" class="q-mt-lg">
      <PostComponent
          :id="post.id"
          :title="post.title"
          :status="post.status"
          :createdAt="post.createdAt"
          :writtenBy="post.writtenBy"
          :bookmarked="post.bookmarked"
          :content="post.content"
          :commentsCount="post.commentCount"
          :emojiResponse="post.emojiResponse"
          type="sentPost"
      />
    </div>
    <!-- 페이지네이션-->
    <div v-if="posts && !isEmptyPost" class="q-pt-sm flex flex-center">
      <q-pagination
          v-model="currentPage"
          :max="maxPage"
          color="grey-9"
          @click="fetchPosts"
      />
    </div>
  </div>
</template>

<script setup>
import {useHeaderStore} from "@/stores/Header.js";
import LogoutButton from "@/components/common/LogoutButton.vue";
import PostOrderDropdown from "@/components/common/PostOrderDropdown.vue";
import PostComponent from "@/components/common/PostComponent.vue";
import {reactive, ref} from "vue";
import StatusButtonGroup from "../../components/common/StatusButtonGroup.vue";
import SearchBar from "../../components/common/SearchBar.vue";
import globalAxios from "../../axios/axios.js";
import {Post} from "@/domain/Post.js";
import MainAnnouncement from "@/components/common/MainAnnouncement.vue";

const headerStore = useHeaderStore();
headerStore.setBannerName("수신함");

const currentPage = ref(1);
const maxPage = ref(1);
const posts = ref(null);
const isEmptyPost = ref(false);

// be emitted data
let orderStandard = reactive({});
let filters = reactive([]);
let searchType = reactive({});
let searchValue = reactive('');

const fetchPosts = async () => {
  let param = {
    page: currentPage.value - 1,
    size: 3
  };

  // 정렬 기준이 존재한다면
  if (orderStandard !== null) {
    param.orderBy = orderStandard.condition;
  }

  // category는 ANNOUNCEMENT
  param.category = "DELIVERY";

  // 필터 적용된 상태라면
  for (let i = 0; i < filters.length; i++) {
    const filter = filters[i];
    param.status = param.status === undefined ? filter.searchValue : param.status + ',' + filter.searchValue;
  }

  // 검색 기준이 존재한다면
  param.searchType = searchType.condition;
  param.searchValue = searchValue;

  const result = await globalAxios.get(
      "/api/v1/posts/sent",
      {
        params: param
      })
  const postResult = result.data.data.content;
  maxPage.value = result.data.data.totalPages;

  const convertedPosts = [];
  postResult.forEach(data => {
    const postData = new Post(data.id,
        data.title,
        data.content,
        data.status,
        data.writtenBy,
        data.createdAt,
        data.bookmarked,
        data.commentCount,
        data.emojiResponseDtos,
        data.receiversName
    );
    convertedPosts.push(postData);
  })
  posts.value = convertedPosts;
  isEmptyPost.value = posts.value.length === 0
}

fetchPosts();

const setSearchFilter = (_filters) => {
  filters = _filters;
  fetchPosts();
}

const setSearchKeyword = (_searchType, _searchValue) => {
  searchType = _searchType;
  searchValue = _searchValue;
  fetchPosts();
}

const setOrderStandard = (_orderStandard) => {
  orderStandard = _orderStandard;
}
</script>

<style lang="scss" scoped>

</style>