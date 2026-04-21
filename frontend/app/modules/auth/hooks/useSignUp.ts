'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { authService } from "../services/auth.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SignUpRequest, SignUpRequestType } from "../schemas/sign-up-request.schema";

export function useSignUp() {
    const router = useRouter();
    const form = useForm<SignUpRequestType>({
        resolver: zodResolver(SignUpRequest),
    })
    const signUpMutation = useMutation({
        mutationFn: authService.signUpApi,
        onSuccess: (res) => {
            toast.success("Đăng ký thành công");
            form.reset();
            router.push('/sign-in')
        },
        onError: (res) => {
            toast.error(res.message);
        }
    })
    const onSubmit = form.handleSubmit(async (values) => {
        const { confirmPassword, ...payload } = values;
        signUpMutation.mutate(payload);
    });

    return {
        form,
        onSubmit,
        loading: signUpMutation.isPending,
    }
}