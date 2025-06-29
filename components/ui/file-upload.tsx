'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FILE_UPLOAD_LIMITS } from '@/lib/constants';
import { UploadProgress } from '@/types';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  progress?: UploadProgress;
  disabled?: boolean;
}

export function FileUpload({ onFileSelect, progress, disabled }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      console.error('File rejected:', error.message);
      return;
    }

    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
    },
    maxSize: FILE_UPLOAD_LIMITS.maxSize,
    multiple: false,
    disabled
  });

  const getProgressColor = () => {
    switch (progress?.stage) {
      case 'error': return 'bg-destructive';
      case 'complete': return 'bg-emerald-500';
      default: return 'bg-primary';
    }
  };

  const getProgressMessage = () => {
    if (!progress) return '';
    
    switch (progress.stage) {
      case 'uploading': return 'Uploading your presentation...';
      case 'parsing': return 'Extracting slide content...';
      case 'analyzing': return 'Analyzing with AI...';
      case 'complete': return 'Analysis complete!';
      case 'error': return progress.error || 'An error occurred';
      default: return progress.message;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragActive || dragActive 
            ? 'border-primary bg-primary/5 scale-105' 
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-4">
          {progress?.stage === 'complete' ? (
            <CheckCircle className="h-12 w-12 text-emerald-500" />
          ) : progress?.stage === 'error' ? (
            <AlertCircle className="h-12 w-12 text-destructive" />
          ) : (
            <Upload className={`h-12 w-12 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
          )}
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {isDragActive ? 'Drop your presentation here' : 'Upload Your Pitch Deck'}
            </h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop your PDF or PowerPoint file, or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supports PDF, PPT, PPTX • Max 10MB
            </p>
          </div>

          {!isDragActive && !progress && (
            <Button variant="outline" size="sm" className="mt-2">
              <FileText className="h-4 w-4 mr-2" />
              Choose File
            </Button>
          )}
        </div>

        {progress && (
          <div className="mt-6 space-y-3">
            <Progress 
              value={progress.progress} 
              className="h-2"
            />
            <div className="flex items-center justify-center gap-2">
              <p className="text-sm font-medium">{getProgressMessage()}</p>
              <span className="text-xs text-muted-foreground">
                {Math.round(progress.progress)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {progress?.stage === 'error' && progress.error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{progress.error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}