import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <section className="rounded-[2rem] border border-white/12 bg-white/8 p-6 backdrop-blur-xl md:p-8">
        <LoadingSkeleton className="h-10 w-56 max-w-full" />
        <LoadingSkeleton className="mt-4 h-4 w-full max-w-2xl" />
        <LoadingSkeleton className="mt-4 h-12 w-44" />
      </section>

      <LoadingSkeleton className="h-36 rounded-[2rem]" />

      <div className="space-y-4">
        <LoadingSkeleton className="h-28 rounded-[2rem]" />
        <LoadingSkeleton className="h-28 rounded-[2rem]" />
        <LoadingSkeleton className="h-28 rounded-[2rem]" />
      </div>
    </div>
  );
}
