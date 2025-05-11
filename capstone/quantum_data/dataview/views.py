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

@api_view(['GET'])
def search_efp(request):
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


@api_view(['GET'])
def search_efp_in_col(request):
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

    # Perform a case-insensitive search on the specified column
    filter_kwargs = {f"{column}__icontains": query}
    results = efp.objects.filter(**filter_kwargs)

    serializer = EfpSerializer(results, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def search_efp_advanced(request):
    filters = {}
    for field in [
        'first_name', 'last_name', 'sex', 'email', 'email_2', 'teacher_category',
        'tags', 'phone', 'mobile', 'school_name', 'school_category',
        'industry', 'file_name', 'sheet_name']:
        value = request.GET.get(field, '').strip()
        if value:
            filters[f'{field}__icontains'] = value

    if not filters:
        return Response({'error': 'No valid filters provided'}, status=status.HTTP_400_BAD_REQUEST)

    results = efp.objects.filter(**filters)
    serializer = EfpSerializer(results, many=True)
    return Response(serializer.data)

def efp_database_view(request):
    # Fetch first 5 rows from the database
    data = efp.objects.all()[:5]
    #
    # # Pass the data to the template
    return render(request, 'efp_database.html', {'data': data})

@api_view(['GET'])
def efp_database_api(request):
    data = efp.objects.all()
    serializer = EfpSerializer(data, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
def update_efp(request, pk):
    try:
        obj = efp.objects.get(pk=pk)
    except efp.DoesNotExist:
        return Response({'error': 'Object not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = EfpSerializer(obj, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_efp_bulk(request):
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


@api_view(['DELETE'])
def delete_efp(request, pk): 
    try:
        obj = efp.objects.get(pk=pk)
    except efp.DoesNotExist:
        return Response({'error': 'Object not found'}, status=status.HTTP_404_NOT_FOUND)
    
    obj.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
def delete_efp_bulk(request):
    ids = request.data.get('ids', [])
    
    if not isinstance(ids, list) or not all(isinstance(i, int) for i in ids):
        return Response({'error': 'Invalid ID list'}, status=status.HTTP_400_BAD_REQUEST)

    deleted_count, _ = efp.objects.filter(id__in=ids).delete()

    return Response({'deleted': deleted_count}, status=status.HTTP_200_OK)

@api_view(['POST'])
def create_efp(request):
    serializer = EfpSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED) 
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def create_efp_bulk(request):
    if not isinstance(request.data, list):
        return Response({'error': 'Expected a list of objects'}, status=400)

    serializer = EfpSerializer(data=request.data, many=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


# to save a csv file into database
def upload_csv_view(request):
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
