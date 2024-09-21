import {defineStore} from "pinia";
import {onMounted, reactive} from "vue";
import globalAxios from "@/axios/axios.js";
import {useUserStore} from "@/stores/User.js";

export const useBookmarkStore = defineStore('bookmark', () => {
    const bookmarks = reactive([]);

    const fetchBookmarks = async () => {
        const userStore = useUserStore();
        const result = await globalAxios.get(
            "/api/v1/posts/bookmarks/summary",
            {
                headers: {
                    "Authorization": "Bearer " + userStore.accessToken
                }
            }
        );
        result.data.data.forEach((b) => {bookmarks.push(b)})
    }

    const addBookmark = async (id, title) => {
        bookmarks.push({postId: id, title: title});
        const result = await globalAxios.post(`/api/v1/posts/${id}/bookmarks`);
    }

    const removeBookmark = async (id) => {
        for (let i = 0; i < bookmarks.length; i++) {
            let targetBookmark = bookmarks[i];
            if (targetBookmark.postId === id) {
                bookmarks.splice(i, 1);
            }
        }
        const result = await globalAxios.delete(`/api/v1/posts/${id}/bookmarks`)
    }

    return {bookmarks, fetchBookmarks, addBookmark, removeBookmark}
})