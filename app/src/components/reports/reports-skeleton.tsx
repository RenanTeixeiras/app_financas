import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

export function ReportsSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <section className="rounded-[2rem] border border-white/12 bg-white/8 p-6 backdrop-blur-xl md:p-8">
        <LoadingSkeleton className="h-5 w-28" />
        <LoadingSkeleton className="mt-4 h-10 w-72 max-w-full" />
        <LoadingSkeleton className="mt-4 h-4 w-full max-w-2xl" />
        <LoadingSkeleton className="mt-2 h-4 w-full max-w-xl" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <LoadingSkeleton className="h-36" />
          <LoadingSkeleton className="h-36" />
          <LoadingSkeleton className="h-36" />
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-white/10 bg-black/10 p-4">
        <LoadingSkeleton className="h-4 w-32" />
        <LoadingSkeleton className="mt-3 h-4 w-full max-w-2xl" />
        <div className="mt-4 flex gap-3">
          <LoadingSkeleton className="h-12 flex-1" />
          <LoadingSkeleton className="h-12 w-28" />
          <LoadingSkeleton className="h-12 w-24" />
        </div>
      </section>

      <LoadingSkeleton className="h-[26rem] rounded-[2rem]" />

      <section className="grid gap-6 xl:grid-cols-2">
        <LoadingSkeleton className="h-[26rem] rounded-[2rem]" />
        <LoadingSkeleton className="h-[26rem] rounded-[2rem]" />
      </section>
    </div>
  );
}
