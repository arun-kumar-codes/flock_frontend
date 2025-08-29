"use client"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import TiptapImage from "@tiptap/extension-image"
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  LinkIcon,
  Type,
  ImageIcon,
} from "lucide-react"
import { useRef } from "react"
import { uploadImages } from "@/api/content"
import { Attribute, mergeAttributes } from "@tiptap/core"

interface TipTapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export const extractBlobUrls = (htmlContent: string): string[] => {
  const blobUrls: string[] = []
  const imgRegex = /<img[^>]+src="(blob:[^"]+)"[^>]*>/g
  let match

  while ((match = imgRegex.exec(htmlContent)) !== null) {
    blobUrls.push(match[1])
  }

  return blobUrls
}

export const replaceBlobUrls = (htmlContent: string, urlMapping: Record<string, string>): string => {
  let updatedContent = htmlContent

  Object.entries(urlMapping).forEach(([blobUrl, finalUrl]) => {
    updatedContent = updatedContent.replace(new RegExp(blobUrl, "g"), finalUrl)
  })

  return updatedContent
}

export const uploadBlobImages = async (blobUrls: string[]): Promise<Record<string, string>> => {
  const urlMapping: Record<string, string> = {}

  for (const blobUrl of blobUrls) {
    try {
      const response = await fetch(blobUrl)
      const blob = await response.blob()

      const formData = new FormData()
      formData.append("file", blob, `image-${Date.now()}.png`)

      const uploadResponse = await uploadImages(formData)

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`)
      }

      const data = await uploadResponse.json()
      urlMapping[blobUrl] = data.url

      URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error(`Failed to upload image ${blobUrl}:`, error)
      throw error
    }
  }

  return urlMapping
}

// EnhancedImage extension that supports align and safe containment styles
const EnhancedImage = TiptapImage.extend({
  name: "image",

  addAttributes(this: { parent?: () => Record<string, Attribute> }) {

    return {

      ...(this.parent?.() || {}),
      // Alignment attribute: 'left' | 'center' | 'right' | null
      align: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          const dataAlign = element.getAttribute("data-align")
          if (dataAlign === "left" || dataAlign === "center" || dataAlign === "right") {
            return dataAlign
          }
          const f = (element.style.float || "").toLowerCase()
          if (f === "left") return "left"
          if (f === "right") return "right"
          const centered =
            element.style.display === "block" &&
            element.style.marginLeft === "auto" &&
            element.style.marginRight === "auto"
          if (centered) return "center"
          return null
        },
        renderHTML: (attributes: any) => {
          return attributes.align ? { "data-align": attributes.align } : {}
        },
      },
    }
  },
  renderHTML({ HTMLAttributes }: any) {
    const attrs: Record<string, any> = { ...HTMLAttributes }

    let style = attrs.style ? String(attrs.style) + ";" : ""
    // Always safe containment - ensure images never exceed container
    style += "max-width:100%;height:auto;object-fit:contain;box-sizing:border-box;"

    const align = attrs["data-align"]
    if (align === "left") {
      style += "float:left;margin:0 1.5rem 1rem 0;display:inline;max-width:35%;"
    } else if (align === "right") {
      style += "float:right;margin:0 0 1rem 1.5rem;display:inline;max-width:35%;"
    } else if (align === "center") {
      // Center block with auto margins
      style += "display:block;margin-left:auto;margin-right:auto;clear:both;"
    }

    attrs.style = style
    attrs.class = [attrs.class, "tiptap-image"].filter(Boolean).join(" ")

    return ["img", mergeAttributes(this.options.HTMLAttributes, attrs)]
  },
})

export default function TipTapEditor({
  content,
  onChange,
  placeholder = "Start writing...",
  className = "",
}: TipTapEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: "tiptap-heading",
          },
        },
      }),
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      EnhancedImage, // use EnhancedImage for improved image support
    ],
    immediatelyRender: false,
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "tiptap-editor-content mx-auto focus:outline-none min-h-[200px] p-4 max-w-none",
      },
    },
  })

  const isImageActive = editor?.isActive("image")
  const setImageAlign = (align: "left" | "center" | "right") => {
    editor?.chain().focus().updateAttributes("image", { align }).run()
  }

  if (!editor) return null

  return (
    <div
      ref={containerRef}
      className={`border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent ${className}`}
    >
      {/* Toolbar */}
      <div className="border-b border-slate-200 p-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 pr-2 border-r border-slate-200">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-slate-100 transition-colors ${
              editor.isActive("bold") ? "bg-slate-200 text-indigo-600" : "text-slate-600"
            }`}
            type="button"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-slate-100 transition-colors ${
              editor.isActive("italic") ? "bg-slate-200 text-indigo-600" : "text-slate-600"
            }`}
            type="button"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-slate-100 transition-colors ${
              editor.isActive("underline") ? "bg-slate-200 text-indigo-600" : "text-slate-600"
            }`}
            type="button"
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-slate-100 transition-colors ${
              editor.isActive("strike") ? "bg-slate-200 text-indigo-600" : "text-slate-600"
            }`}
            type="button"
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-2 rounded hover:bg-slate-100 transition-colors ${
              editor.isActive("code") ? "bg-slate-200 text-indigo-600" : "text-slate-600"
            }`}
            type="button"
            title="Code"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 pr-2 border-r border-slate-200">
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`p-2 rounded hover:bg-slate-100 transition-colors ${
              editor.isActive("paragraph") ? "bg-slate-200 text-indigo-600" : "text-slate-600"
            }`}
            type="button"
            title="Paragraph"
          >
            <Type className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded hover:bg-slate-100 transition-colors ${
              editor.isActive("heading", { level: 1 }) ? "bg-slate-200 text-indigo-600" : "text-slate-600"
            }`}
            type="button"
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-slate-100 transition-colors ${
              editor.isActive("heading", { level: 2 }) ? "bg-slate-200 text-indigo-600" : "text-slate-600"
            }`}
            type="button"
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded hover:bg-slate-100 transition-colors ${
              editor.isActive("heading", { level: 3 }) ? "bg-slate-200 text-indigo-600" : "text-slate-600"
            }`}
            type="button"
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 pr-2 border-r border-slate-200">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-slate-100 transition-colors ${
              editor.isActive("bulletList") ? "bg-slate-200 text-indigo-600" : "text-slate-600"
            }`}
            type="button"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-slate-100 transition-colors ${
              editor.isActive("orderedList") ? "bg-slate-200 text-indigo-600" : "text-slate-600"
            }`}
            type="button"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-slate-100 transition-colors ${
              editor.isActive("blockquote") ? "bg-slate-200 text-indigo-600" : "text-slate-600"
            }`}
            type="button"
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 pr-2 border-r border-slate-200">
          <button
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`p-2 rounded hover:bg-slate-100 transition-colors ${
              editor.isActive({ textAlign: "left" }) ? "bg-slate-200 text-indigo-600" : "text-slate-600"
            }`}
            type="button"
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`p-2 rounded hover:bg-slate-100 transition-colors ${
              editor.isActive({ textAlign: "center" }) ? "bg-slate-200 text-indigo-600" : "text-slate-600"
            }`}
            type="button"
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`p-2 rounded hover:bg-slate-100 transition-colors ${
              editor.isActive({ textAlign: "right" }) ? "bg-slate-200 text-indigo-600" : "text-slate-600"
            }`}
            type="button"
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>

        {/* Links */}
        <div className="flex items-center gap-1 pr-2 border-r border-slate-200">
          <button
            onClick={() => editor.chain().focus().toggleLink().run()}
            className={`p-2 rounded hover:bg-slate-100 transition-colors ${
              editor.isActive("link") ? "bg-slate-200 text-indigo-600" : "text-slate-600"
            }`}
            type="button"
            title="Add Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="p-2 rounded hover:bg-slate-100 transition-colors text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="p-2 rounded hover:bg-slate-100 transition-colors text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* Image Upload */}
        <div className="flex items-center gap-1 pl-2">
          <button
            type="button"
            onClick={() => document.getElementById("imageInput")?.click()}
            className="p-2 rounded hover:bg-slate-100 text-slate-600"
            title="Insert Image"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <input
            id="imageInput"
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file || !editor) return

              // Allow only PNG, JPG, JPEG, GIF, WebP
              const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"]
              if (!allowedTypes.includes(file.type)) {
                alert("Only PNG, JPG, JPEG, GIF, and WebP files are allowed.")
                e.target.value = ""
                return
              }

              // Temporary preview with blob URL
              const tempUrl = URL.createObjectURL(file)
              editor.chain().focus().setImage({ src: tempUrl }).updateAttributes("image", { align: "center" }).run()
              e.target.value = ""
            }}
          />
        </div>

        {/* Simplified image alignment controls */}
        {isImageActive && (
          <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
            <span className="text-xs text-slate-500 mr-1">Align Image</span>
            <button
              onClick={() => setImageAlign("left")}
              className={`p-2 rounded transition-colors ${
                editor.getAttributes("image")?.align === "left"
                  ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
                  : "text-slate-600 hover:bg-slate-100 border border-transparent"
              }`}
              type="button"
              title="Align image left (text wraps around right)"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setImageAlign("center")}
              className={`p-2 rounded transition-colors ${
                editor.getAttributes("image")?.align === "center"
                  ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
                  : "text-slate-600 hover:bg-slate-100 border border-transparent"
              }`}
              type="button"
              title="Center image (block display)"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => setImageAlign("right")}
              className={`p-2 rounded transition-colors ${
                editor.getAttributes("image")?.align === "right"
                  ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
                  : "text-slate-600 hover:bg-slate-100 border border-transparent"
              }`}
              type="button"
              title="Align image right (text wraps around left)"
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Editor Content */}
      <div className="min-h-[200px] overflow-hidden">
        <EditorContent editor={editor} />
        <div className="clear-both" />
      </div>

      <style jsx global>{`
        /* Updated editor container to handle floated content properly */
        .tiptap-editor-content {
          overflow: hidden;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
          font-size: 1rem;
          line-height: 1.75;
          color: #374151;
        }
        
        .tiptap-editor-content::after {
          content: "";
          display: table;
          clear: both;
        }
        
        /* More specific selectors targeting the editor content directly */
        .tiptap-editor-content h1,
        .tiptap-editor-content .tiptap-heading[data-level="1"] {
          font-size: 2.25rem !important;
          font-weight: 800 !important;
          line-height: 1.2 !important;
          margin: 1.5rem 0 1rem 0 !important;
          color: #1f2937 !important;
          display: block !important;
        }
        
        .tiptap-editor-content h2,
        .tiptap-editor-content .tiptap-heading[data-level="2"] {
          font-size: 1.875rem !important;
          font-weight: 700 !important;
          line-height: 1.3 !important;
          margin: 1.25rem 0 0.75rem 0 !important;
          color: #1f2937 !important;
          display: block !important;
        }
        
        .tiptap-editor-content h3,
        .tiptap-editor-content .tiptap-heading[data-level="3"] {
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          line-height: 1.4 !important;
          margin: 1rem 0 0.5rem 0 !important;
          color: #1f2937 !important;
          display: block !important;
        }
        
        /* Added basic paragraph and text styling */
        .tiptap-editor-content p {
          margin: 0.75rem 0;
        }
        
        .tiptap-editor-content ul,
        .tiptap-editor-content ol {
          margin: 0.75rem 0;
          padding-left: 1.5rem;
        }
        
        .tiptap-editor-content blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
        }
        
        .tiptap-editor-content code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
          font-size: 0.875em;
        }
        
        .tiptap-editor-content img {
          max-width: 100%;
          height: auto;
          object-fit: contain;
          transition: all 0.2s ease;
          border-radius: 4px;
          box-sizing: border-box;
        }
        
        /* Enhanced image selection and hover states */
        .tiptap-editor-content img:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .tiptap-editor-content img.ProseMirror-selectednode {
          outline: 2px solid #6366f1;
          outline-offset: 2px;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
        }
        
        /* Updated spacing and reduced max-width for better text alignment */
        .tiptap-editor-content img[data-align="left"] {
          float: left;
          margin: 0 1.5rem 1rem 0;
          max-width: 35%;
        }
        
        .tiptap-editor-content img[data-align="right"] {
          float: right;
          margin: 0 0 1rem 1.5rem;
          max-width: 35%;
        }
        
        .tiptap-editor-content img[data-align="center"] {
          display: block;
          margin: 1rem auto;
          clear: both;
        }
        
        /* Added responsive behavior for better mobile experience */
        @media (max-width: 768px) {
          .tiptap-editor-content img[data-align="left"],
          .tiptap-editor-content img[data-align="right"] {
            max-width: 45%;
            margin: 0.5rem;
          }
        }
        
        @media (max-width: 480px) {
          .tiptap-editor-content img[data-align="left"],
          .tiptap-editor-content img[data-align="right"] {
            float: none;
            display: block;
            margin: 1rem auto;
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

