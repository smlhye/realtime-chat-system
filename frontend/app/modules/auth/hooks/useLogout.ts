import { useMutation, useQueryClient } from "@tanstack/react-query"
import { authService } from "../services/auth.service";
import { toast } from "sonner";
import { useUserStore } from "@/app/stores/user.store";

export const useLogout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: authService.logoutApi,
        onSuccess: async (res) => {
            useUserStore.getState().setUser(null);
            queryClient.clear();
            toast.success('Đăng xuất thành công');
            window.location.href = '/sign-in';
        },
        onError: (error: any) => {
            toast.error(error.message || 'Đăng xuất không thành công')
        }
    })
}