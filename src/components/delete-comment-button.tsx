import { deleteComment } from "@/lib/community/actions";

export function DeleteCommentButton({
  id,
  petSlug,
}: {
  id: string;
  petSlug: string;
}) {
  return (
    <form action={deleteComment} className="ml-auto">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="petSlug" value={petSlug} />
      <button
        type="submit"
        className="text-xs text-stone-500 transition hover:text-red-600"
      >
        Delete
      </button>
    </form>
  );
}
