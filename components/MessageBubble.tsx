'use client'

import { useState } from 'react'
import { 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  RotateCcw, 
  Edit3, 
  Check,
  User,
  Bot
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date | string
  files?: File[]
  isStreaming?: boolean
}

interface MessageBubbleProps {
  message: Message
  onCopy?: () => void
  onRegenerate?: () => void
  onEdit?: () => void
  isLast?: boolean
}

export default function MessageBubble({ 
  message, 
  onCopy, 
  onRegenerate, 
  onEdit, 
  isLast 
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)

  const handleCopy = async () => {
    if (onCopy) {
      onCopy()
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleLike = () => {
    setLiked(!liked)
    if (disliked) setDisliked(false)
  }

  const handleDislike = () => {
    setDisliked(!disliked)
    if (liked) setLiked(false)
  }

  const formatTime = (date: Date | string | undefined) => {
    if (!date) return 'Just now'
    
    const dateObj = date instanceof Date ? date : new Date(date)
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Just now'
    }
    
    return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={`chatgpt-message ${
      message.role === 'user' ? 'chatgpt-message-user' : 'chatgpt-message-assistant'
    }`}>
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className={`chatgpt-avatar ${
          message.role === 'user' ? 'chatgpt-avatar-user' : 'chatgpt-avatar-assistant'
        }`}>
          {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
        </div>

        {/* Content */}
        <div className="chatgpt-content flex-1">
          {/* User message */}
          {message.role === 'user' ? (
            <div className="space-y-2">
              <div className="text-white whitespace-pre-wrap">
                {message.content}
              </div>
              
              {/* Files */}
              {message.files && message.files.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {message.files.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 bg-[#2f2f2f] px-3 py-2 rounded-lg">
                      <span className="text-sm text-white">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{formatTime(message.createdAt)}</span>
                {onEdit && (
                  <button
                    onClick={onEdit}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <Edit3 size={12} />
                    Edit
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Assistant message */
            <div className="space-y-2">
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '')
                      const inline = props.inline
                      return !inline && match ? (
                        <SyntaxHighlighter
                          language={match[1]}
                          PreTag="div"
                          className="rounded-lg bg-[#1e1e1e] text-gray-100"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className="bg-[#2f2f2f] px-1 py-0.5 rounded text-sm" {...props}>
                          {children}
                        </code>
                      )
                    },
                    p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="text-white">{children}</li>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-[#4a4a4a] pl-4 my-4 italic text-gray-300">
                        {children}
                      </blockquote>
                    ),
                    h1: ({ children }) => <h1 className="text-2xl font-bold text-white mb-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-bold text-white mb-3">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-bold text-white mb-2">{children}</h3>,
                    strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                    em: ({ children }) => <em className="italic text-gray-300">{children}</em>,
                    a: ({ children, href }) => (
                      <a href={href} className="text-[#10a37f] hover:underline" target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-4">
                        <table className="min-w-full border-collapse border border-[#4a4a4a]">
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="border border-[#4a4a4a] px-4 py-2 bg-[#2f2f2f] text-white font-semibold text-left">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-[#4a4a4a] px-4 py-2 text-white">
                        {children}
                      </td>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-[#2f2f2f] rounded transition-colors"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                    liked 
                      ? 'text-green-400 bg-green-400/10' 
                      : 'text-gray-400 hover:text-white hover:bg-[#2f2f2f]'
                  }`}
                >
                  <ThumbsUp size={12} />
                </button>
                
                <button
                  onClick={handleDislike}
                  className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                    disliked 
                      ? 'text-red-400 bg-red-400/10' 
                      : 'text-gray-400 hover:text-white hover:bg-[#2f2f2f]'
                  }`}
                >
                  <ThumbsDown size={12} />
                </button>

                {onRegenerate && isLast && (
                  <button
                    onClick={onRegenerate}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-[#2f2f2f] rounded transition-colors"
                  >
                    <RotateCcw size={12} />
                    Regenerate
                  </button>
                )}
              </div>

              <div className="text-xs text-gray-500">
                {formatTime(message.createdAt)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
