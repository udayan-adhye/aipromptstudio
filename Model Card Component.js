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
      border: active ? 'border-purple-500 bg-purple