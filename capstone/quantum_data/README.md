# CapstoneGroup8 Django Backend

A Django-based web backend project using PostgreSQL as the database and environment variable management via `.env` files.

---

## 🚀 Features

- Django 4.x backend
- PostgreSQL database integration
- Environment configuration with `python-dotenv`
- Virtual environment setup
- Ready for development and deployment

---

## 📦 Requirements

- Python 3.12
- pip
- PostgreSQL
- Git
- (Optional) virtualenv or venv

---

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/capstoneGroup8.git
cd capstoneGroup8
```

### 2. Create and activate a virtual environment

```bash
# Windows
py -3.12 -m venv venv
.\venv\Scripts\activate

# macOS/Linux
python3.12 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Set up the `.env` file

Create a `.env` file in the project root directory and add the following:

```env
DEBUG=True
SECRET_KEY=your-secret-key
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
```

> ⚠️ DO NOT commit the `.env` file to version control. Add it to `.gitignore`.

---

## 🗃️ Database Setup

Make sure PostgreSQL is installed and a database is created with the same credentials as in `.env`.

### Then run migrations:

```bash
python manage.py migrate
```

---

## 🧪 Run the Development Server

```bash
python manage.py runserver
```

Visit: [http://localhost:8000](http://localhost:8000)

---

## 🧪 Running Tests

```bash
python manage.py test
```

---

## ✅ Deployment Notes

- Use `DEBUG=False` in production.
- Set `ALLOWED_HOSTS` and other production-specific settings via `.env`.
- Use tools like Gunicorn + Nginx or deploy to platforms like Heroku or Railway.

---

## 📁 Folder Structure

```
capstoneGroup8/
├── capstone/          # Your Django project folder
├── venv/               # Virtual environment
├── .env                # Environment variables
├── manage.py
├── requirements.txt
└── README.md
```

---

## 🧑‍💻 Contributors

- Nandani-06
- Philip Wu
- Ammad Rahman
- Zihan Wu
- Yehao Chen
- Joycehaoyuan
