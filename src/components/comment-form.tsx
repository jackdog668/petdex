"use client";

import { useActionState, useEffect, useRef } from "react";

import { Send } from "lucide-react";

import { type CommentActionState, postComment } from "@/lib/community/actions";

const initialState: CommentActionState = { ok: false };

export function CommentForm({ petSlug }: { petSlug: string }) {
  const [state, action, pending] = useActionState(postComment, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={action}
      className="flex flex-col gap-2 rounded-xl border border-black/10 bg-white p-3"
    >
      <input type="hidden" name="petSlug" value={petSlug} />
      <textarea
        name="body"
        required
        maxLength={2000}
        rows={3}
        placeholder="Drop a memory, a quote, a hot take..."
        className="w-full resize-y rounded-lg border border-black/10 bg-white p-3 text-sm text-stone-900 outline-none transition focus:border-[#5266ea]"
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-stone-500">
          {state.error ? (
            <span className="text-red-600">{state.error}</span>
          ) : (
            "Be respectful. Spam gets nuked."
          )}
        </span>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#5266ea] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4053c4] disabled:opacity-60"
        >
          <Send className="size-3.5" />
          {pending ? "Posting…" : "Post"}
        </button>
      </div>
    </form>
  );
}
