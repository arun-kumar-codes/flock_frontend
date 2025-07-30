"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
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
} from "lucide-react"
import { useCallback, useEffect } from "react"

interface TipTapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export default function TipTapEditor({
  content,
  onChange,
  placeholder = "Start writing...",
  className = "",
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        listItem: {
        },
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right"],
      }),
      Underline,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4 max-w-none",
      },
    },
    immediatelyRender: false,
  })

  useEffect(() => {
    if (!editor || editor.isDestroyed) return
    const currentHTML = editor.getHTML()
    if (content !== currentHTML) {
      editor.commands.setContent(content, { emitUpdate: false })
    }
  }, [content, editor])

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes("link").href
    const url = window.prompt("Enter URL:", previousUrl)

    if (url === null) return
    if (!editor || editor.isDestroyed) return

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }, [editor])

  if (!editor) return null

  return (
    <div
      className={`border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent ${className}`}
    >
      {/* Add custom styles */}
      <style jsx global>{`
        .ProseMirror {
          outline: none;
        }
        
        .ProseMirror h1 {
          font-size: 2rem !important;
          font-weight: bold !important;
          line-height: 2.5rem !important;
          margin-top: 1.5rem !important;
          margin-bottom: 0.75rem !important;
        }
        
        .ProseMirror h2 {
          font-size: 1.5rem !important;
          font-weight: bold !important;
          line-height: 2rem !important;
          margin-top: 1.25rem !important;
          margin-bottom: 0.5rem !important;
        }
        
        .ProseMirror h3 {
          font-size: 1.25rem !important;
          font-weight: bold !important;
          line-height: 1.75rem !important;
          margin-top: 1rem !important;
          margin-bottom: 0.5rem !important;
        }
        
        .ProseMirror p {
          margin-bottom: 0.75rem !important;
          line-height: 1.6 !important;
        }
        
        .ProseMirror ul {
          list-style-type: disc !important;
          padding-left: 1.5rem !important;
          margin-bottom: 0.75rem !important;
        }
        
        .ProseMirror ol {
          list-style-type: decimal !important;
          padding-left: 1.5rem !important;
          margin-bottom: 0.75rem !important;
        }
        
        .ProseMirror li {
          margin-bottom: 0.25rem !important;
          line-height: 1.6 !important;
        }
        
        .ProseMirror blockquote {
          border-left: 4px solid #e5e7eb !important;
          padding-left: 1rem !important;
          margin: 1rem 0 !important;
          font-style: italic !important;
          color: #6b7280 !important;
        }
        
        .ProseMirror code {
          background-color: #f3f4f6 !important;
          padding: 0.125rem 0.25rem !important;
          border-radius: 0.25rem !important;
          font-family: 'Courier New', monospace !important;
          font-size: 0.875rem !important;
        }
        
        .ProseMirror pre {
          background-color: #1f2937 !important;
          color: #f9fafb !important;
          padding: 1rem !important;
          border-radius: 0.5rem !important;
          font-family: 'Courier New', monospace !important;
          margin: 1rem 0 !important;
          overflow-x: auto !important;
        }
        
        .ProseMirror a {
          color: #3b82f6 !important;
          text-decoration: underline !important;
        }
        
        .ProseMirror a:hover {
          color: #1d4ed8 !important;
        }
        
        .ProseMirror strong {
          font-weight: bold !important;
        }
        
        .ProseMirror em {
          font-style: italic !important;
        }
        
        .ProseMirror u {
          text-decoration: underline !important;
        }
        
        .ProseMirror s {
          text-decoration: line-through !important;
        }
        
        /* Text alignment */
        .ProseMirror [style*="text-align: left"] {
          text-align: left !important;
        }
        
        .ProseMirror [style*="text-align: center"] {
          text-align: center !important;
        }
        
        .ProseMirror [style*="text-align: right"] {
          text-align: right !important;
        }
        
        /* Placeholder */
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
        
        /* Remove default prose styles that might conflict */
        .ProseMirror.prose ul {
          list-style-type: disc !important;
        }
        
        .ProseMirror.prose ol {
          list-style-type: decimal !important;
        }
        
        .ProseMirror.prose li {
          margin-top: 0 !important;
          margin-bottom: 0.25rem !important;
        }
        
        .ProseMirror.prose h1,
        .ProseMirror.prose h2,
        .ProseMirror.prose h3 {
          margin-top: 1rem !important;
        }
      `}</style>

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
            onClick={setLink}
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
      </div>

      {/* Editor Content */}
      <div className="min-h-[200px]">
        <EditorContent editor={editor} />
      </div>

      {/* Debug info - remove this in production */}
      {process.env.NODE_ENV === "development" && (
        <div className="text-xs text-gray-500 p-2 border-t">
          Active: {editor.isActive("heading", { level: 1 }) ? "H1 " : ""}
          {editor.isActive("heading", { level: 2 }) ? "H2 " : ""}
          {editor.isActive("heading", { level: 3 }) ? "H3 " : ""}
          {editor.isActive("bulletList") ? "UL " : ""}
          {editor.isActive("orderedList") ? "OL " : ""}
          {editor.isActive("bold") ? "Bold " : ""}
        </div>
      )}
    </div>
  )
}
