from django.urls import path

from .views import DropCreateView, DropRetrieveView


urlpatterns = [
    path(
        "drops/",
        DropCreateView.as_view(),
        name="drop-create",
    ),
    path(
        "drops/<str:public_id>/",
        DropRetrieveView.as_view(),
        name="drop-detail",
    ),
]