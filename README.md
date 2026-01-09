# Scalable REST API with Authentication & Role-Based Access

A full-stack application featuring a secure, scalable backend API with JWT authentication, role-based access control, and a React frontend for task management.

![Task Manager Dashboard](./screenshots/dashboard.png)

## 📸 Screenshots

### Login & Authentication
![Login Page](./screenshots/login.png)
*Secure login with JWT authentication*

### Dashboard Overview
![Dashboard](./screenshots/dashboard.png)
*Admin dashboard showing task statistics and recent tasks*

### Task Management
![Task List](./screenshots/task-list.png)
*Complete task management with filtering and CRUD operations*

### Create New Task
![Create Task](./screenshots/create-task.png)
*Intuitive task creation form with validation*

### API Documentation
![Swagger API Docs](./screenshots/api-docs.png)
*Interactive API documentation with Swagger UI*

## 🚀 Live Demo

### Frontend Application
- **URL**: http://localhost:3000
- **Admin Login**: admin@example.com / admin123
- **User Login**: john@example.com / password123

### API Documentation
- **Swagger UI**: http://localhost:5000/api-docs
- **Health Check**: http://localhost:5000/health

![API Documentation](./screenshots/swagger-ui.png)

## 🚀 Features

### Backend (Primary Focus)
- ✅ User registration & login with password hashing (bcrypt)
- ✅ JWT authentication with secure token handling
- ✅ Role-based access control (user vs admin)
- ✅ CRUD operations for tasks (secondary entity)
- ✅ API versioning (/api/v1/)
- ✅ Comprehensive error handling & validation (Joi)
- ✅ API documentation with Swagger
- ✅ MongoDB database with Mongoose ODM
- ✅ Security middleware (helmet, cors, rate limiting)
- ✅ Input sanitization & validation

### Frontend (Supportive)
- ✅ React.js application with modern hooks
- ✅ User registration & login interface
- ✅ Protected dashboard with JWT authentication
- ✅ Task CRUD operations interface
- ✅ Error/success message handling
- ✅ Responsive design

### Security & Scalability
- ✅ Secure JWT token handling
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Input validation and sanitization
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Modular project structure
- ✅ Environment variable configuration

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn package manager

## 🛠️ Installation & Setup

### Quick Start (Recommended)

1. **Clone and setup**
   ```bash
   git clone <repository-url>
   cd scalable-rest-api
   npm run setup
   ```

2. **Configure environment**
   Update `.env` file with your MongoDB Atlas URI:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/scalable-api
   ```

3. **Seed sample data**
   ```bash
   npm run seed
   ```

4. **Start both servers**
   ```bash
   # Terminal 1 - Backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - API Docs: http://localhost:5000/api-docs

![Setup Success](./screenshots/setup-complete.png)

## 🎯 Usage Examples

### User Authentication Flow
![Authentication Flow](./screenshots/auth-flow.png)

1. **Register a new user**
2. **Login with credentials** 
3. **Access protected dashboard**
4. **Manage tasks with role-based permissions**

## 📚 API Documentation

![Swagger Documentation](./screenshots/swagger-detailed.png)

### Swagger Documentation
Visit http://localhost:5000/api-docs for interactive API documentation

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user" // optional, defaults to "user"
}
```

#### Login User
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer <jwt-token>
```

### Task Endpoints

#### Get All Tasks
```http
GET /api/v1/tasks?status=pending&priority=high&page=1&limit=10
Authorization: Bearer <jwt-token>
```

#### Create Task
```http
POST /api/v1/tasks
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the REST API project",
  "priority": "high",
  "dueDate": "2024-12-31T23:59:59.000Z"
}
```

#### Update Task
```http
PUT /api/v1/tasks/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "status": "completed"
}
```

#### Delete Task
```http
DELETE /api/v1/tasks/:id
Authorization: Bearer <jwt-token>
```

### User Management (Admin Only)

#### Get All Users
```http
GET /api/v1/users
Authorization: Bearer <admin-jwt-token>
```

#### Update User Role
```http
PATCH /api/v1/users/:id/role
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "role": "admin"
}
```

## 🏗️ Project Structure

```
scalable-rest-api/
├── models/
│   ├── User.js          # User model with authentication
│   └── Task.js          # Task model
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── tasks.js         # Task CRUD routes
│   └── users.js         # User management routes
├── middleware/
│   ├── auth.js          # JWT authentication middleware
│   └── validation.js    # Input validation middleware
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # Authentication context
│   │   └── services/    # API service
│   └── public/
├── server.js            # Express server setup
├── package.json
└── README.md
```

## 🔐 Security Features

1. **Password Security**
   - Bcrypt hashing with 12 salt rounds
   - Password validation (minimum 6 characters)

2. **JWT Security**
   - Secure token generation and validation
   - Token expiration (7 days default)
   - Authorization header validation

3. **API Security**
   - Rate limiting (100 requests per 15 minutes)
   - CORS protection
   - Helmet security headers
   - Input validation and sanitization

4. **Role-Based Access**
   - User role: Can manage own tasks
   - Admin role: Can manage all tasks and users

## 📈 Scalability Considerations

### Current Implementation
- **Modular Architecture**: Separated concerns with models, routes, and middleware
- **Database Indexing**: Optimized queries with MongoDB indexes
- **Pagination**: Implemented for large datasets
- **Error Handling**: Centralized error handling middleware
- **Environment Configuration**: Flexible deployment settings

### Future Scalability Enhancements

1. **Microservices Architecture**
   - Split authentication and task services
   - API Gateway for service orchestration
   - Service discovery and load balancing

2. **Caching Strategy**
   - Redis for session management
   - Database query result caching
   - CDN for static assets

3. **Database Optimization**
   - Database sharding for horizontal scaling
   - Read replicas for improved performance
   - Connection pooling

4. **Infrastructure**
   - Docker containerization
   - Kubernetes orchestration
   - Auto-scaling based on load
   - Load balancers (NGINX, AWS ALB)

5. **Monitoring & Logging**
   - Application performance monitoring (APM)
   - Centralized logging (ELK stack)
   - Health checks and metrics

## 🧪 Testing

### Backend Testing
```bash
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Docker Deployment (Optional)
```dockerfile
# Dockerfile example
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-production-secret-key-very-long-and-secure
JWT_EXPIRE=7d
```

## 📝 API Response Format

### Success Response
```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": {
    "user": { ... },
    "token": "jwt-token"
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📷 Adding Screenshots

To complete the documentation, please take screenshots of your working application:

1. **Create screenshots directory** (already created)
2. **Take screenshots** following the guide in `screenshots/README.md`
3. **Save images** as PNG files in the `screenshots/` directory
4. **Commit and push** to your repository

### Required Screenshots:
- `login.png` - Login interface
- `dashboard.png` - Admin dashboard
- `task-list.png` - Task management interface  
- `create-task.png` - Task creation form
- `api-docs.png` - Swagger API documentation

## 👨‍💻 Author

Backend Developer Intern Assignment - Scalable REST API Implementation

---

**Note**: This project demonstrates enterprise-level backend development practices with security, scalability, and maintainability in mind. The implementation follows REST API best practices and includes comprehensive documentation for easy deployment and maintenance.