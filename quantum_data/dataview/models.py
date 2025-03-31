from django.db import models

class EfpDatabase(models.Model):
    id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=255, null=True, blank=True)
    last_name = models.CharField(max_length=255, null=True, blank=True)
    sex = models.CharField(max_length=50, null=True, blank=True)
    email = models.CharField(max_length=255, null=True, blank=True)
    email_2 = models.CharField(max_length=255, null=True, blank=True)
    teacher_category = models.CharField(max_length=255, null=True, blank=True)
    tags = models.TextField(null=True, blank=True)
    phone = models.CharField(max_length=50, null=True, blank=True)
    mobile = models.CharField(max_length=50, null=True, blank=True)
    school_name = models.CharField(max_length=255, null=True, blank=True)
    school_category = models.CharField(max_length=255, null=True, blank=True)
    industry = models.CharField(max_length=255, null=True, blank=True)
    file_name = models.CharField(max_length=255, null=True, blank=True)
    sheet_name = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'public.EfpDatabase'  # Explicitly define schema
        managed = False  # Prevent Django from modifying the table
        app_label = 'dataview'

    # def __str__(self):
    #     return f"{self.first_name} {self.last_name}"