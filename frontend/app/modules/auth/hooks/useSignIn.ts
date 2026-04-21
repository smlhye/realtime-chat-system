'use client';

import { schemas } from "@/app/schemas/generated/client";
import { SignInRequest } from "@/app/schemas/generated/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { authService } from "../services/auth.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useSignIn() {
    const router = useRouter();
    const form = useForm<SignInRequest>({
        resolver: zodResolver(schemas.SignInRequest),
    })
    const signInMutation = useMutation({
        mutationFn: authService.signInApi,
        onSuccess: (res) => {
            toast.success("Đăng nhập thành công");
            form.reset();
            router.push('/')
        },
        onError: (res) => {
            toast.error(res.message);
        }
    })

    const onSubmit = form.handleSubmit(async (values) => {
        signInMutation.mutate(values);
    })

    return {
        form,
        onSubmit,
        loading: signInMutation.isPending,
    }
}