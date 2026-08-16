from datetime import timedelta

from django.utils import timezone
from rest_framework import serializers

from .models import Drop


EXPIRATIONS = {
    "10m": timedelta(minutes=10),
    "1h": timedelta(hours=1),
    "24h": timedelta(hours=24),
    "7d": timedelta(days=7),
}


class DropSerializer(serializers.ModelSerializer):
    expiration = serializers.ChoiceField(
        choices=tuple(EXPIRATIONS.keys()),
        write_only=True,
    )

    class Meta:
        model = Drop
        fields = [
            "public_id",
            "content",
            "language",
            "expiration",
            "created_at",
            "expires_at",
            "burn_after_reading",
        ]

        read_only_fields = [
            "public_id",
            "created_at",
            "expires_at",
        ]

    def create(self, validated_data):
        expiration = validated_data.pop("expiration")

        validated_data["expires_at"] = timezone.now() + EXPIRATIONS[expiration]

        return super().create(validated_data)
