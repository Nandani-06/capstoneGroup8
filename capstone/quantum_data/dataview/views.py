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

#This view is for testing purpose
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

@api_view(['DELETE'])
def delete_efp(request, pk): 
    try:
        obj = efp.objects.get(pk=pk)
    except efp.DoesNotExist:
        return Response({'error': 'Object not found'}, status=status.HTTP_404_NOT_FOUND)
    
    obj.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

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


# For Workshop table




# GET all workshop entries
@api_view(['GET'])
def workshop_database_api(request):
    data = workshop.objects.all()
    serializer = WorkshopSerializer(data, many=True)
    return Response(serializer.data)


# PUT (update) a workshop entry
@api_view(['PUT'])
def update_workshop(request, pk):
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
    try:
        obj = workshop.objects.get(pk=pk)
    except workshop.DoesNotExist:
        return Response({'error': 'Object not found'}, status=status.HTTP_404_NOT_FOUND)

    obj.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# POST (create) a single workshop entry
@api_view(['POST'])
def create_workshop(request):
    serializer = WorkshopSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# POST bulk create
@api_view(['POST'])
def create_workshop_bulk(request):
    if not isinstance(request.data, list):
        return Response({'error': 'Expected a list of objects'}, status=400)

    serializer = WorkshopSerializer(data=request.data, many=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


# Upload CSV to save to workshop table
# def upload_workshop_csv_view(request):
#     if request.method == 'POST' and request.FILES.get('csv_file'):
#         csv_file = request.FILES['csv_file']
#         csv_file = TextIOWrapper(csv_file.file, encoding='utf-8')
#         csv_reader = csv.DictReader(csv_file)
#
#         for row in csv_reader:
#             workshop.objects.create(
#                 date=row.get('Date') or None,
#                 event=row.get('Event') or None,
#                 event_type=row.get('Event type') or None,
#                 presenters=row.get('presenters') or None,
#                 participants_female=(
#                     int(row['Participants/Female']) if row.get('Participants/Female') else None
#                 ),
#                 schools=(
#                     int(row['Schools']) if row.get('Schools') else None
#                 ),
#                 project=row.get('Project') or None,
#                 comment=row.get('Comment') or None
#             )
#
#         return HttpResponse("Workshop CSV data added to the database.")
#
#     else:
#         form = CSVUploadForm()
#         return render(request, 'upload_csv.html', {'form': form})



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
