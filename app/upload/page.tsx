'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '@/components/ui/file-upload';
import { ArrowLeft, Zap, FileText, Clock, Shield } from 'lucide-react';
import { UploadProgress } from '@/types';

export default function UploadPage() {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    await simulateUploadProcess();
  };

  const simulateUploadProcess = async () => {
    // Simulate upload process
    const stages = [
      { stage: 'uploading' as const, progress: 20, message: 'Uploading your presentation...' },
      { stage: 'parsing' as const, progress: 50, message: 'Extracting slide content...' },
      { stage: 'analyzing' as const, progress: 80, message: 'Analyzing with AI...' },
      { stage: 'complete' as const, progress: 100, message: 'Analysis complete!' }
    ];

    for (const stage of stages) {
      setUploadProgress(stage);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Redirect to results after completion
    setTimeout(() => {
      router.push('/analyze/demo-deck-123');
    }, 1000);
  };

  const features = [
    {
      icon: FileText,
      title: 'Multi-Format Support',
      description: 'Upload PDF, PPT, or PPTX files up to 10MB'
    },
    {
      icon: Clock,
      title: 'Fast Analysis',
      description: 'Get results in under 2 minutes'
    },
    {
      icon: Shield,
      title: 'Secure Processing',
      description: 'Your files are encrypted and deleted after analysis'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                PitchPerfect
              </span>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              Upload Your Pitch Deck
            </h1>
            <p className="text-xl text-muted-foreground">
              Our AI will analyze your presentation and provide actionable feedback to help you create a winning pitch.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Upload Section */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Select Your Presentation
                  </CardTitle>
                  <CardDescription>
                    Choose a PDF or PowerPoint file to get started with your analysis.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload 
                    onFileSelect={handleFileSelect}
                    progress={uploadProgress || undefined}
                    disabled={!!uploadProgress && uploadProgress.stage !== 'complete'}
                  />
                  
                  {selectedFile && !uploadProgress && (
                    <div className="mt-6 p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{selectedFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Features Sidebar */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">What You'll Get</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{feature.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">AI-Powered Analysis</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our advanced AI evaluates your pitch deck against proven frameworks from top VCs like Y Combinator and Sequoia Capital.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Content clarity and impact assessment</li>
                    <li>• Structure and flow optimization</li>
                    <li>• Visual design recommendations</li>
                    <li>• Framework compliance scoring</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}