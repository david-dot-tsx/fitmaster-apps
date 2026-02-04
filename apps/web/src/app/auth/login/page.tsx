"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";

import { authLoginInputSchema, type AuthLoginInput } from "@repo/api/schemas";

import { useTRPC } from "@/lib/trpc/client";
import { LogoutButton } from "@/components/logout-button";

export default function LoginPage() {
  const trpc = useTRPC();
  const router = useRouter();
  const methods = useForm<AuthLoginInput>({
    resolver: zodResolver(authLoginInputSchema),
    defaultValues: {
      email: "admin@test.dev",
      password: "123",
    },
  });

  const {
    data: meData,
    status: meStatus,
    error: meError,
    refetch: meRefetch,
  } = useQuery(trpc.user.me.queryOptions(undefined, { enabled: false }));

  // TODO: Tanstack query: To refactor to queryfactory
  const loginMutation = useMutation({
    mutationFn: async (credentials: AuthLoginInput) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Błąd logowania");
      }

      return res.json();
    },
    onSuccess: () => {
      router.push("/dashboard");
    },
  });

  return (
    <div className="mx-auto mt-20 flex w-full max-w-md flex-col gap-4 border p-8">
      <h1 className="mb-4 text-3xl font-bold text-cyan-500">Login</h1>
      <FormProvider {...methods}>
        <form className="flex flex-col gap-4">
          <input type="email" placeholder="Email" {...methods.register("email")} />
          <input type="password" placeholder="Password" {...methods.register("password")} />
        </form>
        <button
          className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
          onClick={methods.handleSubmit((data) =>
            loginMutation.mutate({ email: data.email, password: data.password }),
          )}
        >
          Login
        </button>
        <h2>Me Data</h2>
        <button
          onClick={() => meRefetch()}
          className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
        >
          Refetch
        </button>
        <pre>{JSON.stringify(meData, null, 2)}</pre>
        <pre>{JSON.stringify(meStatus, null, 2)}</pre>
        <pre>{JSON.stringify(meError, null, 2)}</pre>
      </FormProvider>
      <LogoutButton />
      <button
        onClick={() => router.push("/auth/register")}
        className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
      >
        Go to Register
      </button>
      <button
        onClick={() => router.push("/dashboard")}
        className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
      >
        Go to Dashboard
      </button>
    </div>
  );
}
