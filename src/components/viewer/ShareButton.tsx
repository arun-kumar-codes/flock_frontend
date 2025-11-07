import { useCallback, useMemo, useState, useEffect } from "react";
import { Share2, Check, Copy, X } from "lucide-react";

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
}: any) {
  const [copied, setCopied] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const publicUrl = useMemo(() => {
    let origin =
      publicBaseUrl ||
      (typeof window !== "undefined" ? window.location.origin : "");

    // Always enforce HTTPS (except localhost)
    if (origin.startsWith("http://") && !origin.includes("localhost")) {
      origin = origin.replace("http://", "https://");
    }

    const prefixRaw = pathPrefixes[kind] ?? defaultPrefix;
    const prefix = prefixRaw.endsWith("/") ? prefixRaw : `${prefixRaw}/`;
    const slugOrId = (slug ?? String(id ?? "")).trim();

    return `${origin.replace(/\/+$/, "")}${prefix}${slugOrId}`;
  }, [publicBaseUrl, pathPrefixes, defaultPrefix, kind, slug, id]);

  useEffect(() => {
    if (!showPopup) return;
    const handleOutside = () => setShowPopup(false);
    document.addEventListener("click", handleOutside);
    return () => document.removeEventListener("click", handleOutside);
  }, [showPopup]);

  // Robust copy-to-clipboard (works on HTTP, HTTPS, localhost)
  const copyToClipboard = useCallback(
    async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          // ✅ Modern secure copy
          await navigator.clipboard.writeText(publicUrl);
        } else {
          // 🪄 Legacy fallback for HTTP / non-secure contexts
          const textarea = document.createElement("textarea");
          textarea.value = publicUrl;
          textarea.style.position = "fixed";
          textarea.style.left = "-9999px";
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }

        setCopied(true);
        onCopied?.(publicUrl);
        setTimeout(() => setCopied(false), 2000);
        return true;
      } catch (err) {
        console.warn("Clipboard copy failed:", err);
        return false;
      }
    },
    [publicUrl, onCopied]
  );

  const handleShare = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const copiedOk = await copyToClipboard();

      // Then try native share API if available
      if (navigator.share) {
        try {
          await navigator.share({
            title,
            text: summary || title,
            url: publicUrl,
          });
          return;
        } catch (err: any) {
          if (err.name !== "AbortError") {
            console.warn("Native share failed, showing popup:", err);
            setShowPopup(true);
          }
        }
      } else if (!copiedOk) {
        setShowPopup(true);
      }
    },
    [publicUrl, title, summary, copyToClipboard]
  );

  return (
    <div className="relative inline-block">
      {/* Main share button */}
      <button
        onClick={handleShare}
        className={`flex items-center gap-2 px-2 py-2 rounded-lg transition-colors cursor-pointer ${
          copied
            ? "bg-green-500 text-white"
            : "theme-bg-secondary theme-text-primary hover:opacity-80"
        } ${className}`}
        title={copied ? "Link copied!" : "Share"}
      >
        {copied ? <Check className="w-3 h-3" /> : <Share2 className="w-3 h-3" />}
        <span>{copied ? "Copied!" : "Share"}</span>
      </button>
    </div>
  );
}
