# Restro Pro - Production Guide

## Professional improvements included
- Environment-based secrets and debug configuration
- Production static-file serving with WhiteNoise
- Security headers and HTTPS/HSTS settings in production
- Gunicorn support via Procfile
- Asia/Kolkata timezone
- API throttling
- Automated smoke and billing tests
- .env.example and .gitignore

## Local development
1. Copy `.env.example` to `.env`.
2. Set `DJANGO_DEBUG=True` for local work.
3. Create and activate a virtual environment.
4. `pip install -r requirements.txt`
5. `python manage.py migrate`
6. `python manage.py createsuperuser`
7. `python manage.py test`
8. `python manage.py runserver`

## Production checklist
- Generate a strong unique SECRET_KEY.
- Set DJANGO_DEBUG=False.
- Set exact ALLOWED_HOSTS and CSRF_TRUSTED_ORIGINS.
- Use HTTPS.
- Run `python manage.py collectstatic --noinput`.
- Use a managed PostgreSQL database for serious production traffic.
- Configure automated backups, logging, monitoring and error tracking.
- Do not expose payment credentials in frontend JavaScript.

## Important payment note
The current UPI/card screen is a demo UI. For real payments, integrate an approved payment gateway and verify payments server-side using signed webhooks. Never treat a browser-generated transaction ID as proof of payment.
