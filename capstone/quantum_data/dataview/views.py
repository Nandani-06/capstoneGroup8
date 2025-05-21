import csv
from io import TextIOWrapper
from .forms import CSVUploadForm
from .models import efp
from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import EfpSerializer
from rest_framework import status
from .models import workshop
from .serializers import WorkshopSerializer  # Make sure this serializer exists
from dateutil import parser
from datetime import datetime

# Search EFP records by a general query across all fields (?q=...)
@api_view(['GET'])
def search_efp(request):
    """
    GET /api/search-efp/?q=<query>
    Search EFP records by a general query across all fields.
    - Query Parameters:
        - q (string, required): The search term.
    - Returns: List of matching EFP records (JSON).
    """
    query = request.GET.get('q', '')  # Get the search query from the request
    if not query:
        return Response({'error': 'No search query provided'}, status=status.HTTP_400_BAD_REQUEST)

    # Perform a case-insensitive search on relevant fields
    results = efp.objects.filter(
        first_name__icontains=query
    ) | efp.objects.filter(
        last_name__icontains=query
    ) | efp.objects.filter(
        email__icontains=query
    ) | efp.objects.filter(
        email_2__icontains=query
    ) | efp.objects.filter(
        teacher_category__icontains=query
    ) | efp.objects.filter(
        tags__icontains=query
    ) | efp.objects.filter(
        phone__icontains=query
    ) | efp.objects.filter(
        mobile__icontains=query
    ) | efp.objects.filter(
        school_name__icontains=query
    ) | efp.objects.filter(
        school_category__icontains=query
    ) | efp.objects.filter(
        industry__icontains=query
    ) | efp.objects.filter(
        file_name__icontains=query
    ) | efp.objects.filter(
        sheet_name__icontains=query
    ) | efp.objects.filter(
        sex__icontains=query
    )

    serializer = EfpSerializer(results, many=True)
    return Response(serializer.data)


# Search EFP records by a query in a specific column (?q=...&col=...)
@api_view(['GET'])
def search_efp_in_col(request):
    """
    GET /api/search-efp-in-col/?q=<query>&col=<column>
    Search EFP records by a query in a specific column.
    - Query Parameters:
        - q (string, required): The search term.
        - col (string, required): The column to search in.
    - Returns: List of matching EFP records (JSON).
    """
    query = request.GET.get('q', '')  # Get the search query from the request
    column = request.GET.get('col', '')  # Get the column name from the request

    if not query:
        return Response({'error': 'No search query provided'}, status=status.HTTP_400_BAD_REQUEST)

    if not column:
        return Response({'error': 'No column specified'}, status=status.HTTP_400_BAD_REQUEST)

    # Validate the column name to prevent SQL injection
    valid_columns = ['first_name', 'last_name', 'email', 'sex', 'school_name', 'email',
                     'email_2', 'teacher_category', 'tags', 'phone', 'mobile', 
                     'school_category', 'industry', 'file_name', 'sheet_name']
    if column not in valid_columns:
        return Response({'error': f'Invalid column: {column}'}, status=status.HTTP_400_BAD_REQUEST)

    # Use iexact for sex, icontains for others
    if column == 'sex':
        filter_kwargs = {f"{column}__iexact": query}
    else:
        # Perform a case-insensitive search on the specified column
        filter_kwargs = {f"{column}__icontains": query}
    
    results = efp.objects.filter(**filter_kwargs)

    serializer = EfpSerializer(results, many=True)
    return Response(serializer.data)


# Advanced search with multiple filters (AND logic) using query params for each field
@api_view(['GET'])
def search_efp_advanced(request):
    """
    GET /api/search-efp-advanced/?<field1>=<value1>&<field2>=<value2>...
    Advanced search with multiple filters (AND logic).
    - Query Parameters: Any EFP field (first_name, last_name, sex, email, etc.)
    - Returns: List of matching EFP records (JSON).
    """
    filters = {}
    for field in [
        'first_name', 'last_name', 'sex', 'email', 'email_2', 'teacher_category',
        'tags', 'phone', 'mobile', 'school_name', 'school_category',
        'industry', 'file_name', 'sheet_name']:
        value = request.GET.get(field, '').strip()
        if value:
            if field == 'sex':
                filters[f'{field}__iexact'] = value
            else:
                filters[f'{field}__icontains'] = value

    if not filters:
        return Response({'error': 'No valid filters provided'}, status=status.HTTP_400_BAD_REQUEST)

    results = efp.objects.filter(**filters)
    serializer = EfpSerializer(results, many=True)
    return Response(serializer.data)

