# MERN Chat Application

A real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js).

## Live Demo

[View Live Demo](https://mern-chat-app-1-buzi.onrender.com)

## Features
- Real-time messaging
- User authentication
- Responsive UI
- Group and private chats

## Getting Started

### Prerequisites
- Node.js
- npm or yarn
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Amritansu-Adi/MERN-Chat-App.git
   cd MernChatApplication
   ```
2. Install dependencies for backend and frontend:
   ```bash
   cd Backend
   npm install
   cd ../Frontend
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the `Backend` directory with your MongoDB URI and other secrets.

4. Start the development servers:
   - Backend:
     ```bash
     cd Backend
     npm run dev
     ```
   - Frontend:
     ```bash
     cd ../Frontend
     npm run dev
     ```

## Environment Variables

Create a `.env` file in the `Backend` directory with the following variables:

```
MONGO_URI=your_mongodb_connection_string
PORT=your_port_number
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development_or_production
```

**Descriptions:**
- `MONGO_URI`: MongoDB connection string
- `PORT`: Port number for the backend server (e.g., 5000)
- `JWT_SECRET`: Secret key for JWT authentication
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary account cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
- `NODE_ENV`: Set to `development` or `production`

## Backend Installation (Dependencies)

The backend uses the following dependencies (see package-lock.json):

- bcryptjs
- cloudinary
- cookie-parser
- cors
- dotenv
- express
- jsonwebtoken
- mongoose
- nodemon (dev)
- socket.io

To install all backend dependencies, run:

```bash
cd Backend
npm install
```

## Frontend Installation (Dependencies)

The frontend uses the following dependencies (see package-lock.json):

- axios
- react
- react-dom
- react-router-dom
- socket.io-client
- vite (dev)

To install all frontend dependencies, run:

```bash
cd Frontend
npm install
```

## Technologies Used
- MongoDB
- Express.js
- React.js
- Node.js
- Socket.io

## License

This project is licensed under the MIT License.
