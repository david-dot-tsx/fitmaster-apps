import { Spinner } from "@/components/ui/spinner";

export default function GlobalLoading() {
  return (
    <div className="mx-auto flex w-full flex-col items-center justify-center">
      <Spinner className="size-8" />
    </div>
  );
}
