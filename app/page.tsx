'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Brain, 
  FileText, 
  TrendingUp, 
  CheckCircle, 
  Zap,
  Target,
  Users,
  BarChart3,
  ArrowRight,
  Star
} from 'lucide-react';

export default function HomePage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced AI evaluates your pitch deck against proven frameworks and best practices.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      icon: Target,
      title: 'Framework Compliance',
      description: 'Check alignment with Y Combinator, Sequoia Capital, and other top VC standards.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: FileText,
      title: 'Detailed Feedback',
      description: 'Get specific, actionable recommendations for every slide in your presentation.',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20'
    },
    {
      icon: BarChart3,
      title: 'Performance Scoring',
      description: 'Comprehensive scoring across clarity, impact, structure, and visual design.',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  const benefits = [
    'Increase investor engagement by 40%',
    'Reduce pitch preparation time by 60%',
    'Get feedback from top VC frameworks',
    'Professional export options'
  ];

  const stats = [
    { label: 'Pitch Decks Analyzed', value: '2,500+' },
    { label: 'Success Rate Improvement', value: '40%' },
    { label: 'Average Score Increase', value: '+25pts' },
    { label: 'Time Saved', value: '60%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                PitchPerfect
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                How it Works
              </Link>
              <Link href="#pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Pricing
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
              <Star className="h-3 w-3 mr-1" />
              AI-Powered Pitch Deck Analysis
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-purple-800 to-blue-800 bg-clip-text text-transparent dark:from-white dark:via-purple-200 dark:to-blue-200">
              Perfect Your Pitch Deck with AI
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Get instant, expert-level feedback on your startup pitch deck. 
              Our AI analyzes your presentation against proven VC frameworks and provides actionable recommendations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/upload">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  <Upload className="h-5 w-5 mr-2" />
                  Analyze Your Deck
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-2">
                View Sample Analysis
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16 pt-8 border-t">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything You Need to Create a Winning Pitch
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive analysis covers every aspect of your pitch deck, from content structure to visual design.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <CardHeader className="text-center pb-2">
                  <div className={`
                    h-12 w-12 rounded-lg mx-auto mb-4 flex items-center justify-center transition-all duration-200
                    ${feature.bgColor}
                    ${hoveredFeature === index ? 'scale-110' : ''}
                  `}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Benefits List */}
          <Card className="max-w-2xl mx-auto border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Why Choose PitchPerfect?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Get professional feedback on your pitch deck in just three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                title: 'Upload Your Deck',
                description: 'Simply drag and drop your PDF or PowerPoint presentation.',
                icon: Upload,
                color: 'purple'
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Our AI analyzes your content against proven VC frameworks.',
                icon: Brain,
                color: 'blue'
              },
              {
                step: '03',
                title: 'Get Feedback',
                description: 'Receive detailed recommendations and export your improved deck.',
                icon: FileText,
                color: 'emerald'
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className={`
                  h-16 w-16 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold text-white
                  ${step.color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-purple-600' : ''}
                  ${step.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : ''}
                  ${step.color === 'emerald' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : ''}
                `}>
                  {step.step}
                </div>
                <step.icon className={`h-8 w-8 mx-auto mb-4 ${
                  step.color === 'purple' ? 'text-purple-500' : 
                  step.color === 'blue' ? 'text-blue-500' : 
                  'text-emerald-500'
                }`} />
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Ready to Perfect Your Pitch?
            </h2>
            <p className="text-xl text-purple-100">
              Join thousands of entrepreneurs who have improved their pitch decks with our AI-powered analysis.
            </p>
            <Link href="/upload">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-200">
                <Upload className="h-5 w-5 mr-2" />
                Start Your Analysis
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">PitchPerfect</span>
            </div>
            <div className="text-sm text-slate-400">
              © 2025 PitchPerfect. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}