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
