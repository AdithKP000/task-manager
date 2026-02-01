# Task Management API

A simple and robust Task Management API built with Express.js and PostgreSQL.

## How to Run the Project

### Prerequisites
- Node.js installed
- PostgreSQL installed and running

### Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=8000
   DB_USER=your_user
   DB_HOST=localhost
   DB_DATABASE=your_database
   DB_PASSWORD=your_password
   DB_PORT=5432
   ```
4. Initialize the Database:
   Run the SQL commands provided in `config/init_db.sql` using your PostgreSQL terminal or tool (like pgAdmin).

### Running
- Start the server in production mode:
  ```bash
  npm start
  ```
- Start the server in development mode:
  ```bash
  npm run server
  ```

## Assumptions Made
1. **Database Schema**: Every task has a title and description. The title must be at least 3 characters long.
2. **UUIDs**: Tasks use UUIDs as primary keys for better scalability.
3. **Status Enum**: Task status is restricted to `todo`, `in_progress`, and `completed`.
4. **Metrics**: Metrics return counts for each status. Average completion time was considered but removed to simplify the database schema.

## Design Decisions
- **Express.js**: Chosen for its simplicity and large ecosystem.
- **PG node (pg-node)**: Used for direct and efficient PostgreSQL interaction.
- **RESTful Routes**: Standard API patterns used for consistency (`GET`, `POST`, `PUT`).
- **Error Handling**: Implemented centralized catch blocks in controllers to return meaningful error messages and status codes (e.g., `504` for database errors).

## AI Usage Disclosure
This project was developed with the assistance of **Antigravity**, an AI coding assistant by Google DeepMind. AI was used for:
- Generating boilerplate code and project structure and the Readme file.
- Implementing database query logic for Metrics and tasks listing .
- Documentation and README generation.

## Example Input/Output

### 1. Create a Task
**POST** `/api/v1/tasks/create`
- **Input**:
  ```json
  {
      "title": "Learn Node.js",
      "description": "Master the basics of Express and PostgreSQL",
      "status":"todo " /// no need to add status it is set as default to todo
  }
  ```
- **Output**:
  ```json
  {
      "success": true,
      "message": "Task created successfully",
      "data": {
          "id": "...",
          "title": "Learn Node.js",
          "description": "Master the basics of Express and PostgreSQL",
          "status": "todo",
          "created_at": "..."
      }
  }
  ```


### 2. PUT UPDATE a task status
**PUT** `/api/v1/tasks/update/:taskId`
- **Output**:
  ```json
  {
      "success": true,
      "message": "Task updated successfully",
      "data": {
          "totalTasks": 5,
          "counts": {
              "todo": 3,
              "in_progress": 1,
              "completed": 1
          }
      }
  }
  ```


### 3. Get All Tasks (with Filtering & Sorting)
**GET** `/api/v1/tasks/getAll?status=todo&sort=desc`
- **Output**:
  ```json
  {
      "success": true,
      "message": "Tasks fetched successfully",
      "data": [...]
  }
  ```
 ### Get All Tasks
**GET** `/api/v1/tasks/getAll`
- **Output**:
  ```json
  {
      "success": true,
      "message": "Tasks fetched successfully",
      "data": [...]
  }
  ```

### 4. Get Metrics
**GET** `/api/v1/tasks/metrics`
- **Output**:
  ```json
  {
      "success": true,
      "message": "Metrics fetched successfully",
      "data": {
          "totalTasks": 5,
          "counts": {
              "todo": 3,
              "in_progress": 1,
              "completed": 1
          }
      }
  }
  ```

