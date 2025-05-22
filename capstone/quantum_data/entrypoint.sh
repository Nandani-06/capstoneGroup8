#!/bin/sh

# wait for postgres to start
echo "Waiting for postgres..."

while ! nc -z "$DB_HOST" "$DB_PORT"; do
  sleep 1
done

echo "PostgreSQL started"

# make migrations
python manage.py migrate

# create superuser if not exists
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@admin.com', 'admin')" | python manage.py shell

# start the server
exec python manage.py runserver 0.0.0.0:8000
