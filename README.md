#  ReelBite

ReelBite is a full-stack food reels platform where food partners can upload short food videos with descriptions, and users can explore engaging food content.

Built using the MERN Stack with secure authentication and video upload functionality.

---

## 🚀 Features

### 👤 User Features
- Browse food reels
- View food details
- Smooth video playback
- Clean modern UI

### 🏪 Food Partner Features
- Register & Login
- Secure JWT Authentication
- Upload food videos (MP4, WebM, MOV)
- Add name & description
- Protected routes

### 🔐 Security
- JWT Authentication
- Password hashing (bcrypt)
- Protected API routes
- HTTP-only cookies
- Multer file validation

---

## 🛠 Tech Stack

### Frontend 
- React (Vite)
- React Router DOM
- Axios
- CSS
- Vite Dev Server

### Backend 
- Node.js)
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcrypt (Password hashing)
- cookie-parser
- multer (File upload)
- ImageKit (Cloud storage)
- uuid (Unique file names)
- dotenv
- cors
- nodemon

  ---

## 📁 Project Structure
```
REEl_BITE/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.js
│   │
│   ├── server.js
│   ├── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│
|── README.md
├── videos/

```

### Authentication Flow
- User/Food Partner logs in
- Server verifies credentials
- JWT token is generated
- Token stored in HTTP-only cookie
- Protected routes verify token using middleware


### File Upload Flow
- Frontend sends FormData
- Multer handles file parsing
- File uploaded to ImageKit
- Video URL stored in MongoDB
- Unique filename generated using UUID


## Future Improvements

- Like & Comment system
- Reel recommendations
- Admin dashboard
- User profiles
- Upload progress bar
- User profiles
- Video compression

## Why This Project?

This project demonstrates:

- Full-stack MERN development
- Secure authentication implementation
- File upload handling
- Cloud storage integration
- REST API architecture
- Middleware design
- Real-world project structure






