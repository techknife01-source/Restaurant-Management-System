# Restro — Merged Restaurant Website

This project combines the Restro menu/checkout frontend with the Django REST backend.

## Run
1. Python 3.13 recommended.
2. `python -m venv .venv`
3. Activate the environment.
4. `pip install -r requirements.txt`
5. `python manage.py migrate`
6. `python manage.py runserver`
7. Open http://127.0.0.1:8000/

## Main pages
- `/` — booking page
- `/menu/` — customer menu
- `/checkout/` — cart and checkout
- `/records/` — restaurant records
- `/admin/` — Django admin
- `/api/bookings/`, `/api/orders/`, `/api/bills/` — REST APIs

The frontend stores the cart in browser localStorage; completed checkout attempts are sent to the Django APIs so bookings and order items are persisted in SQLite.
