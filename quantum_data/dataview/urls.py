from django.urls import path
# from .views import efp_database_view
from rest_framework.authtoken import views
from .views import efp_database_api


# URL patterns for the dataview app
urlpatterns = [
    # EFP Database view
    # path('efp-database/', efp_database_view, name='efp_database'),

    # Token authentication
    path('token-auth/', views.obtain_auth_token),
    
    # EFP Database view for API
    path('api/efp-database/', efp_database_api, name='efp_database_api'),
]