import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <section className="rounded-[2rem] border border-white/12 bg-white/8 p-6 backdrop-blur-xl md:p-8">
        <LoadingSkeleton className="h-10 w-52 max-w-full" />
        <LoadingSkeleton className="mt-4 h-4 w-full max-w-2xl" />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <LoadingSkeleton className="h-[22rem] rounded-[2rem]" />
        <LoadingSkeleton className="h-[22rem] rounded-[2rem]" />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <LoadingSkeleton className="h-[28rem] rounded-[2rem]" />
        <LoadingSkeleton className="h-[28rem] rounded-[2rem]" />
      </section>
    </div>
  );
}
