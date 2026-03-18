#  Job Application Tracker

A full-stack web application that helps job seekers organize their applications and get AI-powered insights on how well their resume matches job descriptions.

![Job Tracker Demo](https://img.shields.io/badge/Status-Active-success)
![Python](https://img.shields.io/badge/Python-3.9+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green)
![React](https://img.shields.io/badge/React-18+-61DAFB)

**🌐 Live Demo:** https://nowshin-jobtracker.vercel.app/
##  Features

### 📊 Job Management
- **Track Applications**: Save and organize job applications with company, title, location, and salary info
- **Status Tracking**: Monitor application progress (Saved, Applied, Interview Scheduled, Interviewed, Offer, Rejected, Withdrawn)
- **Company Organization**: Automatic company deduplication and relationship management

###  AI-Powered Insights
- **Resume Analysis**: Upload your resume (PDF, DOCX, or TXT) once
- **Match Score**: Get AI-calculated compatibility scores for each job
- **Missing Skills**: Identify key technologies and skills you're missing
- **Resume Optimization**: Receive personalized suggestions to improve your resume
- **Interview Strategy**: Get tailored preparation tips for each role

###  Authentication & Security
- JWT-based authentication
- Bcrypt password hashing
- Secure session management

###  Modern UI
- Beautiful, responsive design with Tailwind CSS
- Glassmorphism effects
- Smooth animations and transitions
- Mobile-friendly interface

---

##  Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM with async support
- **SQLite/PostgreSQL** - Database (SQLite for local, PostgreSQL for production)
- **Gemini AI** - Google's AI for resume analysis
- **JWT** - Secure authentication
- **PyPDF2 & python-docx** - Resume file parsing

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icon library

---

##  Getting Started

### Prerequisites

- **Python 3.9+**
- **Node.js 16+**
- **npm or yarn**
- **Gemini API Key** ([Get one here](https://aistudio.google.com/apikey))

### 1️ Clone the Repository
```bash
git clone https://github.com/nnh26/JobTracker.git
cd JobTracker
```

### 2️ Backend Setup
```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
# Copy .env.example to .env and fill in your values
```

**Create `backend/.env`:**
```env
DATABASE_URL=sqlite+aiosqlite:///./job_tracker.db
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
GEMINI_API_KEY=your-gemini-api-key-here
```

**Start the backend:**
```bash
python main.py
```

Backend will run on: **http://localhost:8000**

API Docs available at: **http://localhost:8000/docs**

### 3️ Frontend Setup
```bash
# Open a new terminal and navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: **http://localhost:5173**

---

##  Project Structure
```
JobTracker/
├── backend/
│   ├── venv/                   # Virtual environment
│   ├── main.py                 # FastAPI app & routes
│   ├── database.py             # Database configuration
│   ├── models.py               # SQLAlchemy models
│   ├── schemas.py              # Pydantic schemas
│   ├── auth.py                 # JWT authentication
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Environment variables
│   └── job_tracker.db          # SQLite database
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LandingPage.jsx   # Landing page
│   │   │   ├── Login.jsx         # Auth page
│   │   │   └── Dashboard.jsx     # Main app dashboard
│   │   ├── lib/
│   │   │   └── utils.js          # Utility functions
│   │   ├── App.jsx               # Root component
│   │   ├── api.js                # API client
│   │   └── index.css             # Global styles
│   ├── tailwind.config.js        # Tailwind configuration
│   ├── package.json              # Node dependencies
│   └── vite.config.js            # Vite configuration
│
└── README.md
```

---

##  API Endpoints

### Authentication
- `POST /auth/register` - Create new user account
- `POST /auth/login` - Login and get JWT token

### Jobs
- `GET /jobs` - Get all jobs
- `POST /jobs` - Create new job (requires auth)
- `PUT /jobs/{job_id}` - Update job
- `DELETE /jobs/{job_id}` - Delete job

### AI Analysis
- `POST /parse-resume` - Extract text from resume file (PDF/DOCX/TXT)
- `POST /analyze-match` - Analyze resume-job match with AI

---

## 💡 Usage Guide

### 1. Create an Account
- Click "Get Started" on the landing page
- Fill in your details and register

### 2. Upload Your Resume
- Navigate to "Resume Vault" tab
- Upload your resume (PDF, DOCX, or TXT format)
- Text will be extracted and stored

### 3. Add Job Applications
- Click "+ Add Job" button
- Enter company name, job title, and paste the job description
- Select current status
- Save the application

### 4. Get AI Insights
- Click "AI Match Insights" on any job card
- View your match score (0-100%)
- See missing keywords and skills
- Get personalized resume improvement tips
- Receive interview preparation strategies

### 5. Track Your Progress
- Update job statuses as you progress
- View all applications in one dashboard
- Delete applications you're no longer pursuing

---

##  Screenshots

### Landing Page
Beautiful gradient hero section with clear call-to-action

### Dashboard
Clean, card-based layout showing all your job applications

### AI Analysis Modal
Detailed insights with match score visualization and actionable recommendations

---

##  Configuration

### Database
- **Local Development**: SQLite (default)
- **Production**: PostgreSQL (recommended)

To switch to PostgreSQL, update `.env`:
```env
DATABASE_URL=postgresql+asyncpg://user:password@host:port/dbname
```

### AI Model
Currently using **Gemini 3.0  Flash**. You can change the model in `backend/main.py`:
```python
model='gemini-1.5-flash'  # or 'gemini-1.5-pro' for better results
```

---

##  Deployment

### Backend (Railway/Render/Heroku)

1. Create a new project
2. Connect your GitHub repo
3. Set environment variables
4. Deploy from `backend/` directory

### Frontend (Vercel/Netlify)

1. Create a new project
2. Connect your GitHub repo
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Update API URL in `frontend/src/api.js` to your deployed backend URL

---

##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

##  Author

**Nowshin Hoque**
- GitHub: [@nnh26](https://github.com/nnh26)
- Email: nnh26@njit.edu

---

##  Acknowledgments

- **Google Gemini AI** for powering the resume analysis
- **FastAPI** for the amazing Python web framework
- **React** and **Tailwind CSS** for the frontend stack
- **v0.dev** for UI design inspiration

---

##  Known Issues

- Gemini API has rate limits on the free tier (15 requests/minute)
- PDF parsing works best with text-based PDFs (not scanned images)
- Some complex PDF layouts may not parse perfectly

---

## 🔮 Future Enhancements

- [ ] Email notifications for application deadlines
- [ ] Calendar integration for interview scheduling
- [ ] Export applications to CSV/PDF
- [ ] Application statistics and analytics dashboard
- [ ] Chrome extension to save jobs while browsing
- [ ] Mobile app (React Native)
- [ ] Integration with job boards (LinkedIn, Indeed)

---

## Support

If you have any questions or run into issues, please [open an issue](https://github.com/nnh26/JobTracker/issues) on GitHub.

---

<div align="center">

**Made by Nowshin Hoque**

⭐ Star this repo if you find it helpful!

</div>
```

---


### `LICENSE` (MIT License)
```
MIT License

Copyright (c) 2026 Nowshin Hoque

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR DEALINGS IN THE
SOFTWARE.
