"use client";
import type { ReactElement } from "react";

import { trpc } from "@repo/api/client";

export default function ApiExamplePage(): ReactElement {
  // Example: Fetch user by ID
  const { data, status, error } = trpc.user.list.useQuery();

  // Example: Create user mutation
  const createUserMutation = trpc.user.create.useMutation();

  const handleCreateUser = () => {
    createUserMutation.mutate({
      email: "test@example.com",
      role: "CUSTOMER",
    });
  };

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">tRPC API Example</h1>

      <div className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">Fetch User</h2>
        {status === "pending" && <p>Loading...</p>}
        {status === "success" && (
          <pre className="rounded bg-slate-950 p-4">{JSON.stringify(data, null, 2)}</pre>
        )}
        {status === "error" && <p>Error: {error.message}</p>}
      </div>

      <div>
        <h2 className="mb-2 text-xl font-semibold">Create User</h2>
        <button
          onClick={handleCreateUser}
          disabled={createUserMutation.isPending}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
        >
          {createUserMutation.isPending ? "Creating..." : "Create Test User"}
        </button>
        {createUserMutation.isSuccess && (
          <pre className="mt-4 rounded bg-green-100 p-4">
            {JSON.stringify(createUserMutation.data, null, 2)}
          </pre>
        )}
        {createUserMutation.isError && (
          <p className="mt-4 text-red-500">Error: {createUserMutation.error.message}</p>
        )}
      </div>
    </div>
  );
}
