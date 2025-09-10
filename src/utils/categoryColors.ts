export const categoryColors = {
  food: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-300',
    color: '#f97316' // orange-500
  },
  outdoor: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
    color: '#22c55e' // green-500
  },
  relax: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
    color: '#3b82f6' // blue-500
  },
  entertainment: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-300',
    color: '#a855f7' // purple-500
  },
  custom: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-300',
    color: '#6b7280' // gray-500
  }
} as const;

export type Category = keyof typeof categoryColors;

export function getCategoryColor(category?: string) {
  if (!category || !(category in categoryColors)) {
    return categoryColors.custom;
  }
  return categoryColors[category as Category];
}
