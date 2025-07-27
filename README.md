# Fixedness Evaluation Research Study

A React-based web application designed for conducting research studies on fixedness evaluation using AI tools (ChatGPT) and search engines. This application guides participants through a structured study flow including background surveys, pre/post-task questionnaires, and two main tasks.

## Features

- **User Authentication**: Secure login/signup system using Firebase Authentication
- **Structured Study Flow**: Sequential task completion with progress tracking
- **Dual Task Interface**: 
  - ChatGPT-based conversational task
  - Search engine task using Bing API
- **Questionnaire System**: Pre-task, post-task, and background surveys
- **Data Collection**: All responses and interactions stored in Firebase Firestore
- **Progress Tracking**: Visual indicators for completed tasks
- **Responsive Design**: Modern UI built with Tailwind CSS

## Tech Stack

- **Frontend**: React 18, React Router DOM
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage, Hosting)
- **APIs**: 
  - OpenAI API (ChatGPT integration)
  - Bing Search API
- **Build Tool**: Create React App

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 14 or higher)
- npm or yarn package manager
- A Firebase account
- OpenAI API key
- Bing Search API key

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd fixednessEvaluation
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Setup

#### 3.1 Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name and follow the setup wizard

#### 3.2 Enable Firebase Services
Enable the following services in your Firebase project:

**Authentication:**
1. Go to Authentication → Sign-in method
2. Enable "Email/Password" provider
3. Configure authorized domains if needed

**Firestore Database:**
1. Go to Firestore Database
2. Click "Create database"
3. Choose production mode or test mode based on your needs
4. Select a location for your database

**Storage:**
1. Go to Storage
2. Click "Get started"
3. Set up security rules as needed

**Hosting (Optional):**
1. Go to Hosting
2. Click "Get started"
3. Follow the setup instructions

#### 3.3 Create a Web App
1. In your Firebase project, click on the "Web" icon (</>) to add a web app
2. Register your app with a nickname
3. Copy the Firebase configuration object

### 4. Environment Configuration

#### 4.1 Create Environment File
Copy the example environment file and configure it:

```bash
cp .env.example .env
```

#### 4.2 Configure Environment Variables
Open the `.env` file and add your Firebase configuration and API keys:

```bash
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_AUTHDOMAIN=your_project_id.firebaseapp.com
REACT_APP_PROJECT_ID=your_project_id
REACT_APP_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_APP_ID=your_app_id
REACT_APP_MEASUREMENT_ID=your_measurement_id

# API Keys
REACT_APP_OPENAI_API_KEY=your_openai_api_key
REACT_APP_BING_API_KEY=your_bing_search_api_key
```

#### 4.3 Getting API Keys

