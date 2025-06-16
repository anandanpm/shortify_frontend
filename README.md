# URL Shortener Frontend

A modern, responsive React application for URL shortening with secure authentication, built with Redux Toolkit for state management.

## 🚀 Features

- **Modern React**: Built with React 18+ and functional components
- **State Management**: Redux Toolkit for efficient state management
- **Authentication**: Secure JWT-based authentication flow
- **Responsive Design**: Mobile-first responsive design
- **Real-time Updates**: Dynamic URL management and analytics
- **Form Validation**: Client-side validation with user-friendly error messages
- **Loading States**: Smooth loading states and error handling

## 🛠 Tech Stack

- **Framework**: React 18+
- **State Management**: Redux Toolkit + React Redux
- **HTTP Client**: Axios
- **Styling**: Scss
- **Routing**: React Router DOM
- **Build Tool**: Vite/Create React App
- **Language**: JavaScript/TypeScript


## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API server running on `http://localhost:5000`

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/url-shortener-frontend.git
   cd url-shortener-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:5000/api
   REACT_APP_APP_NAME=URL Shortener
   REACT_APP_BASE_URL=http://localhost:3000
   ```

4. **Start Development Server**
   ```bash
   npm start
   ```

   The application will start on `http://localhost:3000`

## 🎯 Core Features

### Authentication Flow
- **Registration**: New user registration with email validation
- **Login**: Secure login with JWT token storage
- **Protected Routes**: Automatic redirection for unauthenticated users

### URL Management
- **URL Shortening**: Convert long URLs to short, shareable links
- **URL List**: View all user's shortened URLs
- **Click Analytics**: Track click counts and analytics
- **Copy to Clipboard**: One-click copying of shortened URLs

### State Management with Redux Toolkit

#### Auth Slice
```javascript
// Key actions handled:
- login/loginAsync
- register/registerAsync
- logout
- checkAuthStatus
```

#### URL Slice
```javascript
// Key actions handled:
- createShortUrl/createShortUrlAsync
- fetchUserUrls/fetchUserUrlsAsync
```

## 🔧 Configuration

### Axios Configuration

The app uses a configured Axios instance with:
- Base URL configuration
- Request/Response interceptors
- Automatic JWT token attachment
- Error handling middleware

### Form Components
- **LoginForm**: Email/password authentication
- **RegisterForm**: User registration with validation
- **UrlShortener**: URL input and shortening interface

## 🎨 Styling

[Describe your styling approach - CSS Modules, Styled Components, Tailwind, etc.]

- Responsive design for mobile, tablet, and desktop
- Modern UI with clean, minimalist design
- Consistent color scheme and typography
- Loading states and micro-interactions

## 🔄 State Flow

### Authentication Flow
1. User submits login/register form
2. Form data dispatched to auth slice
3. Async thunk makes API call via Axios
4. JWT token stored in localStorage
5. User redirected to dashboard
6. Protected routes check auth state

### URL Shortening Flow
1. User submits URL via form
2. URL data dispatched to url slice
3. API call creates short URL
4. New URL added to user's URL list
5. Success message displayed
6. Short URL available for copying

## 🤖 AI-Assisted Development

This project was developed with assistance from AI tools including ChatGPT and other AI coding assistants. These tools significantly enhanced:

- **Development Speed**: AI assistance helped rapidly set up Redux Toolkit store structure and React component architecture
- **Code Quality**: AI suggestions improved component reusability, state management patterns, and error handling
- **Best Practices**: AI guidance ensured adherence to React and Redux best practices
- **User Experience**: AI input helped design intuitive user flows and responsive layouts
- **Testing Strategy**: AI assistance in structuring component tests and integration tests

The use of AI tools accelerated development while maintaining modern React development standards and ensuring a polished user experience.
