<div align="center">

# ⚡ FlowDo

### *Organize Your Life. Beautifully.*

<br/>

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B734FE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)
![PRs](https://img.shields.io/badge/PRs-Welcome-pink?style=for-the-badge)

<br/>

[![Live](https://img.shields.io/badge/Live-Site-6366F1?style=for-the-badge&logo=firebase&logoColor=white)](https://as-flowdo.web.app)

</div>

---
## ⚡ Live :
as-flowdo.web.app/

<br/>

<p align="center">
  A premium productivity web app with Firebase auth, cloud sync, drag-and-drop tasks,<br/>
  Pomodoro timer, achievements, and a stunning glassmorphism UI.
</p>

<br/>

## ✨ Features

<table>
  <tr>
    <td>

🔐 **Firebase Authentication**  
Email/password, Google sign-in, email verification

</td>
    <td>

☁️ **Cloud Sync**  
Tasks saved to Firestore, synced across devices

</td>
  </tr>
  <tr>
    <td>

📋 **Task Management**  
Create, edit, delete, duplicate, pin, archive tasks

</td>
    <td>

🔀 **Drag & Drop**  
Reorder tasks with smooth @dnd-kit animations

</td>
  </tr>
  <tr>
    <td>

🔍 **Search & Filters**  
Full-text search, 11 filters, 6 sort options

</td>
    <td>

🍅 **Pomodoro Timer**  
Built-in 25/5 focus/break sessions

</td>
  </tr>
  <tr>
    <td>

🔔 **Task Alarms**  
Set due times with browser + in-app notifications

</td>
    <td>

🏆 **Achievements**  
8 unlockable milestones to gamify productivity

</td>
  </tr>
  <tr>
    <td>

📊 **Statistics**  
Charts, category breakdown, weekly completion data

</td>
    <td>

📅 **Calendar View**  
Visual overview of tasks by date

</td>
  </tr>
  <tr>
    <td>

🎨 **Accent Colors**  
8 theme colors to personalize your experience

</td>
    <td>

⚡ **Keyboard Shortcuts**  
⌘K search, ⌘N new task, ⌘Z undo, ⌘1-6 navigate

</td>
  </tr>
  <tr>
    <td>

📱 **Fully Responsive**  
Works beautifully on desktop and mobile

</td>
    <td>

🎬 **Smooth Animations**  
Framer Motion transitions throughout

</td>
  </tr>
</table>

<br/>

## 🛠️ Tech Stack

<div align="center">

| Technology | Purpose |
|:----------:|:-------:|
| <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" /> | UI Framework |
| <img src="https://img.shields.io/badge/Vite-B734FE?style=flat-square&logo=vite&logoColor=FFD62E" /> | Build Tool |
| <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" /> | Styling |
| <img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black" /> | Auth + Database |
| <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white" /> | Animations |
| <img src="https://img.shields.io/badge/dnd__kit-6366F1?style=flat-square&logoColor=white" /> | Drag & Drop |

</div>

<br/>
## ✨ Interface 
<img width="1912" height="907" alt="image" src="https://github.com/user-attachments/assets/d55c5077-1a93-4455-8f26-664326bab9d3" />
<img width="1700" height="902" alt="image" src="https://github.com/user-attachments/assets/28fd99f4-e64c-43ab-b753-1a0962f36cca" />

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/Susmita0711/flowdo.git

# Navigate to project
cd flowdo

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Fill in your Firebase config keys

# Start development server
npm run dev
```

<br/>

> 

<br/>

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

<br/>

## 🔥 Firebase Setup

<table>
  <tr>
    <td align="center" width="25">

**1**  
Create project

</td>
    <td align="center" width="8">

➡️

</td>
    <td align="center" width="25">

**2**  
Enable Auth

</td>
    <td align="center" width="8">

➡️

</td>
    <td align="center" width="25">

**3**  
Create Firestore

</td>
    <td align="center" width="8">

➡️

</td>
    <td align="center" width="25">

**4**  
Deploy rules

</td>
  </tr>
</table>

```bash
firebase deploy --only firestore:rules
```

<br/>

## 📖 How It Works

<table>
  <tr>
    <td align="center" width="50">

**1**  
Sign up / Login

</td>
    <td align="center" width="50">

➡️

</td>
    <td align="center" width="50">

**2**  
Create tasks

</td>
    <td align="center" width="50">

➡️

</td>
    <td align="center" width="50">

**3**  
Organize & prioritize

</td>
    <td align="center" width="50">

➡️

</td>
    <td align="center" width="50">

**4**  
Track & achieve

</td>
  </tr>
</table>

<br/>

## 🚀 Deploy

```bash
# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

<br/>

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

```bash
# Fork the repo
# Create your feature branch
git checkout -b feature/amazing-feature

# Commit your changes
git commit -m "Add amazing feature"

# Push to the branch
git push origin feature/amazing-feature

# Open a Pull Request
```

<br/>

---

<div align="center">

### Built with ❤️ by [**Susmita**](https://github.com/Susmita0711)

![Follow](https://img.shields.io/badge/Follow-Susmita-6366F1?style=for-the-badge&logo=github&logoColor=white)

</div>
