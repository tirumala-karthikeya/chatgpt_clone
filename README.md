# Galaxy.ai ChatGPT Clone

A pixel-perfect, fully functional ChatGPT replica built with Next.js, TypeScript, and the Vercel AI SDK. This project demonstrates engineering excellence with advanced capabilities including chat memory, file uploads, message editing, and seamless AI integration.

## 🚀 Features

### Core Functionality
- **Pixel-perfect ChatGPT UI/UX** - Exact replication of ChatGPT's interface
- **Real-time Chat** - Powered by Vercel AI SDK with streaming responses
- **Chat Memory** - Persistent conversation context using Mem0
- **File & Image Upload** - Support for PNG, JPG, PDF, DOCX, TXT files
- **Message Editing** - Edit messages with seamless regeneration
- **Long-context Handling** - Smart token management for extended conversations
- **Message Streaming** - Real-time response streaming with graceful UI updates
- **Webhook Support** - External service integration capabilities

### Technical Features
- **Authentication** - Secure user management with Clerk
- **Database** - MongoDB with optimized schemas
- **File Storage** - Cloudinary integration for secure file management
- **Responsive Design** - Mobile-first approach matching ChatGPT
- **Accessibility** - ARIA-compliant interface
- **Performance** - Optimized for speed and scalability

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS + ShadCN
- **UI/UX**: v0.dev generated components
- **Authentication**: Clerk
- **Database**: MongoDB with Mongoose
- **AI Integration**: Vercel AI SDK
- **File Storage**: Cloudinary + Uploadcare
- **Memory**: Mem0
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB database
- Clerk account for authentication
- OpenAI API key
- Cloudinary account
- Mem0 account (optional)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd galaxy-ai-chatgpt-clone
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file:

```bash
cp env.example .env.local
```

Fill in your environment variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# MongoDB
MONGODB_URI=mongodb://localhost:27017/galaxy-ai-chatgpt

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Uploadcare
NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY=your_uploadcare_public_key

# Mem0 (Memory Service)
MEM0_API_KEY=your_mem0_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup

Ensure MongoDB is running and accessible at your configured URI.

### 5. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
galaxy-ai-chatgpt-clone/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Chat API endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── ChatInterface.tsx        # Main chat interface
│   ├── MessageBubble.tsx        # Individual message component
│   ├── Sidebar.tsx              # Chat history sidebar
│   ├── FileUpload.tsx          # File upload component
│   └── LoadingScreen.tsx       # Loading component
├── lib/
│   ├── models/
│   │   ├── User.ts             # User model
│   │   ├── Chat.ts             # Chat model
│   │   └── Message.ts           # Message model
│   └── mongodb.ts              # Database connection
├── uml_diagrams.md            # System design documentation
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🎨 UI/UX Design

The interface is a pixel-perfect replication of ChatGPT with:

- **Dark Theme** - Matching ChatGPT's exact color scheme
- **Responsive Layout** - Mobile-first design
- **Smooth Animations** - Typing indicators and transitions
- **Accessibility** - ARIA-compliant components
- **File Upload** - Drag-and-drop interface
- **Message Actions** - Copy, like, regenerate functionality

## 🔧 API Endpoints

### Chat API
- **POST** `/api/chat` - Send messages and receive AI responses
- **GET** `/api/chat/[id]` - Retrieve chat history
- **PUT** `/api/chat/[id]` - Update chat settings
- **DELETE** `/api/chat/[id]` - Delete chat

### File Upload API
- **POST** `/api/upload` - Upload files to Cloudinary
- **DELETE** `/api/upload/[id]` - Remove uploaded files

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  clerkId: String,
  email: String,
  name: String,
  avatar: String,
  preferences: {
    theme: String,
    language: String,
    model: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Chats Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  title: String,
  model: String,
  settings: {
    temperature: Number,
    maxTokens: Number,
    systemPrompt: String
  },
  isArchived: Boolean,
  metadata: {
    messageCount: Number,
    lastMessageAt: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Messages Collection
```javascript
{
  _id: ObjectId,
  chatId: ObjectId,
  role: String, // 'user' | 'assistant' | 'system'
  content: String,
  isEdited: Boolean,
  parentMessageId: ObjectId,
  metadata: {
    tokens: Number,
    model: String,
    finishReason: String
  },
  files: [{
    id: String,
    name: String,
    type: String,
    url: String,
    size: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

Ensure all environment variables are set in your deployment platform:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `OPENAI_API_KEY`
- `MONGODB_URI`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY`
- `MEM0_API_KEY`

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
npm run type-check

# Build for production
npm run build
```

## 📚 Documentation

- [UML Diagrams & System Design](./uml_diagrams.md)
- [API Documentation](./docs/api.md)
- [Component Documentation](./docs/components.md)
- [Deployment Guide](./docs/deployment.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🎯 Roadmap

- [ ] Voice input/output
- [ ] Plugin system
- [ ] Advanced memory management
- [ ] Multi-modal AI support
- [ ] Real-time collaboration
- [ ] Advanced analytics

---

Built with ❤️ by the Galaxy.ai team
