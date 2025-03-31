from django.urls import path
from .views import efp_database_view

# URL patterns for routing requests to views in this app
urlpatterns = [
    # Route the base URL to the 'efp_database_view' view
    path('', efp_database_view, name='efp_database'),
]
