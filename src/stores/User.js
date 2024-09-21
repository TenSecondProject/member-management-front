import {defineStore} from "pinia";
import {computed, ref} from "vue";

export const useUserStore = defineStore('culcomUser', () => {
    const accessToken = ref(localStorage.getItem("culcomAccessToken"));
    const refreshToken = ref(localStorage.getItem("culcomRefreshToken"));

    const isLogin =
        computed(() => {
            return accessToken.value !== undefined && accessToken.value !== null && accessToken.value !== '';
        });

    function login(_accessToken, _refreshToken)  {
        accessToken.value = _accessToken;
        refreshToken.value = _refreshToken;
        localStorage.setItem("culcomAccessToken", accessToken.value);
        localStorage.setItem("culcomRefreshToken", refreshToken.value);
    }

    function logout() {
        accessToken.value = null;
        refreshToken.value = null;
        localStorage.clear();
    }

    function parseAccessToken() {
        try {
            // JWT 문자열을 "."를 기준으로 나누어 세 부분으로 분리
            const base64Url = accessToken.value.split('.')[1];

            // Base64 URL-safe 인코딩된 문자열을 디코딩
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            // JSON 문자열을 객체로 변환
            return JSON.parse(jsonPayload);
        } catch (error) {
            post.error('Invalid JWT accessToken:', error);
            return null;
        }
    }

    function refreshTokens(newAccessToken, newRefreshToken) {
        accessToken.value = newAccessToken;
        refreshToken.value = newRefreshToken;
        localStorage.setItem("culcomAccessToken", newAccessToken);
        localStorage.setItem("culcomRefreshToken", newRefreshToken);
    }

    function getAccessToken ()  {
        return accessToken;
    }

    function getRefreshToken() {
        return JSON.parse(refreshToken.value);
    }

    return {getAccessToken, getRefreshToken, isLogin, login, logout, parseAccessToken, refreshTokens}
});