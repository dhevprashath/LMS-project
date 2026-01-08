# LMS Setup & Run Instructions

## Prerequisites
- Python 3.9+
- Node.js 16+
- Git

## 1. Backend Setup (FastAPI + SQLite)

**Navigate to the backend directory:**
```bash
cd backend
```

**Create and activate a virtual environment:**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

**Install dependencies:**
```bash
pip install -r requirements.txt
```

**Optional: Seed Demo Data**
To populate the database with dummy courses and initial data:
```bash
python seed_courses.py
```

**Run the Server:**
```bash
uvicorn main:app --reload
```
> The server will start at `http://127.0.0.1:8000`.
> The database `lms.db` will be automatically created in the backend folder.

## 2. Frontend Setup (React + Vite)

**Open a new terminal and navigate to the frontend directory:**
```bash
cd frontend
```

**Install dependencies:**
```bash
npm install
```

**Run the Development Server:**
```bash
npm run dev
```
> The frontend will run on `http://localhost:5173` (or similar).

## 3. Verify Installation

1. Open your browser to `http://localhost:5173`.
2. Register a new account (this creates your user and profile in `lms.db`).
3. Login with your new credentials.
4. Dashboard should load with 0 streak and empty stats.
5. Go to "Courses" to see the seeded content (if you ran the seed script).

## Troubleshooting

- **Database Error**: If `lms.db` causes issues, delete the file and restart the backend.
- **Dependency Issues**: Ensure `pip install -r requirements.txt` completed without errors.
- **Port Conflicts**: If port 8000 or 5173 is busy, the console will show a different port. Update the `.env` or API calls if necessary, though the frontend is configured to talk to port 8000.
