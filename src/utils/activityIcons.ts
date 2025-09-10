import { Activity } from '../types';

// Icon mapping for different activity types and categories
export const getActivityIcon = (activity: Activity): string => {
  const title = activity.title.toLowerCase();
  const category = activity.category;

  // Specific activity icons based on title keywords
  if (title.includes('brunch') || title.includes('breakfast') || title.includes('pancake')) return '🍳';
  if (title.includes('lunch') || title.includes('dinner') || title.includes('meal')) return '🍽️';
  if (title.includes('coffee') || title.includes('tea') || title.includes('cafe')) return '☕';
  if (title.includes('pizza') || title.includes('burger') || title.includes('fast food')) return '🍕';
  if (title.includes('cooking') || title.includes('bake') || title.includes('recipe')) return '👨‍🍳';
  
  if (title.includes('hiking') || title.includes('trail') || title.includes('mountain')) return '🥾';
  if (title.includes('swim') || title.includes('pool') || title.includes('beach')) return '🏊‍♂️';
  if (title.includes('run') || title.includes('jog') || title.includes('exercise')) return '🏃‍♂️';
  if (title.includes('bike') || title.includes('cycling') || title.includes('ride')) return '🚴‍♂️';
  if (title.includes('walk') || title.includes('stroll') || title.includes('park')) return '🚶‍♂️';
  if (title.includes('gym') || title.includes('workout') || title.includes('fitness')) return '💪';
  if (title.includes('yoga') || title.includes('meditation') || title.includes('stretch')) return '🧘‍♀️';
  
  if (title.includes('movie') || title.includes('film') || title.includes('cinema')) return '🎬';
  if (title.includes('game') || title.includes('gaming') || title.includes('play')) return '🎮';
  if (title.includes('music') || title.includes('concert') || title.includes('gig')) return '🎵';
  if (title.includes('party') || title.includes('dance') || title.includes('club')) return '🎉';
  if (title.includes('show') || title.includes('theater') || title.includes('play')) return '🎭';
  if (title.includes('book') || title.includes('read') || title.includes('library')) return '📚';
  if (title.includes('art') || title.includes('museum') || title.includes('gallery')) return '🎨';
  
  if (title.includes('sleep') || title.includes('nap') || title.includes('rest')) return '😴';
  if (title.includes('spa') || title.includes('massage') || title.includes('relax')) return '🧖‍♀️';
  if (title.includes('bath') || title.includes('shower') || title.includes('self care')) return '🛁';
  if (title.includes('shop') || title.includes('buy') || title.includes('mall')) return '🛍️';
  if (title.includes('clean') || title.includes('organize') || title.includes('tidy')) return '🧹';
  if (title.includes('garden') || title.includes('plant') || title.includes('flower')) return '🌱';
  
  // Fallback to category-based icons
  switch (category) {
    case 'food':
      return '🍴';
    case 'outdoor':
      return '🌲';
    case 'entertainment':
      return '🎪';
    case 'relax':
      return '😌';
    default:
      return '⭐';
  }
};

// Enhanced category information with icons and labels
export interface CategoryInfo {
  icon: string;
  label: string;
  color: string;
  bg: string;
  text: string;
  border: string;
}

export const getCategoryInfo = (category?: Activity['category']): CategoryInfo => {
  const categoryMap: Record<string, CategoryInfo> = {
    food: {
      icon: '🍴',
      label: 'Food',
      color: '#F97316',
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      border: 'border-orange-400'
    },
    outdoor: {
      icon: '🌲',
      label: 'Outdoor',
      color: '#22C55E',
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-400'
    },
    relax: {
      icon: '😌',
      label: 'Relax',
      color: '#3B82F6',
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-400'
    },
    entertainment: {
      icon: '🎪',
      label: 'Entertainment',
      color: '#A855F7',
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      border: 'border-purple-400'
    },
    custom: {
      icon: '⭐',
      label: 'Custom',
      color: '#6B7280',
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-400'
    }
  };

  return categoryMap[category || 'custom'] || categoryMap.custom;
};

// Get activity icon with fallback
export const getActivityIconWithFallback = (activity: Activity): string => {
  const specificIcon = getActivityIcon(activity);
  if (specificIcon !== '⭐') {
    return specificIcon;
  }
  return getCategoryInfo(activity.category).icon;
};
