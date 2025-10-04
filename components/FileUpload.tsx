'use client'

import { useState, useRef } from 'react'
import { Upload, X, File, Image, FileText } from 'lucide-react'

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void
  maxFiles?: number
  acceptedTypes?: string[]
}

export default function FileUpload({ 
  onFilesSelected, 
  maxFiles = 10, 
  acceptedTypes = ['image/*', '.pdf', '.doc', '.docx', '.txt'] 
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const isValidType = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type)
        }
        return file.type.match(type.replace('*', '.*'))
      })
      
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit
      return isValidType && isValidSize
    })

    if (validFiles.length > 0) {
      const newFiles = [...uploadedFiles, ...validFiles].slice(0, maxFiles)
      setUploadedFiles(newFiles)
      onFilesSelected(newFiles)
    }
  }

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
    onFilesSelected(newFiles)
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image size={16} className="text-blue-400" />
    } else if (file.type.includes('pdf')) {
      return <FileText size={16} className="text-red-400" />
    } else {
      return <File size={16} className="text-gray-400" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div
        className={`chatgpt-file-upload ${isDragOver ? 'dragover' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={32} className="mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-400">
          Drag and drop files here, or click to select
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supports images, PDFs, documents (max 10MB each)
        </p>
      </div>

      {/* File input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white">Uploaded Files:</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-[#2f2f2f] rounded-lg">
                {getFileIcon(file)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
