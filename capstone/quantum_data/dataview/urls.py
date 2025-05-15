from django.urls import path
from . import views

# URL patterns for routing requests to views in this app
urlpatterns = [
    # Route the base URL to the 'efp_database_view' view
    path('view/', views.efp_database_view, name='efp_database'),
    path('upload-csv/', views.upload_csv_view, name='upload_csv'),
    path('api/efp/', views.efp_database_api, name='efp_database_api'),
    path('api/efp/update/<int:pk>', views.update_efp, name='update_efp'),
    path('api/efp/delete/<int:pk>', views.delete_efp, name='delete_efp'),
    path('api/efp/create/', views.create_efp, name='create_efp'),
    path('api/search-efp', views.search_efp, name='search_efp'),
    path('api/search-efpincol', views.search_efp_in_col, name='search_efp_in_col'),
    path('api/efp/bulk/', views.create_efp_bulk, name='efp-bulk-create'),

    path('api/workshops/', views.workshop_database_api, name='workshop_list_api'),
    path('api/workshops/create/', views.create_workshop, name='create_workshop_api'),
    path('api/workshops/create-bulk/', views.create_workshop_bulk, name='create_workshop_bulk_api'),
    path('api/workshops/<int:pk>/update/', views.update_workshop, name='update_workshop_api'),
    path('api/workshops/<int:pk>/delete/', views.delete_workshop, name='delete_workshop_api'),
    path('upload-workshop-csv/', views.upload_workshop_csv_view, name='upload_workshop_csv'),


]
