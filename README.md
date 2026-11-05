## Employee Management System

A role-based Employee Management System built using **Golang, Gin, PostgreSQL, JWT Authentication, and Python-based AI Agents**.

This project combines a scalable backend architecture with an AI-powered employee assistant that can retrieve employee information through a secure backend API.

## 🚀 Project Overview

The Employee Management System provides secure user authentication, role-based authorization, and employee management operations.

It also includes an AI Agent built using **FastAPI, LangGraph, and Google Gemini**, allowing users to interact with employee data through natural language.

## ✨ Key Features

### Backend – Golang

- User Registration and Login
- JWT-based Authentication
- Password Hashing using Bcrypt
- Role-Based Access Control (RBAC)
- Employee CRUD Operations
- PostgreSQL Database Integration
- Authentication and Authorization Middleware
- Request Logging Middleware
- Swagger API Documentation
- Layered Architecture

### AI Agent – Python

- AI-powered Employee Assistant
- FastAPI-based Chat API
- LangGraph Workflow Orchestration
- Gemini-powered Decision Making
- Dynamic Tool Selection
- Employee Data Retrieval through Backend API
- JWT Token Forwarding for Protected API Access

**Note:** The current AI Agent implements the `get_all_employees` tool. Create, update, and delete operations through the AI Agent are not currently implemented.

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Programming Languages | Go, Python |
| Backend Framework | Gin |
| AI API Framework | FastAPI |
| Database | PostgreSQL |
| Authentication | JWT |
| Password Security | Bcrypt |
| ORM / Database Access | database/sql |
| AI Framework | LangGraph |
| LLM | Google Gemini |
| API Documentation | Swagger |
| HTTP Client | Python Requests |

## 🏗️ Project Architecture

### Backend Architecture

The backend follows a layered architecture to separate responsibilities and improve maintainability.

```text
Client
  |
  v
Gin Router
  |
  v
Middleware
(Authentication / Authorization)
  |
  v
Handlers
  |
  v
Services
  |
  v
Repositories
  |
  v
PostgreSQL Database
```

### AI Agent Architecture

The AI Agent uses LangGraph to manage the decision-making and tool-execution workflow.

```text
User
 |
 v
FastAPI Chat Endpoint
 |
 v
LangGraph
 |
 v
Decision Node
 |
 +----------------------+
 |                      |
 v                      v
Tool Required       Direct Response
 |                      |
 v                      |
Employee Tool            |
 |                      |
 v                      |
Go Backend API           |
 |                      |
 +----------+-----------+
            |
            v
       Response Node
            |
            v
       Google Gemini
            |
            v
       Final Response
```

## 📂 Project Structure

```text
Employee-Management-System/
│
├── configs/
│   └── config.go
│
├── database/
│   └── db.go
│
├── docs/
│   ├── docs.go
│   ├── swagger.json
│   └── swagger.yaml
│
├── dto/
│
├── handlers/
│
├── middleware/
│
├── models/
│
├── repository/
│
├── routes/
│
├── service/
│
├── utils/
│
├── ai-agent/
│   ├── app/
│   │   ├── agent/
│   │   │   ├── graph.py
│   │   │   ├── nodes.py
│   │   │   ├── prompts.py
│   │   │   └── state.py
│   │   │
│   │   ├── services/
│   │   │   └── llm.py
│   │   │
│   │   ├── tools/
│   │   │   └── employees.py
│   │   │
│   │   ├── config.py
│   │   └── main.py
│   │
│   ├── tests/
│   │   └── test_agent.py
│   │
│   └── requirements.txt
│
├── main.go
├── go.mod
└── go.sum
```

## 🔐 Authentication & Authorization

The application uses JWT-based authentication.

1. Users register with email, password, and role.
2. Passwords are hashed using Bcrypt.
3. Users log in with their credentials.
4. The backend generates a JWT token.
5. Authentication middleware validates incoming tokens.
6. Role middleware checks permissions before protected operations.

### Role Permissions

| Operation | Access |
|---|---|
| Register | Public |
| Login | Public |
| View Employees | Authenticated Users |
| View Employee by ID | Authenticated Users |
| Create Employee | Admin |
| Update Employee | Admin |
| Delete Employee | Admin |

## 📡 API Endpoints

Backend runs on port `8081`.

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/register` | Register User | Public |
| POST | `/login` | User Login | Public |
| GET | `/employees` | Get All Employees | Authenticated |
| GET | `/employees/:id` | Get Employee by ID | Authenticated |
| POST | `/employees` | Create Employee | Admin |
| PUT | `/employees/:id` | Update Employee | Admin |
| DELETE | `/employees/:id` | Delete Employee | Admin |

### Authorization Header

Protected endpoints require:

```http
Authorization: Bearer <JWT_TOKEN>
```

## 🤖 AI Agent Integration

The project includes an AI-powered employee assistant.

The AI Agent uses:

- **FastAPI** – Exposes the chat endpoint.
- **LangGraph** – Controls agent workflow and routing.
- **Google Gemini** – Understands user requests and generates responses.
- **Employee Tool** – Retrieves employee information from the Go backend.

### Agent Workflow

1. User sends a natural-language message.
2. The decision node determines whether a tool is required.
3. If required, the employee tool calls the Go backend.
4. The backend validates the JWT token.
5. Employee information is returned to the agent.
6. Gemini generates the final response.

### AI Agent API

**Endpoint:**

```http
POST /agent/chat
```

**Request:**

```json
{
  "message": "Show all employees"
}
```

**Optional Authorization Header:**

```http
Authorization: Bearer <JWT_TOKEN>
```

The AI service runs on port `8000` using the example development command below.

## ⚙️ Environment Configuration

### Go Backend

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=employee_management
DB_SSLMODE=disable
DB_JWTSecret=your_secret_key
```

### AI Agent

Create a `.env` file inside the `ai-agent` directory:

```env
GEMINI_API_KEY=your_gemini_api_key
GO_BACKEND_URL=http://localhost:8081
```

**Important:** Replace example values with your own credentials. Never commit API keys, database passwords, or JWT secrets to GitHub.

## ▶️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Devtejesh/Employement-Management-System-.git

cd Employement-Management-System-
```

### 2. Configure PostgreSQL

- Install and start PostgreSQL.
- Create the database configured in your `.env` file.
- Ensure the `users` and `employees` tables exist with the columns expected by the application queries.

The repository does not currently include database migration or schema-creation scripts.

### 3. Run the Go Backend

```bash
go mod download

go run .
```

Backend URL:

```text
http://localhost:8081
```

### 4. Run the AI Agent

Navigate to the AI Agent directory:

```bash
cd ai-agent
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it:

**Windows:**

```powershell
.venv\Scripts\Activate.ps1
```

**Linux / macOS:**

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn app.main:app --reload --port 8000
```

AI Agent URL:

```text
http://localhost:8000
```

## 📖 Swagger Documentation

Explore the backend API documentation:

```text
http://localhost:8081/swagger/index.html
```

## 🧪 Testing

The AI Agent includes a basic test under:

```text
ai-agent/tests/test_agent.py
```

Run it from the `ai-agent` directory:

```bash
pytest
```

## 🔮 Future Improvements

- Database migrations and schema automation.
- Expanded Go unit and integration test coverage.
- Additional AI Agent tools.
- Improved tool-call validation and error handling.
- Enhanced observability and monitoring.
- CI/CD pipeline and deployment automation.

## 👨‍💻 Author

**Tejesh**

Software Developer | Golang Backend Developer | AI Agent Enthusiast

---

⭐ If you find this project interesting, feel free to explore the repository and share your feedback.
