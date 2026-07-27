import { getActiveAd } from "@/lib/ad-queries";
import Image from "next/image";

export default async function SidebarAd() {
  const ad = await getActiveAd("sidebar");

  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-[10px] font-sans font-bold uppercase tracking-[0.12em] text-gray-400">
        Advertisement
      </p>
      {ad ? (
        <a
          href={ad.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div className="relative w-75 h-150">
            <Image
              src={ad.imageUrl}
              alt={ad.label}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        </a>
      ) : (
        <div className="w-75 h-75 rounded bg-linear-to-b from-gray-200 to-gray-300 flex items-center justify-center">
          <span className="text-xs text-gray-400 italic text-center px-4">
            Your sidebar ad could be here
          </span>
        </div>
      )}
    </div>
  );
}
