from django.shortcuts import render
from django.http import HttpResponse

def efp_database_view(request):
    # Fetch first 5 rows from the database
    data = efp.objects.all()[:5]
    #
    # # Pass the data to the template
    return render(request, 'efp_database.html', {'data': data})
#     try:
#         # Attempt to interact with the table to ensure it exists
#         from .models import efp
#         # You could run a query to check if the table exists or just return a success message
#         # For simplicity, we assume table creation is successful
#         return HttpResponse("Table 'efp' has been created successfully!")
#     except Exception as e:
#         # If an error occurs (e.g., table does not exist), return a failure message
#         return HttpResponse(f"Error: {str(e)}")


import csv
from io import TextIOWrapper
from django.shortcuts import render
from django.http import HttpResponse
from .forms import CSVUploadForm
from .models import efp


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
