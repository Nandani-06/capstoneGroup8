from django.shortcuts import render
from .models import EfpDatabase

def efp_database_view(request):
    # Fetch first 5 rows from the database
    try:
        data = EfpDatabase.objects.all()[:5]
    except EfpDatabase.DoesNotExist:
        data = []

    
    # Pass the data to the template
    return render(request, 'quantum_app/efp_database.html', {'data': data})
