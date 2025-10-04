# Galaxy.ai ChatGPT Clone - UML Diagrams & System Design

## 1. Use Case Diagram

```mermaid
graph TB
    User[User] --> UC1[Start New Chat]
    User --> UC2[Send Message]
    User --> UC3[Edit Message]
    User --> UC4[Upload File/Image]
    User --> UC5[View Chat History]
    User --> UC6[Delete Chat]
    User --> UC7[Regenerate Response]
    User --> UC8[Copy Message]
    User --> UC9[Share Chat]
    
    System[ChatGPT Clone System] --> UC10[Process AI Response]
    System --> UC11[Stream Response]
    System --> UC12[Manage Context Window]
    System --> UC13[Store Chat Memory]
    System --> UC14[Handle File Upload]
    System --> UC15[Process File Content]
    System --> UC16[Webhook Integration]
    
    External[External Services] --> UC17[AI Model API]
    External --> UC18[File Storage Service]
    External --> UC19[Authentication Service]
    External --> UC20[Webhook Callbacks]
```

## 2. Component Diagram

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[ChatGPT UI Components]
        Chat[Chat Interface]
        Upload[File Upload Component]
        Settings[Settings Panel]
        Sidebar[Chat History Sidebar]
    end
    
    subgraph "API Layer"
        API[Next.js API Routes]
        Auth[Authentication Middleware]
        RateLimit[Rate Limiting]
        Validation[Input Validation]
    end
    
    subgraph "Business Logic Layer"
        ChatService[Chat Service]
        MemoryService[Memory Service]
        FileService[File Processing Service]
        WebhookService[Webhook Service]
        ContextService[Context Management]
    end
    
    subgraph "Data Layer"
        MongoDB[(MongoDB)]
        Cloudinary[Cloudinary Storage]
        Redis[(Redis Cache)]
    end
    
    subgraph "External Services"
        VercelAI[Vercel AI SDK]
        Clerk[Clerk Auth]
        AI[AI Models]
        Webhooks[External Webhooks]
    end
    
    UI --> API
    Chat --> ChatService
    Upload --> FileService
    API --> Auth
    API --> ChatService
    ChatService --> VercelAI
    ChatService --> MemoryService
    MemoryService --> MongoDB
    FileService --> Cloudinary
    WebhookService --> Webhooks
    ContextService --> Redis
```

## 3. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USER {
        string id PK
        string email
        string name
        string avatar
        datetime createdAt
        datetime updatedAt
        string clerkId
    }
    
    CHAT {
        string id PK
        string userId FK
        string title
        datetime createdAt
        datetime updatedAt
        boolean isArchived
        string model
        object settings
    }
    
    MESSAGE {
        string id PK
        string chatId FK
        string role
        string content
        datetime createdAt
        datetime updatedAt
        boolean isEdited
        string parentMessageId
        object metadata
    }
    
    FILE {
        string id PK
        string messageId FK
        string fileName
        string fileType
        string fileUrl
        string filePath
        number fileSize
        datetime uploadedAt
        object metadata
    }
    
    MEMORY {
        string id PK
        string userId FK
        string chatId FK
        string content
        string type
        datetime createdAt
        number importance
    }
    
    WEBHOOK {
        string id PK
        string url
        string event
        boolean isActive
        datetime createdAt
        object config
    }
    
    USER ||--o{ CHAT : creates
    CHAT ||--o{ MESSAGE : contains
    MESSAGE ||--o{ FILE : has
    USER ||--o{ MEMORY : owns
    CHAT ||--o{ MEMORY : belongs_to
```

## 4. Sequence Diagram - Chat Flow

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Frontend UI
    participant API as Next.js API
    participant Auth as Clerk Auth
    participant Chat as Chat Service
    participant AI as Vercel AI SDK
    participant DB as MongoDB
    participant Mem as Memory Service
    
    U->>UI: Send Message
    UI->>API: POST /api/chat
    API->>Auth: Verify Token
    Auth-->>API: User Authenticated
    API->>Chat: Process Message
    Chat->>Mem: Get Chat Context
    Mem->>DB: Fetch Chat History
    DB-->>Mem: Return Messages
    Mem-->>Chat: Return Context
    Chat->>AI: Send to AI Model
    AI-->>Chat: Stream Response
    Chat-->>UI: Stream to User
    Chat->>DB: Save Message
    Chat->>Mem: Update Memory
    UI->>U: Display Response
```

## 5. Activity Diagram - Message Processing

```mermaid
flowchart TD
    A[User Sends Message] --> B{Message Valid?}
    B -->|No| C[Return Error]
    B -->|Yes| D[Authenticate User]
    D --> E{User Authenticated?}
    E -->|No| F[Return 401]
    E -->|Yes| G[Get Chat Context]
    G --> H[Check Context Window]
    H --> I{Context Too Large?}
    I -->|Yes| J[Trim Context]
    I -->|No| K[Send to AI Model]
    J --> K
    K --> L[Stream Response]
    L --> M[Save Message to DB]
    M --> N[Update Memory]
    N --> O[Trigger Webhooks]
    O --> P[Return Success]
    
    Q[User Edits Message] --> R[Get Original Message]
    R --> S[Update Message Content]
    S --> T[Regenerate Response]
    T --> U[Update Chat Context]
    U --> V[Stream New Response]
