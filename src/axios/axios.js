import axios from "axios";
import {useUserStore} from "@/stores/User.js";
import {useRouter} from "vue-router";
import router from "@/router/route.js";

const globalAxios = axios.create({
    baseURL: import.meta.env.VITE_SERVER_BASE_URL,
    headers: {
        "Access-Control-Allow-Origin": import.meta.env.VITE_BASE_URL,
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    },
    withCredentials: true
});

globalAxios.interceptors.request.use(
    (config) => {
        const userStore = useUserStore();
        const accessToken = userStore.getAccessToken().value;
        // const refreshTokenKey = userStore.refreshToken.uuid;
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
            // config.headers.refreshToken = 'refreshTokenKey';
        }
        return config;
    },
     (error) => {
        return Promise.reject(error);
    }
);

globalAxios.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        const userStore = useUserStore();
        const originalRequest = error.config;
        if (error.response.status === 401) {
            const tokens = await refreshUserTokens();
            userStore.refreshTokens(tokens.accessToken, JSON.stringify(tokens.refreshToken));
            return globalAxios(originalRequest);
        }
        return Promise.reject(error);
    }
)

async function refreshUserTokens() {
    const userStore = useUserStore();
    try {
        const refreshTokenKey = userStore.getRefreshToken().uuid;
        const response = await axios.put(
            import.meta.env.VITE_SERVER_BASE_URL + '/api/v1/users/token/refresh',
            {},
            {
                headers: {
                    "refresh": refreshTokenKey
                }
            }
        );
        return response.data;
    } catch (e) {
        alert("로그인이 만료되었습니다. 다시 로그인 해주세요.");
        userStore.logout();
        await router.push("/login");
        await Promise.reject(e);
    }
}

export default globalAxios