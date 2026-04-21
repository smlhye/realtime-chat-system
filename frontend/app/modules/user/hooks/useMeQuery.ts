import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/user.service";
import { useUserStore } from "@/app/stores/user.store";
import { UserResponse } from "@/app/schemas/generated/type";

export function useMeQuery() {
    const setUser = useUserStore((s) => s.setUser);
    return useQuery<UserResponse>({
        queryKey: ['me'],
        queryFn: async () => {
            const res = await userService.fetchMe();
            const data = res?.data ?? null;
            if (data) setUser(data);
            return data!;
        },
    })
}