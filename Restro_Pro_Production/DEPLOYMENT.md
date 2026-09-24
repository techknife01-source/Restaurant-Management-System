# Deployment Guide

## Prerequisites
- Python 3.13
- Virtual environment support
- SQLite is used by default

## Setup
1. Create and activate a virtual environment:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```
2. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
3. Apply migrations:
   ```powershell
   .\.venv\Scripts\python.exe manage.py migrate
   ```
4. Create a superuser for admin access (optional):
   ```powershell
   .\.venv\Scripts\python.exe manage.py createsuperuser
   ```

## Running locally
```powershell
.\.venv\Scripts\python.exe manage.py runserver
```
Then open `http://127.0.0.1:8000/`.

## Testing
```powershell
.\.venv\Scripts\python.exe manage.py test
```

## Notes
- The app exposes REST API endpoints under `/api/bookings/`, `/api/orders/`, and `/api/bills/`.
- Booking creation and parcel order creation are supported from the main booking page.
- Bills are generated automatically when orders are created, updated, or deleted.
