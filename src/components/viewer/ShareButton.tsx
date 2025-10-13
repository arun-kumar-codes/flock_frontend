import { useCallback, useMemo, useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

type ContentKind = "video" | "blog" | string;

type ShareButtonProps = {
  /** What are we sharing? */
  kind: ContentKind;
  /** Prefer slug; falls back to id */
  slug?: string;
  id?: string | number | string[];

  /** Optional: override host if admin != public site */
  publicBaseUrl?: string;

  /**
   * Map content kind -> path prefix on your PUBLIC site.
   */
  pathPrefixes?: Partial<Record<ContentKind, string>>;
  /** Default prefix when kind is not in pathPrefixes */
  defaultPrefix?: string;

  /** Optional nice share metadata */
  title?: string;
  summary?: string;

  /** Optional callback after the URL is copied */
  onCopied?: (url: string) => void;

  /** Custom class name */
  className?: string;
};

export default function ShareButton({
  kind,
  slug,
  id,
  publicBaseUrl,
  pathPrefixes = {
    video: "/viewer/video",
    blog: "/viewer/blog",
  },
  defaultPrefix = "/",
  title = "Check this out",
  summary = "",
  onCopied,
  className = "",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const publicUrl = useMemo(() => {
    const origin =
      publicBaseUrl ||
      (typeof window !== "undefined" ? window.location.origin : "");

    const prefixRaw = pathPrefixes[kind] ?? defaultPrefix;
    const prefix = prefixRaw.endsWith("/") ? prefixRaw : `${prefixRaw}/`;

    const slugOrId = (slug ?? String(id ?? "")).trim();
    return `${origin.replace(/\/+$/, "")}${prefix}${slugOrId}`;
  }, [publicBaseUrl, pathPrefixes, defaultPrefix, kind, slug, id]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
    } catch {
      // fallback for very old browsers
      const ta = document.createElement("textarea");
      ta.value = publicUrl;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand("copy");
      } finally {
        document.body.removeChild(ta);
      }
    }
    setCopied(true);
    onCopied?.(publicUrl);
    setTimeout(() => setCopied(false), 2000);
  }, [publicUrl, onCopied]);

  const handleShare = useCallback(async (e: React.MouseEvent) => {
     e.preventDefault();
     e.stopPropagation();

    // Try native share (mobile + https)
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: summary || title,
          url: publicUrl,
        });
        return;
      } catch {
        // User cancelled or error - fall through to copy
      }
    }
    // Fallback: just copy to clipboard
    await copyToClipboard();
  }, [copyToClipboard, publicUrl, summary, title]);

  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-2 px-2 py-2 rounded-lg transition-colors cursor-pointer ${
        copied
          ? "bg-green-500 text-white"
          : "theme-bg-secondary theme-text-primary hover:opacity-80"
      } ${className}`}
      title={copied ? "Link copied!" : "Share video"}
    >
      {copied ? (
        <Check className="w-3 h-3" />
      ) : (
        <Share2 className="w-3 h-3" />
      )}
      <span>{copied ? "Copied!" : "Share"}</span>
    </button>
  );
}