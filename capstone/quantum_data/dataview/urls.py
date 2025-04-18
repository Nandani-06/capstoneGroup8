from django.urls import path
from . import views

# URL patterns for routing requests to views in this app
urlpatterns = [
    # Route the base URL to the 'efp_database_view' view
    path('view/', views.efp_database_view, name='efp_database'),
    path('upload-csv/', views.upload_csv_view, name='upload_csv'),
    path('api/efp/', views.efp_database_api, name='efp_database_api'),
    path('api/efp/<int:pk>/', views.update_efp, name='update_efp'),

]
