from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response

from .models import Drop
from .serializers import DropSerializer


class DropCreateView(generics.CreateAPIView):
    queryset = Drop.objects.all()
    serializer_class = DropSerializer

    def get_queryset(self):
        Drop.objects.filter(expires_at__lte=timezone.now()).delete()
        return super().get_queryset()


class DropRetrieveView(generics.RetrieveAPIView):
    queryset = Drop.objects.all()
    serializer_class = DropSerializer
    lookup_field = "public_id"

    def get_queryset(self):
        Drop.objects.filter(expires_at__lte=timezone.now()).delete()
        return super().get_queryset()

    def retrieve(self, request, *args, **kwargs):
        drop = self.get_object()

        if drop.expires_at <= timezone.now():
            drop.delete()

            return Response(
                {"detail": "This drop has expired."},
                status=status.HTTP_410_GONE,
            )

        data = self.get_serializer(drop).data

        if drop.burn_after_reading:
            drop.delete()

        return Response(data)