**OpenAI API Key:**
1. Visit [OpenAI API](https://platform.openai.com/)
2. Sign up or log in to your account
3. Go to API keys section
4. Create a new API key

**Bing Search API Key:**
1. Visit [Microsoft Azure](https://azure.microsoft.com/)
2. Create a Bing Search resource
3. Get your API key from the resource dashboard

## Running the Application

### Development Mode

Start the development server:

```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

### Production Build

Create a production build:

```bash
npm run build
```

The build files will be created in the `build/` directory.

## Project Structure

```
src/
├── App.js                 # Main application component
├── Home.js               # Home page with study flow
├── index.js              # Application entry point
├── firebase-config.js    # Firebase configuration
├── assets/               # Static assets (icons, images)
├── bing/                 # Bing search task components
├── chat/                 # ChatGPT task components
├── common/               # Shared components (Login, Signup, etc.)
├── context/              # React context providers
├── questionnaire/        # Survey and questionnaire components
├── demography.json       # Background survey questions
├── sessionExperience.json # Session experience survey
├── tasks.json            # Task definitions
└── topology.json         # Study flow topology
```

## Study Flow

The application guides participants through the following sequence:

1. **Background Survey** - Demographic and background information
2. **First Task** (ChatGPT or Search Engine)
   - Pre-task Questionnaire
   - Main Task Execution
   - Post-task Questionnaire  
   - Session Experience Survey
3. **Second Task** (Search Engine or ChatGPT)
   - Pre-task Questionnaire
   - Main Task Execution
   - Post-task Questionnaire
   - Session Experience Survey
4. **End of Study Survey**

## How to Customize Questions, Tasks, and Topology

This section explains how to customize the study content by modifying the configuration files. These JSON files control the questions, tasks, and intention lists presented to participants throughout the study.

### 1. Background Survey Questions (`demography.json`)

**Location**: `src/demography.json`  
**Used by**: `BackgroundQuestions.js` component  
**Purpose**: Defines demographic and background questions for participant screening

**Structure**:
```json
[
  {
    "category": "Question text here",
    "options": [
      "Option 1",
      "Option 2", 
      "Option 3"
    ],
    "required": true
  }
]
```

**Customization Guidelines**:
- Questions are presented in the **exact order** they appear in the array
- Each question object must include:
  - `category`: The question text displayed to participants
  - `options`: Array of answer choices (multiple choice format)
  - `required`: Boolean indicating if the question is mandatory
- **Order matters**: Questions appear sequentially, so arrange them logically
- All responses are automatically saved to Firestore under `backgroundResponses`

**Example**:
```json
[
  {
    "category": "What is your age group?",
    "options": ["18-24", "25-34", "35-44", "45-54", "55+"],
    "required": true
  },
  {
    "category": "What is your highest education level?",
    "options": ["High School", "Bachelor's", "Master's", "PhD"],
    "required": true
  }
]
```

### 2. Session Experience Survey (`sessionExperience.json`)

**Location**: `src/sessionExperience.json`  
**Used by**: `ExperienceSurveyMain.js` component  
**Purpose**: Post-task experience evaluation questions

**Structure**:
```json
[
  {
    "key": "uniqueIdentifier",
    "question": "Question text",
    "options": ["Option 1", "Option 2"],
    "responseType": "multiple-choice" // or "open-ended"
  }
]
```

**Customization Guidelines**:
- Questions appear in **array order**
- Each question requires:
  - `key`: Unique identifier for data storage
  - `question`: The question text shown to participants
  - `options`: Array of choices (for multiple-choice questions)
  - `responseType`: Either `"multiple-choice"` or `"open-ended"`
- For open-ended questions, omit the `options` array
- Responses are stored in Firestore using the `key` as the field name

### 3. Task Definitions (`tasks.json`)

**Location**: `src/tasks.json`  
**Used by**: `TaskContext.js` for Latin Square assignment  
**Purpose**: Defines the main research tasks participants complete

**Structure**:
```json
[
  {
    "id": 1,
    "title": "Brief task title",
    "description": "Detailed task description with instructions"
  }
]
```

**Customization Guidelines**:
- Tasks are randomly assigned using **Latin Square methodology**
- Each task requires:
  - `id`: Unique numeric identifier
  - `title`: Short task name (used in UI)
  - `description`: Full task instructions shown to participants
- The system ensures participants receive different tasks to prevent order effects
- Tasks can be any research question or scenario suitable for both ChatGPT and search engine approaches

### 4. Intention Lists (`topology.json`)

**Location**: `src/topology.json`  
**Used by**: Pre-task, Post-task, and Background questionnaire components  
**Purpose**: Defines intention types and specific intentions for evaluation

**Structure**:
```json
[
  {
    "intention_type": "Category Name",
    "intention_list": [
      {
        "short_text": "Brief intention description",
        "long_text": "Detailed explanation of the intention"
      }
    ]
  }
]
```

**Customization Guidelines**:
- Intention types appear in **array order** in the questionnaire sidebar
- Each intention type contains multiple specific intentions
- Intentions within each type are presented in the order they appear
- Both `short_text` and `long_text` are displayed to participants
- Used across multiple questionnaire components for consistency

**Components that use topology.json**:
- `PreTaskQuestionnaireMain.js`: Pre-task intention evaluation
- `PostTaskQuestionnaireMain.js`: Post-task intention assessment
- `BackgroundMain.js`: Background intention familiarity

### Order and Presentation Rules

**Critical**: All configuration files present content in **strict array order**. The application does NOT randomize or reorder items, so:

1. **demography.json**: Questions appear exactly as ordered in the array
2. **sessionExperience.json**: Questions follow the array sequence
3. **tasks.json**: While individual assignment is randomized via Latin Square, maintain logical ordering
4. **topology.json**: Intention types and their sub-items appear in array order

### Data Storage Integration

Each configuration file integrates with specific Firestore collections:

- **Background questions**: Stored in `users/{uid}/backgroundResponses`
- **Session experience**: Stored in `users/{uid}/sessionExperience`
- **Task assignments**: Stored in `users/{uid}/tasks`
- **Intention ratings**: Stored in dedicated questionnaire collections

### Testing Your Customizations

1. **Validate JSON syntax** using a JSON validator
2. **Test question flow** by running through the complete study sequence
3. **Verify data storage** by checking Firestore collections
4. **Check responsive design** with different question lengths
5. **Test with multiple participants** to ensure Latin Square randomization works correctly

### Best Practices

- Keep question text concise but clear
- Ensure answer options are mutually exclusive
- Test all customizations in development before deployment
- Maintain consistent formatting across all configuration files
- Document any custom intentions or tasks for research team reference

## Code Documentation

### State Management Architecture

This application uses React Context API for global state management, organized into three main contexts that handle different aspects of the application state:

#### Context Structure

```
src/context/
├── auth-context.js        # User authentication state
├── flow-context.js        # Study flow and progress tracking
└── task-context.js        # Task-specific state and UI controls
```

### 1. AuthContext (`auth-context.js`)

**Purpose**: Manages user authentication state and user data persistence.

**Key Functionalities**:
- **User Session Management**: Handles login/logout state with localStorage persistence
- **Firebase User Integration**: Automatically syncs authenticated users with Firestore
- **User Data Storage**: Stores user information including email, display name, and creation timestamp
- **MTurk Integration**: Supports MTurk ID assignment for research participants

**State Variables**:
- `user`: Current authenticated user object
- `isLoggedIn`: Boolean indicating authentication status

**Key Methods**:
- `login(user, password)`: Authenticates user and stores session data
- `logout()`: Clears user session and removes localStorage data
- `addUserToFirestore(user, password)`: Creates/updates user document in Firestore
- `updateMTurkId(mturkId, uid)`: Associates MTurk ID with user account

### 2. FlowContext (`flow-context.js`)

**Purpose**: Manages the sequential study flow and tracks completion status of each study phase.

**Key Functionalities**:
- **Progress Tracking**: Monitors completion status of all study phases
- **Firebase Synchronization**: Automatically syncs progress state with Firestore
- **Sequential Flow Control**: Ensures participants complete tasks in correct order
- **Persistent State**: Restores user progress when returning to the application

**State Variables**:
- `demographyCompleted`: Background survey completion status
- `preTask1Completed`: First pre-task questionnaire status
- `task1Completed`: First main task completion status
- `postTask1Completed`: First post-task questionnaire status
- `sessionExperienceSurvey1Completed`: First session experience survey status
- `preTask2Completed`: Second pre-task questionnaire status
- `task2Completed`: Second main task completion status
- `postTask2Completed`: Second post-task questionnaire status
- `sessionExperienceSurvey2Completed`: Second session experience survey status
- `preTask3Completed`: Third pre-task questionnaire status
- `isEndOfStudySurveyCompleted`: End of study survey completion status
- `isLoading`: Loading state for data fetching operations

**Key Methods**:
- `updateFlowState(flowState)`: Updates specific flow state and syncs with Firestore
- Individual setter functions for each completion state (e.g., `setDemographyCompleted`)
- `updateTaskStateInFirestore(taskName, value)`: Internal method for Firestore synchronization

**Flow Control Logic**:
The context implements a sequential flow where each task depends on the completion of previous tasks, preventing participants from skipping ahead in the study.

### 3. TaskContext (`task-context.js`)

**Purpose**: Manages task-specific state, UI controls, and dynamic task assignment.

**Key Functionalities**:
- **Dynamic Task Assignment**: Uses Latin Square design for balanced task ordering
- **UI State Management**: Controls pop-ups, reminders, and interactive elements
- **Task Progress Tracking**: Monitors time remaining, query counts, and ratings
- **Note-taking System**: Manages user notes and draft saving functionality

**State Variables**:
- `tasks`: Object containing assigned task information (type, topic, description)
- `showEditNoteReminder`: Controls display of note editing reminders
- `showPopUp`: General pop-up display control
- `showSaveButton`: Note saving button visibility
- `note`: Current note content
- `showEndTaskPopUp`: End task confirmation dialog
- `isRatingNeeded`: Indicates if response rating is required
- `showRatingPopUp`: Rating interface display control
- `timeRemaining`: Task time tracking
- `queryCount`: Number of queries made during task
- `allResponsesRated`: Completion status for response ratings
- `promptIDForRating`: ID of prompt currently being rated

**Key Methods**:
- `setTasks(user)`: Assigns random tasks using Latin Square methodology
- `generateLatinSquare(tasks)`: Creates balanced task ordering matrix
- `selectRandomTask(latinSquare)`: Randomly selects tasks from Latin Square
- `getQuestionnaireText(questionnaire)`: Returns appropriate questionnaire text
- Various UI state setters for controlling interface elements

**Latin Square Implementation**:
The context implements a Latin Square design to ensure balanced task ordering across participants, preventing order effects in the research study.

### Context Integration Pattern

The three contexts work together in a hierarchical structure:

1. **AuthContext** (Top Level): Provides user authentication across the entire app
2. **FlowContext** (Middle Level): Depends on AuthContext for user data, manages study progression
3. **TaskContext** (Component Level): Uses AuthContext for user identification and manages task-specific interactions

### Usage Example

```javascript
// Component using multiple contexts
import { useContext } from 'react';
import AuthContext from './context/auth-context';
import { FlowContext } from './context/flow-context';
import TaskContext from './context/task-context';

const MyComponent = () => {
  const authCtx = useContext(AuthContext);
  const flowCtx = useContext(FlowContext);
  const taskCtx = useContext(TaskContext);

  // Access user data
  const user = authCtx.user;
  
  // Check task completion status
  const canProceed = flowCtx.preTask1Completed;
  
  // Get current task information
  const currentTask = taskCtx.tasks.firstTask;
  
  return (
    // Component JSX
  );
};
```

### Data Persistence Strategy

- **Local Storage**: Used for user session persistence (AuthContext)
- **Firestore Database**: Primary storage for all user progress and responses
- **Real-time Sync**: State changes automatically sync with Firebase
- **Offline Resilience**: Local state maintained during network interruptions

This architecture ensures reliable state management, proper study flow control, and comprehensive data collection for research purposes.

## Firebase Security Rules

Make sure to configure appropriate security rules for Firestore and Storage based on your study requirements.

## Deployment

### Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init
```

4. Build and deploy:
```bash
npm run build
firebase deploy
```

## Support

For support or questions regarding this research study application, please contact the research team or create an issue in the repository.
