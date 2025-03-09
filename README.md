# Task Tracker App

A simple task tracking application built with React, TypeScript, and Vite.

## Overview

The Task Tracker app is designed to help users organize their tasks efficiently. It features:

- Task creation, editing, and deletion
- Priority levels for tasks (High, Medium, Low)
- Drag-and-drop reordering of tasks
- Light and dark theme support
- Search and filter functionality
- Secure local storage for task persistence

## Running the Application Locally

### Prerequisites

- Node.js (v22 or higher) 
- npm or yarn

### Installation

1. Clone the repository to your local machine
```bash
git clone git@github.com:Nancy4321/task-tracker.git
cd task-tracker
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Code Structure and State Management

### Project Structure

The codebase follows a modular structure:

- `/src/components` - Reusable UI components
- `/src/contexts` - React Context providers for state management
- `/src/utils` - Utility functions and type definitions
- `/src/assets` - Static assets like images

### Imports

The project uses absolute imports with the `@/` prefix to improve code readability and maintainability. For example:

```typescript
import { TaskList } from '@/components/TaskList';
import { useTaskContext } from '@/contexts/TaskContext';
```

### State Management

State management is implemented using React Context API through the TaskContext provider. This approach:

- Centralizes task-related state and operations
- Avoids passing props through multiple levels of nested components
- Provides a clean interface for task operations (add, edit, delete, reorder)
- Uses encrypted local storage (via [secure-ls](https://github.com/softvar/secure-ls)) to persist data between sessions

Each task has properties including:
- Unique ID
- Title
- Description
- Priority
- Creation timestamp
- Order (for drag-and-drop functionality)

The app also manages UI state like theme locally in components using React's useState hook where appropriate.

## Additional Features

- Responsive design for mobile and desktop
- Drag and drop functionality for task reordering
- Theme switching (light/dark mode)
- Search and filter capabilities
- Minimalistic UI with animations
