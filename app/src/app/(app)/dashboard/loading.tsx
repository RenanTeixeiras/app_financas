import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <section className="rounded-[2rem] border border-white/12 bg-white/8 p-6 backdrop-blur-xl md:p-8">
        <LoadingSkeleton className="h-5 w-24" />
        <LoadingSkeleton className="mt-4 h-10 w-80 max-w-full" />
        <LoadingSkeleton className="mt-4 h-4 w-full max-w-2xl" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <LoadingSkeleton className="h-36" />
          <LoadingSkeleton className="h-36" />
          <LoadingSkeleton className="h-36" />
        </div>
      </section>

      <LoadingSkeleton className="h-28 rounded-[1.5rem]" />

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <LoadingSkeleton className="h-[32rem] rounded-[2rem]" />
        <div className="space-y-6">
          <LoadingSkeleton className="h-[15rem] rounded-[2rem]" />
          <LoadingSkeleton className="h-[15rem] rounded-[2rem]" />
        </div>
      </section>
    </div>
  );
}
