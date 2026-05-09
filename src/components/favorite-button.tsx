import { Heart } from "lucide-react";

import { toggleFavorite } from "@/lib/community/actions";
import {
  getFavoriteCountForPet,
  isFavoritedByUser,
} from "@/lib/community/queries";
import { getCurrentUser } from "@/lib/dal";

export async function FavoriteButton({ petSlug }: { petSlug: string }) {
  const [user, count] = await Promise.all([
    getCurrentUser(),
    getFavoriteCountForPet(petSlug),
  ]);
  const isFavorited = user ? await isFavoritedByUser(user.id, petSlug) : false;

  return (
    <form action={toggleFavorite}>
      <input type="hidden" name="petSlug" value={petSlug} />
      <button
        type="submit"
        aria-pressed={isFavorited}
        className={[
          "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
          isFavorited
            ? "border-[#ff4f78] bg-[#ff4f78] text-white hover:bg-[#e83d66]"
            : "border-black/10 bg-white/80 text-stone-900 hover:bg-white",
        ].join(" ")}
      >
        <Heart
          className={`size-4 ${isFavorited ? "fill-white" : ""}`}
          strokeWidth={2}
        />
        {isFavorited ? "Faved" : "Favorite"}
        <span className="text-xs opacity-80">· {count}</span>
      </button>
    </form>
  );
}
