"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import { userCreateInputSchema, type UserCreateInput } from "@repo/api/schemas";

import { useTRPC } from "@/lib/trpc/client";

export default function RegisterPage() {
  const trpc = useTRPC();
  const router = useRouter();
  const methods = useForm<UserCreateInput>({
    resolver: zodResolver(userCreateInputSchema),
    defaultValues: {
      email: "admin@test.dev",
      password: "123",
    },
  });

  const registerMutation = useMutation(
    trpc.user.create.mutationOptions({
      onSuccess: () => {
        alert("Registered!");
      },
      onError: (err) => {
        console.error(err);
        console.error(JSON.stringify(err.message, null, 2));
      },
    }),
  );

  return (
    <div className="mx-auto mt-20 flex w-full max-w-md flex-col gap-4 border p-8">
      <h1 className="mb-4 text-3xl font-bold text-cyan-500">Register</h1>
      <FormProvider {...methods}>
        <form className="flex flex-col gap-4">
          <input type="email" placeholder="Email" {...methods.register("email")} />
          <input type="password" placeholder="Password" {...methods.register("password")} />
        </form>
        <button
          className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
          onClick={methods.handleSubmit((data) =>
            registerMutation.mutate({ email: data.email, password: data.password }),
          )}
        >
          Register
        </button>
      </FormProvider>
      <button
        onClick={() => router.push("/auth/login")}
        className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
      >
        Go to Login
      </button>
    </div>
  );
}
