#!/bin/sh
set -e

if [ -n "$POSTGRES_HOST" ]; then
    until nc -z "$POSTGRES_HOST" "${POSTGRES_PORT:-5432}"; do
        echo "Waiting for PostgreSQL..."
        sleep 1
    done
fi

python manage.py migrate --noinput

if [ "$DJANGO_COLLECTSTATIC" = "1" ]; then
    python manage.py collectstatic --noinput
fi

exec "$@"
