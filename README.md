# 🎉 Weekendly

> **A delightful weekend planner that helps you make the most of your free time**

Weekendly is a modern, interactive web application designed to transform how you plan your weekends. Whether you're looking for a relaxing staycation or an adventurous getaway, Weekendly helps you organize activities, track moods, and create memorable weekend experiences.

## ✨ Features

- **📋 Activity Browser** - Browse and choose from a curated collection of weekend activities
- **📅 Weekend Scheduling** - Add activities to your Saturday and Sunday schedule with intuitive time slots
- **✏️ Activity Management** - Edit, remove, and customize activities to fit your preferences
- **👀 Visual Planning** - View your weekend plan in an engaging, timeline-based interface
- **🎨 Mood Tracking** - Associate moods with activities to understand your weekend vibes
- **🖱️ Drag-and-Drop Interface** - Intuitive drag-and-drop for seamless activity scheduling
- **🎨 Visual Richness** - Beautiful icons, colors, and images for each activity category
- **🎭 Theme Personalization** - Choose from multiple themes (Default, Lazy, Adventurous)
- **📤 Share & Export** - Export your weekend plan as an image to share with friends
- **🔗 Smart Integrations** - Mock hooks for future integrations with events and places
- **📅 Long Weekends** - Support for Friday-Monday weekends and custom day configurations
- **🎊 Holiday Awareness** - Automatically suggests upcoming long weekends based on holidays
- **💾 Persistence** - Automatic saving with localStorage for seamless user experience
- **⚡ Performance Optimizations** - Virtualized lists and efficient search/filter capabilities
- **📱 Offline Support** - PWA capabilities with service worker and manifest.json
- **🧪 Automated Testing** - Comprehensive test suite with Vitest and React Testing Library
- **🎨 Design System** - Reusable components (Button, Card, Modal, etc.) for consistency

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: TailwindCSS with custom theme support
- **State Management**: React Context + useReducer
- **Drag & Drop**: @dnd-kit/core for smooth interactions
- **Testing**: Vitest + React Testing Library + jsdom
- **Build Tool**: Vite for fast development and building
- **Export**: html2canvas for image generation
- **Deployment**: 

## 📁 Project Structure

```
wknd-plnr/
├── src/
│   ├── components/           # React components
│   │   ├── ActivityBrowser.tsx      # Activity selection interface
│   │   ├── ActivityCard.tsx         # Individual activity display
│   │   ├── ScheduleView.tsx         # Main schedule interface
│   │   ├── HolidayBanner.tsx        # Holiday suggestion banner
│   │   ├── ThemeSelector.tsx        # Theme switching
│   │   ├── ExportButton.tsx         # Plan export functionality
│   │   └── WeekendTypeSelector.tsx  # Weekend type configuration
│   ├── state/                # State management
│   │   ├── WeekendContext.tsx       # React context provider
│   │   └── reducer.ts               # State reducer logic
│   ├── hooks/                # Custom React hooks
│   │   └── usePersist.ts            # localStorage persistence
│   ├── utils/                # Utility functions
│   │   ├── holidays.ts              # Holiday detection logic
│   │   ├── activityIcons.ts         # Icon management
│   │   ├── categoryColors.ts        # Color theming
│   │   └── weekendTypes.ts          # Weekend type utilities
│   ├── test/                 # Testing utilities
│   │   ├── setup.ts                 # Test configuration
│   │   └── test-utils.tsx           # Custom test helpers
│   ├── App.tsx               # Main application component
│   ├── main.tsx              # Application entry point
│   ├── types.ts              # TypeScript type definitions
│   └── themes.css            # Theme-specific styles
├── .github/workflows/        # CI/CD configuration
├── package.json              # Dependencies and scripts
├── vite.config.ts            # Vite configuration
├── vitest.config.ts          # Test configuration
└── tailwind.config.cjs       # TailwindCSS configuration
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/weekendly.git
   cd weekendly/wknd-plnr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

4. **Run tests**
   ```bash
   npm test              # Run tests in watch mode
   npm run test:run      # Run tests once
   npm run test:ui       # Run tests with UI
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 🎨 Design Decisions

### Architecture
- **Component-Based Design** - Modular, reusable components for maintainability
- **Context + Reducer Pattern** - Predictable state management without external libraries
- **Custom Hooks** - Encapsulated logic for persistence and state management

### Accessibility
- **Semantic HTML** - Proper use of HTML elements for screen readers
- **ARIA Labels** - Comprehensive accessibility attributes
- **Keyboard Navigation** - Full keyboard support for all interactions
- **Color Contrast** - WCAG compliant color schemes

### Performance
- **React.memo** - Component memoization to prevent unnecessary re-renders
- **Efficient State Updates** - Immutable state updates with proper reducer patterns
- **Lazy Loading** - Components loaded on demand
- **Optimized Bundles** - Vite's tree-shaking and code splitting

### User Experience
- **Persistence** - Automatic saving ensures no data loss
- **Responsive Design** - Works seamlessly across desktop, tablet, and mobile
- **Visual Feedback** - Loading states, animations, and hover effects
- **Error Handling** - Graceful error handling with user-friendly messages

## 🌐 Deployment

The application is ready for deployment on modern hosting platforms:

- **Vercel** (Recommended)
- **Netlify**
- **GitHub Pages**
- **Any static hosting service**

### Deployment Steps
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Configure environment variables if needed

> **Live Demo**: The app will be deployed at 

## 🎬 Demo Video

> 

## 🧪 Testing

Weekendly includes a comprehensive testing suite:

- **Unit Tests** - State management, utilities, and business logic
- **Component Tests** - React component behavior and user interactions
- **Integration Tests** - End-to-end application functionality
- **Snapshot Tests** - UI consistency and regression prevention

### Test Coverage
- ✅ State management (reducer, context)
- ✅ Holiday detection and suggestions
- ✅ Activity management (CRUD operations)
- ✅ Drag and drop functionality
- ✅ Persistence and data migration
- ✅ Component rendering and interactions
- ✅ Error handling and edge cases

**Made with ❤️ for better weekends**

*Start planning your perfect weekend today!* 🎉
