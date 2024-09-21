import {defineStore} from "pinia";
import {ref} from "vue";

export const useHeaderStore = defineStore('header', () => {
    const bannerName = ref('')
    function setBannerName(name) {
        bannerName.value = name;
    }

    return {bannerName, setBannerName}
})