# Render the first 5 EFP records in an HTML template
def efp_database_view(request):
    """
    Render the first 5 EFP records in an HTML template.
    """
    # Fetch first 5 rows from the database
    data = efp.objects.all()[:5]
    #
    # # Pass the data to the template
    return render(request, 'efp_database.html', {'data': data})

# Get all EFP records as JSON
@api_view(['GET'])
def efp_database_api(request):
    """
    GET /api/efp-database/
    Get all EFP records.
    - Returns: List of all EFP records (JSON).
    """
    data = efp.objects.all()
    serializer = EfpSerializer(data, many=True)
    return Response(serializer.data)

# Update a single EFP record by primary key
@api_view(['PUT'])
def update_efp(request, pk):
    """
    PUT /api/update-efp/<pk>/
    Update a single EFP record by primary key.
    - Body: JSON object with updated fields.
    - Returns: Updated EFP record (JSON).
    """
    try:
        obj = efp.objects.get(pk=pk)
    except efp.DoesNotExist:
        return Response({'error': 'Object not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = EfpSerializer(obj, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Bulk update EFP records. Expects a list of objects with 'id' and fields to update
@api_view(['PUT'])
def update_efp_bulk(request):
    """
    PUT /api/update-efp-bulk/
    Bulk update EFP records.
    - Body: List of JSON objects, each with 'id' and fields to update.
    - Returns: List of updated records and errors (JSON).
    """
    if not isinstance(request.data, list):
        return Response({'error': 'Expected a list of objects'}, status=status.HTTP_400_BAD_REQUEST)

    updated_objects = []
    errors = []

    for entry in request.data:
        pk = entry.get('id')
        if not pk:
            errors.append({'error': 'Missing id in entry', 'entry': entry})
            continue

        try:
            obj = efp.objects.get(pk=pk)
        except efp.DoesNotExist:
            errors.append({'error': f'Object with id {pk} not found'})
            continue

        serializer = EfpSerializer(obj, data=entry, partial=True)
        if serializer.is_valid():
            serializer.save()
            updated_objects.append(serializer.data)
        else:
            errors.append({'id': pk, 'errors': serializer.errors})

    return Response({'updated': updated_objects, 'errors': errors}, status=status.HTTP_207_MULTI_STATUS)


# Delete a single EFP record by primary key
@api_view(['DELETE'])
def delete_efp(request, pk): 
    """
    DELETE /api/delete-efp/<pk>/
    Delete a single EFP record by primary key.
    - Returns: 204 No Content.
    """
    try:
        obj = efp.objects.get(pk=pk)
    except efp.DoesNotExist:
        return Response({'error': 'Object not found'}, status=status.HTTP_404_NOT_FOUND)
    
    obj.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# Bulk delete EFP records. Expects { "ids": [int, ...] } in request body
@api_view(['POST'])
def delete_efp_bulk(request):
    """
    POST /api/delete-efp-bulk/
    Bulk delete EFP records.
    - Body: { "ids": [int, ...] }
    - Returns: { "deleted": count }
    """
    ids = request.data.get('ids', [])
    
    if not isinstance(ids, list) or not all(isinstance(i, int) for i in ids):
        return Response({'error': 'Invalid ID list'}, status=status.HTTP_400_BAD_REQUEST)

    deleted_count, _ = efp.objects.filter(id__in=ids).delete()

    return Response({'deleted': deleted_count}, status=status.HTTP_200_OK)


# Create a new EFP record. Expects JSON object with EFP fields
@api_view(['POST'])
def create_efp(request):
    """
    POST /api/create-efp/
    Create a new EFP record.
    - Body: JSON object with EFP fields.
    - Returns: Created EFP record (JSON).
    """
    serializer = EfpSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED) 
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Bulk create EFP records. Expects a list of JSON objects with EFP fields
@api_view(['POST'])
def create_efp_bulk(request):
    """
    POST /api/create-efp-bulk/
    Bulk create EFP records.
    - Body: List of JSON objects with EFP fields.
    - Returns: List of created records (JSON).
    """
    if not isinstance(request.data, list):
        return Response({'error': 'Expected a list of objects'}, status=400)

    serializer = EfpSerializer(data=request.data, many=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


# to save a csv file into database
def upload_csv_view(request):
    """
    POST /api/upload-csv/
    Upload a CSV file to add EFP records.
    - Form Data: csv_file (file)
    - Returns: Success message (HTML).
    """
    if request.method == 'POST' and request.FILES['csv_file']:
        csv_file = request.FILES['csv_file']
        # If needed, wrap the file to handle the encoding correctly
        csv_file = TextIOWrapper(csv_file.file, encoding='utf-8')

        # Read the CSV file
        csv_reader = csv.DictReader(csv_file)

        # Process each row and insert into the database
        for row in csv_reader:
            efp.objects.create(
                first_name=row['first_name'],
                last_name=row['last_name'],
                sex=row['sex'],
                email=row['email'],
                email_2=row['email_2'],
                teacher_category=row['teacher_category'],
                tags=row['tags'],
                phone=row['phone'],
                mobile=row['mobile'],
                school_name=row['school_name'],
                school_category=row['school_category'],
                industry=row['industry'],
                file_name=row['file_name'],
                sheet_name=row['sheet_name']
            )

        return HttpResponse("CSV Data has been added to the table.")

    else:
        # Show the form to upload CSV
        form = CSVUploadForm()
        return render(request, 'upload_csv.html', {'form': form})


# GET all workshop entries for Workshop table
@api_view(['GET'])
def workshop_database_api(request):
    """
    GET /api/workshop-database/
    Get all workshop records.
    - Returns: List of workshop records (JSON).
    """
    data = workshop.objects.all()
    serializer = WorkshopSerializer(data, many=True)
    return Response(serializer.data)


# PUT (update) a workshop entry
@api_view(['PUT'])
def update_workshop(request, pk):
    """
    PUT /api/update-workshop/<pk>/
    Update a single workshop record by primary key.
    - Body: JSON object with updated fields.
    - Returns: Updated workshop record (JSON).
    """
    try:
        obj = workshop.objects.get(pk=pk)
    except workshop.DoesNotExist:
        return Response({'error': 'Object not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = WorkshopSerializer(obj, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# DELETE a workshop entry
@api_view(['DELETE'])
def delete_workshop(request, pk):
    """
    DELETE /api/delete-workshop/<pk>/
    Delete a single workshop record by primary key.
    - Returns: 204 No Content.
    """
    try:
        obj = workshop.objects.get(pk=pk)
    except workshop.DoesNotExist:
        return Response({'error': 'Object not found'}, status=status.HTTP_404_NOT_FOUND)

    obj.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# POST (create) a single workshop entry
@api_view(['POST'])
def create_workshop(request):
    """
    POST /api/create-workshop/
    Create a new workshop record.
    - Body: JSON object with workshop fields.
    - Returns: Created workshop record (JSON).
    """
    serializer = WorkshopSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# POST bulk create
@api_view(['POST'])
def create_workshop_bulk(request):
    """
    POST /api/create-workshop-bulk/
    Bulk create workshop records.
    - Body: List of JSON objects with workshop fields.
    - Returns: List of created records (JSON).
    """
    if not isinstance(request.data, list):
        return Response({'error': 'Expected a list of objects'}, status=400)

    serializer = WorkshopSerializer(data=request.data, many=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


def parse_date_safe(date_str):
    try:
        # Ignore range-style or obviously bad entries
        if not date_str or '-' in date_str and '/' in date_str:
            return None
        # Try to parse normally
        return parser.parse(date_str, dayfirst=True).date()
    except Exception:
        return None

def safe_int(value):
    try:
        return int(value)
    except (TypeError, ValueError):
        return None

def upload_workshop_csv_view(request):
    """
    POST /api/upload-workshop-csv/
    Upload a CSV file to add workshop records.
    - Form Data: csv_file (file)
    - Returns: Success message (HTML).
    """
    if request.method == 'POST' and request.FILES.get('csv_file'):
        csv_file = request.FILES['csv_file']
        csv_file = TextIOWrapper(csv_file.file, encoding='utf-8')
        csv_reader = csv.DictReader(csv_file)

        for row in csv_reader:
            workshop.objects.create(
                date=parse_date_safe(row.get('Date')),
                event=row.get('Event') or None,
                event_type=row.get('Event type') or None,
                presenters=row.get('presenters') or None,
                participants_female=safe_int(row.get('Participants/Female')),
                schools=safe_int(row.get('Schools')),
                project=row.get('Project') or None,
                comment=row.get('Comment') or None
            )

        return HttpResponse("Workshop CSV data added to the database.")
    else:
        form = CSVUploadForm()
        return render(request, 'upload_csv.html', {'form': form})
