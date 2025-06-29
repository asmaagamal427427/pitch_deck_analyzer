// Application constants and configuration

export const FILE_UPLOAD_LIMITS = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  allowedExtensions: ['.pdf', '.ppt', '.pptx']
};

export const SLIDE_TYPE_MAPPING = {
  title: { name: 'Title Slide', color: '#8B5CF6', icon: 'Presentation' },
  problem: { name: 'Problem Statement', color: '#EF4444', icon: 'AlertTriangle' },
  solution: { name: 'Solution', color: '#10B981', icon: 'Lightbulb' },
  market: { name: 'Market Opportunity', color: '#3B82F6', icon: 'TrendingUp' },
  'business-model': { name: 'Business Model', color: '#F59E0B', icon: 'DollarSign' },
  traction: { name: 'Traction', color: '#06B6D4', icon: 'BarChart3' },
  team: { name: 'Team', color: '#8B5CF6', icon: 'Users' },
  financials: { name: 'Financials', color: '#10B981', icon: 'Calculator' },
  funding: { name: 'Funding Ask', color: '#F59E0B', icon: 'Target' },
  competition: { name: 'Competition', color: '#EF4444', icon: 'Sword' },
  other: { name: 'Other', color: '#6B7280', icon: 'FileText' }
};

export const ANALYSIS_CRITERIA = {
  clarity: {
    name: 'Clarity',
    description: 'How clear and understandable is the content?',
    weight: 0.25
  },
  impact: {
    name: 'Impact',
    description: 'How compelling and impactful is the message?',
    weight: 0.3
  },
  structure: {
    name: 'Structure',
    description: 'How well organized and logical is the flow?',
    weight: 0.25
  },
  visual: {
    name: 'Visual Design',
    description: 'How effective is the visual presentation?',
    weight: 0.2
  }
};

export const FRAMEWORKS = {
  yc: {
    name: 'Y Combinator',
    criteria: [
      'Clear problem identification',
      'Unique solution approach',
      'Large market opportunity',
      'Strong founding team',
      'Traction evidence',
      'Business model clarity'
    ]
  },
  sequoia: {
    name: 'Sequoia Capital',
    criteria: [
      'Company purpose',
      'Problem definition',
      'Solution uniqueness',
      'Market timing',
      'Business model',
      'Competition analysis',
      'Team credentials',
      'Financials'
    ]
  },
  general: {
    name: 'General Best Practices',
    criteria: [
      'Story flow',
      'Visual consistency',
      'Data presentation',
      'Call to action',
      'Slide count optimization'
    ]
  }
};