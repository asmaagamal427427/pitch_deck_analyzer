'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2,
  Lightbulb,
  Target,
  BarChart3,
  Users,
  Zap,
  Star
} from 'lucide-react';

export default function AnalysisPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in real app this would come from API
  const analysis = {
    deckId: params.id,
    fileName: 'Startup Pitch Deck.pdf',
    overallScore: 78,
    analysisDate: new Date(),
    totalSlides: 12,
    summary: {
      strengths: [
        'Clear problem identification',
        'Strong market opportunity presentation',
        'Experienced team credentials'
      ],
      weaknesses: [
        'Business model needs clarification',
        'Financial projections lack detail',
        'Competition analysis is superficial'
      ],
      priorities: [
        'Strengthen business model slide',
        'Add detailed financial projections',
        'Enhance competition analysis'
      ]
    },
    slideAnalyses: [
      {
        slideNumber: 1,
        type: 'title',
        title: 'Company Introduction',
        scores: { clarity: 85, impact: 90, structure: 80, visual: 75, overall: 82 },
        feedback: 'Strong opening slide with clear company positioning.',
        suggestions: ['Consider adding a compelling tagline', 'Improve visual hierarchy'],
        issues: []
      },
      {
        slideNumber: 2,
        type: 'problem',
        title: 'Problem Statement',
        scores: { clarity: 90, impact: 85, structure: 88, visual: 70, overall: 83 },
        feedback: 'Excellent problem identification with supporting data.',
        suggestions: ['Add more emotional connection', 'Include customer quotes'],
        issues: []
      }
    ],
    frameworkScores: [
      {
        framework: 'yc' as const,
        score: 82,
        criteria: [
          { name: 'Clear problem identification', score: 90, feedback: 'Excellent problem definition' },
          { name: 'Unique solution approach', score: 75, feedback: 'Solution could be more differentiated' },
          { name: 'Large market opportunity', score: 85, feedback: 'Strong market sizing' }
        ]
      }
    ]
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

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
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Link href="/upload">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  New Analysis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Analysis Results</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {analysis.fileName} • {analysis.totalSlides} slides
              </p>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getScoreColor(analysis.overallScore)}`}>
                <Star className="h-4 w-4 mr-2" />
                {analysis.overallScore}/100 • {getScoreLabel(analysis.overallScore)}
              </div>
            </div>
          </div>
        </div>

        {/* Overall Score Card */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Overall Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { label: 'Clarity', value: 85, icon: CheckCircle2 },
                { label: 'Impact', value: 78, icon: Target },
                { label: 'Structure', value: 82, icon: FileText },
                { label: 'Visual', value: 67, icon: TrendingUp }
              ].map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-3">
                    <metric.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-2xl font-bold mb-1">{metric.value}%</div>
                  <div className="text-sm text-muted-foreground mb-2">{metric.label}</div>
                  <Progress value={metric.value} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="slides">Slide Analysis</TabsTrigger>
            <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Strengths */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="h-5 w-5" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.summary.strengths.map((strength, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Weaknesses */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="h-5 w-5" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.summary.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Priorities */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-blue-600">
                    <Target className="h-5 w-5" />
                    Priority Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.summary.priorities.map((priority, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                        {priority}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="slides" className="space-y-4">
            {analysis.slideAnalyses.map((slide, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Slide {slide.slideNumber}: {slide.title}
                      </CardTitle>
                      <CardDescription>
                        <Badge variant="secondary" className="mt-1">
                          {slide.type}
                        </Badge>
                      </CardDescription>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(slide.scores.overall)}`}>
                      {slide.scores.overall}/100
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Performance Metrics</h4>
                      <div className="space-y-3">
                        {Object.entries(slide.scores).filter(([key]) => key !== 'overall').map(([metric, score]) => (
                          <div key={metric} className="flex items-center justify-between">
                            <span className="text-sm capitalize">{metric}</span>
                            <div className="flex items-center gap-2">
                              <Progress value={score} className="w-20 h-2" />
                              <span className="text-sm font-medium w-10">{score}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Feedback & Suggestions</h4>
                      <p className="text-sm text-muted-foreground mb-3">{slide.feedback}</p>
                      <ul className="space-y-1">
                        {slide.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <Lightbulb className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="frameworks" className="space-y-6">
            {analysis.frameworkScores.map((framework, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Y Combinator Framework</span>
                    <Badge variant="secondary">{framework.score}/100</Badge>
                  </CardTitle>
                  <CardDescription>
                    Evaluation against Y Combinator's key criteria for successful startups
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {framework.criteria.map((criterion, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-sm mb-1">{criterion.name}</div>
                          <div className="text-xs text-muted-foreground">{criterion.feedback}</div>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <Progress value={criterion.score} className="w-20 h-2" />
                          <span className="text-sm font-medium w-10">{criterion.score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="recommendations">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Actionable Recommendations
                </CardTitle>
                <CardDescription>
                  Prioritized suggestions to improve your pitch deck's effectiveness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      priority: 'high',
                      title: 'Strengthen Business Model Clarity',
                      description: 'Add a dedicated slide explaining your revenue streams and pricing strategy.',
                      slides: [7, 8]
                    },
                    {
                      priority: 'high',
                      title: 'Enhance Financial Projections',
                      description: 'Include 3-year revenue projections with key assumptions and growth drivers.',
                      slides: [9]
                    },
                    {
                      priority: 'medium',
                      title: 'Improve Competition Analysis',
                      description: 'Create a competitive matrix showing your unique advantages.',
                      slides: [6]
                    }
                  ].map((rec, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                            {rec.priority} priority
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Slides: {rec.slides.join(', ')}
                          </span>
                        </div>
                      </div>
                      <h4 className="font-medium mb-1">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}