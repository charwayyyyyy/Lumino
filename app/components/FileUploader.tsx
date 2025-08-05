import {useState, useCallback, useEffect} from 'react'
import {useDropzone} from 'react-dropzone'
import { formatSize, cn } from '../lib/utils'

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
    uploadProgress?: number;
}

const FileUploader = ({ onFileSelect, uploadProgress = 0 }: FileUploaderProps) => {
    const [dragCount, setDragCount] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [uploadComplete, setUploadComplete] = useState(false);
    
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;
        onFileSelect?.(file);
    }, [onFileSelect]);

    const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

    const {getRootProps, getInputProps, isDragActive, acceptedFiles, isDragAccept, isDragReject} = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf']},
        maxSize: maxFileSize,
        onDragEnter: () => setDragCount(prev => prev + 1),
        onDragLeave: () => setDragCount(prev => prev - 1)
    })
    
    // Track hover state for better drag feedback
    useEffect(() => {
        setIsHovering(dragCount > 0);
    }, [dragCount]);
    
    // Track upload completion for animation
    useEffect(() => {
        if (uploadProgress >= 100) {
            setUploadComplete(true);
            const timer = setTimeout(() => setUploadComplete(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [uploadProgress]);

    const file = acceptedFiles[0] || null;



    return (
        <div className={cn(
            "w-full transition-all duration-300",
            isHovering ? "scale-[1.02]" : "scale-100"
        )}>
            <div 
                {...getRootProps()} 
                className={cn(
                    "border-2 border-dashed rounded-2xl transition-all duration-300",
                    isDragAccept ? "border-green-400 bg-green-50/30" : 
                    isDragReject ? "border-red-400 bg-red-50/30" :
                    isHovering ? "border-blue-400 bg-blue-50/30" : 
                    "border-[var(--color-border)] bg-[var(--color-bg-secondary)]",
                    file ? "p-4" : "p-8"
                )}
            >
                <input {...getInputProps()} />

                <div className="space-y-4 cursor-pointer">
                    {file ? (
                        <div className="uploader-selected-file" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0 bg-blue-50/30 p-3 rounded-lg">
                                    <img src="/images/pdf.png" alt="pdf" className="size-10" />
                                </div>
                                <div>
                                    <p className="text-base font-medium text-[var(--color-text-primary)] truncate max-w-xs">
                                        {file.name}
                                    </p>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        {formatSize(file.size)}
                                    </p>
                                    
                                    {/* Progress bar */}
                                    {uploadProgress > 0 && uploadProgress < 100 && (
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 overflow-hidden">
                                            <div 
                                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300 ease-out"
                                                style={{ width: `${uploadProgress}%` }}
                                            ></div>
                                        </div>
                                    )}
                                    
                                    {/* Upload status text */}
                                    {uploadProgress > 0 && (
                                        <p className={cn(
                                            "text-xs mt-1 transition-all duration-300",
                                            uploadComplete ? "text-green-600" : "text-blue-600"
                                        )}>
                                            {uploadComplete ? "Upload complete!" : `Uploading... ${uploadProgress}%`}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button 
                                className="p-2 rounded-full hover:bg-[var(--color-bg-secondary)] transition-colors duration-200" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onFileSelect?.(null);
                                }}
                                aria-label="Remove file"
                            >
                                <img src="/icons/cross.svg" alt="remove" className="w-5 h-5" />
                            </button>
                        </div>
                    ): (
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                            <div className="mx-auto w-20 h-20 flex items-center justify-center mb-4 bg-blue-50/30 rounded-full p-4 animate-pulse">
                                <img src="/icons/info.svg" alt="upload" className="size-12 opacity-80" />
                            </div>
                            <p className="text-xl text-[var(--color-text-primary)] mb-2">
                                <span className="font-semibold">
                                    Click to upload
                                </span> or drag and drop
                            </p>
                            <p className="text-base text-[var(--color-text-secondary)]">PDF files only (max {formatSize(maxFileSize)})</p>
                            <div className="mt-6 bg-blue-50/30 text-blue-700 px-4 py-2 rounded-lg text-sm shadow-sm">
                                For best results, use a single-page resume
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default FileUploader
