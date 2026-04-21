import axios, { AxiosError } from "axios";

export const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
})

let isRefreshing = false;
let pendingRequests: (() => void)[] = [];
const resolveQueue = () => {
    pendingRequests.forEach((callback) => callback());
    pendingRequests = [];
};

const NO_REFRESH_URLS = ["auth/sign-in", "auth/refresh"];

http.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest: any = error.config;
        const isNoRefresh = NO_REFRESH_URLS.some((url) =>
            originalRequest.url?.includes(url)
        );
        if (error.response?.status === 401 && !originalRequest._retry && !isNoRefresh) {
            originalRequest._retry = true;
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    pendingRequests.push(() => {
                        resolve(http(originalRequest));
                    });
                });
            }

            isRefreshing = true;

            try {
                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                resolveQueue();

                return http(originalRequest);
            } catch (err) {
                window.location.href = "/sign-in";
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default http;