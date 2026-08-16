import secrets

from django.db import models


def generate_public_id():
    return secrets.token_urlsafe(6)


class Drop(models.Model):
    public_id = models.CharField(
        max_length=16,
        unique=True,
        default=generate_public_id,
        editable=False,
    )

    content = models.TextField()
    language = models.CharField(
        max_length=50,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    expires_at = models.DateTimeField()

    burn_after_reading = models.BooleanField(
        default=False,
    )

    def save(self, *args, **kwargs):
        if self._state.adding and not self.public_id:
            self.public_id = generate_public_id()

        while (
            Drop.objects.filter(public_id=self.public_id).exclude(pk=self.pk).exists()
        ):
            self.public_id = generate_public_id()

        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return str(self.public_id)
