import React from 'react';
import { Zap, Brain, Clock, Target } from 'lucide-react';

const ModelCard = ({ type, active, onSelect }) => {
  const isGPT = type === 'gpt';
  
  const config = isGPT ? {
    icon: Zap,
    title: 'GPT Models',
    badge: '⚡ Speed',
    description: 'The "workhorses" - fast and efficient for clear tasks',
    features: [
      { icon: Clock, text: 'Fast responses' },
      { icon: Target, text: 'Need detailed instructions' }
    ],
    bestFor: 'Writing content, formatting data, following specific steps, answering questions',
    colors: {
      border: active ? 'border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-100' : 'border-gray-200 hover:border-gray-300 bg-white',
      icon: 'text-blue-600',
      badge: 'bg-blue-100 text-blue-700',
      content: 'bg-blue-100/70'
    }
  } : {
    icon: Brain,
    title: 'Reasoning Models',
    badge: '🧠 Depth',
    description: 'The "planners" - smart problem-solvers for complex tasks',
    features: [
      { icon: Brain, text: 'Deep thinking' },
      { icon: Target, text: 'Work with high-level goals' }
    ],
    bestFor: 'Complex analysis, document review, strategic planning, research, legal/financial tasks, finding patterns in data, multi-step problem solving',
    colors: {
      border: active ? 'border-purple-500 bg-purple-50/50 shadow-lg shadow-purple-100' : 'border-gray-200 hover:border-gray-300 bg-white',
      icon: 'text-purple-600',
      badge: 'bg-purple-100 text-purple-700',
      content: 'bg-purple-100/70'
    }
  };

  const { icon: Icon, title, badge, description, features, bestFor, colors } = config;

  return (
    <div 
      className={`p-5 border-2 rounded-xl cursor-pointer transition-all ${colors.border}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      aria-pressed={active}
      aria-label={`Select ${title}`}
    >
      <div className="flex items-center space-x-3 mb-3">
        <Icon className={`w-5 h-5 ${colors.icon}`} />
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors.badge}`}>
          {badge}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="text-xs text-gray-500 space-y-2 mb-4">
        {features.map(({ icon: FeatureIcon, text }, index) => (
          <div key={index} className="flex items-center space-x-2">
            <FeatureIcon className="w-3 h-3" />
            <span>{text}</span>
          </div>