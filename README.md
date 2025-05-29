# Trello Clone API

Backend API server for Trello application using Node.js, Express, and MongoDB.

## Key Features

- **User Management**: Registration, login, email verification, user profile management
- **Board Management**: Create, edit, view, and delete boards
- **Column Management**: Add, edit, delete, and arrange columns within boards
- **Card Management**: Add, edit, delete, and drag-drop cards between columns
- **User Invitations**: Send invitations to other users to join boards
- **Socket.io**: Real-time communication between users
- **Image Upload**: Upload and process images with Cloudinary
- **Email Notifications**: Send notifications via Brevo

## Technologies

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL database
- **JWT**: JSON Web Token for authentication and authorization
- **Socket.io**: Real-time communication between client and server
- **Cloudinary**: Image storage and processing
- **Brevo**: Email service provider
- **Babel**: Modern JavaScript compiler
- **ESLint**: Code linting and standardization

## Project Structure

```
trelloAPI/
├── src/
│   ├── config/            # Configuration (MongoDB, CORS, environment variables)
│   ├── controllers/       # Request/response logic handlers
│   ├── middlewares/       # Authentication and error handling middleware
│   ├── models/            # MongoDB schema definitions
│   ├── providers/         # Third-party service integrations (Brevo, Cloudinary)
│   ├── routes/            # API endpoints definitions
│   │   └── v1/            # API version 1
│   ├── services/          # Business logic
│   ├── sockets/           # Socket.io event handlers
│   ├── utils/             # Utility functions
│   ├── validations/       # Input data validation
│   └── server.js          # Entry point
└── package.json           # Dependencies and scripts
```

## Setup

1. Clone repository
```bash
git clone <repository-url>
cd trelloAPI
```

2. Install dependencies
```bash
npm install
```

3. Create .env file based on .env.example template and update environment variables

4. Run the application
   - Development environment
   ```bash
   npm run dev
   ```
   - Production environment
   ```bash
   npm run production
   ```

## API Endpoints

### Authentication
- `POST /v1/users/register` - Register a new user
- `POST /v1/users/verify` - Verify user email
- `POST /v1/users/login` - Login
- `POST /v1/users/logout` - Logout
- `POST /v1/users/refresh-token` - Refresh token

### Boards
- `GET /v1/boards` - Get list of boards
- `POST /v1/boards` - Create a new board
- `GET /v1/boards/:boardId` - Get board details
- `PUT /v1/boards/:boardId` - Update board information
- `DELETE /v1/boards/:boardId` - Delete a board

### Columns
- `GET /v1/columns` - Get list of columns
- `POST /v1/columns` - Create a new column
- `PUT /v1/columns/:columnId` - Update column information
- `DELETE /v1/columns/:columnId` - Delete a column

### Cards
- `POST /v1/cards` - Create a new card
- `PUT /v1/cards/:cardId` - Update card information
- `PUT /v1/boards/support/moveCardDifferenceColumn` - Move a card between columns

### Invitations
- `POST /v1/invitations/board` - Invite a user to a board
- `PUT /v1/invitations/board/:invitationId` - Update invitation status

## Acknowledgments

This project was created as part of my learning journey by following the TrungQuanDev tutorial series on YouTube.