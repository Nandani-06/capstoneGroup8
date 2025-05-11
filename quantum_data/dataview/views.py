from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from .models import EfpDatabase

@csrf_exempt
def efp_database_api(request):
    # Fetch first 5 rows from the database
    try:
        data = list(EfpDatabase.objects.values()[:5])
    except EfpDatabase.DoesNotExist:
        data = []

    # Return JSON response
    return JsonResponse({'data': data})