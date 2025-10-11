"use client"

interface TipTapContentDisplayProps {
  content: string
  className?: string
}

export default function TipTapContentDisplay({ content, className = "" }: TipTapContentDisplayProps) {
  return (
    <div className={`tiptap-content-display ${className}`}>
      <style jsx global>{`
        .tiptap-content-display h1 {
          font-size: 2rem !important;
          font-weight: bold !important;
          line-height: 2.5rem !important;
          margin-top: 1.5rem !important;
          margin-bottom: 0.75rem !important;
          color: #111827 !important;
        }
        
        .tiptap-content-display h2 {
          font-size: 1.5rem !important;
          font-weight: bold !important;
          line-height: 2rem !important;
          margin-top: 1.25rem !important;
          margin-bottom: 0.5rem !important;
          color: #111827 !important;
        }
        
        .tiptap-content-display h3 {
          font-size: 1.25rem !important;
          font-weight: bold !important;
          line-height: 1.75rem !important;
          margin-top: 1rem !important;
          margin-bottom: 0.5rem !important;
          color: #111827 !important;
        }
        
        .tiptap-content-display p {
          margin-bottom: 0.75rem !important;
          line-height: 1.6 !important;
          color: #374151 !important;
        }
        
        .tiptap-content-display ul {
          list-style-type: disc !important;
          padding-left: 1.5rem !important;
          margin-bottom: 0.75rem !important;
        }
        
        .tiptap-content-display ol {
          list-style-type: decimal !important;
          padding-left: 1.5rem !important;
          margin-bottom: 0.75rem !important;
        }
        
        .tiptap-content-display li {
          margin-bottom: 0.25rem !important;
          line-height: 1.6 !important;
          color: #374151 !important;
        }
        
        .tiptap-content-display blockquote {
          padding-left: 1rem !important;
          margin: 1rem 0 !important;
          font-style: italic !important;
          padding-top: 0.5rem !important;
          padding-bottom: 0.5rem !important;
          border-radius: 0 0.25rem 0.25rem 0 !important;
          border-left: 4px solid #d1d5db !important;
          color: #4b5563 !important;
        }
        
        .tiptap-content-display code {
          padding: 0.125rem 0.25rem !important;
          border-radius: 0.25rem !important;
          font-family: 'Courier New', monospace !important;
          font-size: 0.875rem !important;
          color: #dc2626 !important;
          background-color: #f3f4f6 !important;
        }
        
        .tiptap-content-display pre {
          padding: 1rem !important;
          border-radius: 0.5rem !important;
          font-family: 'Courier New', monospace !important;
          margin: 1rem 0 !important;
          overflow-x: auto !important;
          background-color: #1f2937 !important;
        }
        
        .tiptap-content-display pre code {
          padding: 0 !important;
          color: #f9fafb !important;
          background-color: transparent !important;
        }
        
        .tiptap-content-display a {
          text-decoration: underline !important;
          color: #2563eb !important;
        }
        
        .tiptap-content-display a:hover {
          color: #1d4ed8 !important;
        }
        
        .tiptap-content-display strong {
          font-weight: bold !important;
        }
        
        .tiptap-content-display em {
          font-style: italic !important;
        }
        
        .tiptap-content-display u {
          text-decoration: underline !important;
        }
        
        .tiptap-content-display s {
          text-decoration: line-through !important;
        }
        
        /* Text alignment */
        .tiptap-content-display [style*="text-align: left"] {
          text-align: left !important;
        }
        
        .tiptap-content-display [style*="text-align: center"] {
          text-align: center !important;
        }
        
        .tiptap-content-display [style*="text-align: right"] {
          text-align: right !important;
        }
        
        /* Ensure proper spacing */
        .tiptap-content-display > *:first-child {
          margin-top: 0 !important;
        }
        
        .tiptap-content-display > *:last-child {
          margin-bottom: 0 !important;
        }
        
        /* Nested lists */
        .tiptap-content-display ul ul,
        .tiptap-content-display ol ol,
        .tiptap-content-display ul ol,
        .tiptap-content-display ol ul {
          margin-top: 0.25rem !important;
          margin-bottom: 0.25rem !important;
        }
        
        /* Better spacing for consecutive elements */
        .tiptap-content-display h1 + p,
        .tiptap-content-display h2 + p,
        .tiptap-content-display h3 + p {
          margin-top: 0 !important;
        }
        
        .tiptap-content-display p + h1,
        .tiptap-content-display p + h2,
        .tiptap-content-display p + h3 {
          margin-top: 2rem !important;
        }
        
        /* Dark mode styles */
        @media (prefers-color-scheme: dark) {
          .tiptap-content-display h1,
          .tiptap-content-display h2,
          .tiptap-content-display h3 {
            color: #f9fafb !important;
          }
          
          .tiptap-content-display p,
          .tiptap-content-display li {
            color: #d1d5db !important;
          }
          
          .tiptap-content-display code {
            color: #fca5a5 !important;
            background-color: #1f2937 !important;
          }
          
          .tiptap-content-display pre {
            background-color: #1f2937 !important;
          }
          
          .tiptap-content-display blockquote {
            color: #d1d5db !important;
            border-left-color: #4b5563 !important;
          }
          
          .tiptap-content-display a {
            color: #60a5fa !important;
          }
          
          .tiptap-content-display a:hover {
            color: #93c5fd !important;
          }
        }
      `}</style>

      <div dangerouslySetInnerHTML={{ __html: content }} className="leading-relaxed" />
    </div>
  )
}