```

## 6. System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
        Mobile[Mobile App]
    end
    
    subgraph "CDN & Edge"
        Vercel[Vercel Edge Network]
        Cloudinary[Cloudinary CDN]
    end
    
    subgraph "Application Layer"
        NextJS[Next.js Application]
        API[API Routes]
        Middleware[Middleware]
    end
    
    subgraph "Authentication"
        Clerk[Clerk Auth Service]
    end
    
    subgraph "AI & Processing"
        VercelAI[Vercel AI SDK]
        OpenAI[OpenAI API]
        Anthropic[Anthropic API]
        Mem0[Mem0 Memory Service]
    end
    
    subgraph "Data Layer"
        MongoDB[(MongoDB Atlas)]
        Redis[(Redis Cache)]
    end
    
    subgraph "File Storage"
        CloudinaryStorage[Cloudinary Storage]
        Uploadcare[Uploadcare]
    end
    
    subgraph "External Services"
        Webhooks[Webhook Endpoints]
        Analytics[Analytics Services]
    end
    
    Browser --> Vercel
    Mobile --> Vercel
    Vercel --> NextJS
    NextJS --> API
    API --> Clerk
    API --> VercelAI
    VercelAI --> OpenAI
    VercelAI --> Anthropic
    API --> MongoDB
    API --> Redis
    API --> Mem0
    API --> CloudinaryStorage
    API --> Uploadcare
    API --> Webhooks
    Cloudinary --> CloudinaryStorage
```

## 7. Database Schema (MongoDB Collections)

### Users Collection
```javascript
{
  _id: ObjectId,
  clerkId: String,
  email: String,
  name: String,
  avatar: String,
  createdAt: Date,
  updatedAt: Date,
  preferences: {
    theme: String,
    language: String,
    model: String
  }
}
```

### Chats Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  title: String,
  createdAt: Date,
  updatedAt: Date,
  isArchived: Boolean,
  model: String,
  settings: {
    temperature: Number,
    maxTokens: Number,
    systemPrompt: String
  },
  metadata: {
    messageCount: Number,
    lastMessageAt: Date
  }
}
```

### Messages Collection
```javascript
{
  _id: ObjectId,
  chatId: ObjectId,
  role: String, // 'user' | 'assistant' | 'system'
  content: String,
  createdAt: Date,
  updatedAt: Date,
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
    url: String
  }]
}
```

### Files Collection
```javascript
{
  _id: ObjectId,
  messageId: ObjectId,
  fileName: String,
  fileType: String,
  fileUrl: String,
  filePath: String,
  fileSize: Number,
  uploadedAt: Date,
  metadata: {
    width: Number,
    height: Number,
    duration: Number
  }
}
```

### Memories Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  chatId: ObjectId,
  content: String,
  type: String, // 'fact' | 'preference' | 'context'
  createdAt: Date,
  importance: Number,
  tags: [String]
}
```

## 8. High-Level Architecture Explanation

### System Overview
The Galaxy.ai ChatGPT Clone is a full-stack Next.js application that replicates ChatGPT's functionality with pixel-perfect UI/UX. The system is built with a microservices-oriented architecture using Next.js API routes, MongoDB for data persistence, and Vercel AI SDK for AI model integration.

### Key Components

**Frontend Layer:**
- React components built with TypeScript and TailwindCSS
- Pixel-perfect ChatGPT UI replication using v0.dev
- Real-time message streaming with graceful UI updates
- File upload components with drag-and-drop support
- Responsive design for mobile and desktop

**API Layer:**
- Next.js API routes handling authentication, chat, and file operations
- Middleware for rate limiting, validation, and security
- Webhook support for external service integration
- Context window management for long conversations

**Data Layer:**
- MongoDB for persistent storage of chats, messages, and user data
- Redis for caching and session management
- Cloudinary for secure file storage and CDN delivery
- Mem0 for intelligent conversation memory management

**AI Integration:**
- Vercel AI SDK for seamless AI model integration
- Support for multiple AI providers (OpenAI, Anthropic)
- Streaming responses with real-time UI updates
- Context window optimization for long conversations

**Security & Performance:**
- Clerk authentication with JWT tokens
- Rate limiting and input validation
- File type validation and virus scanning
- CDN optimization for global performance

### Deployment Strategy
- Vercel for hosting and edge deployment
- MongoDB Atlas for managed database
- Cloudinary for media optimization
- Environment-based configuration for different stages
