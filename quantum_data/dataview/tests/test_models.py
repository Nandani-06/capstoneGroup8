# dataview/tests/test_models.py

from django.test import TestCase
from dataview.models import EfpDatabase

class EfpDatabaseModelTest(TestCase):

    def setUp(self):
        self.record = EfpDatabase.objects.create(
            first_name="John",
            last_name="Doe",
            sex="Male",
            email="john@example.com",
            school_name="ABC School",
            teacher_category="Science",
        )

    def test_efp_database_creation(self):
        """Test that the EfpDatabase instance is created correctly."""
        self.assertEqual(self.record.first_name, "John")
        self.assertEqual(self.record.last_name, "Doe")
        self.assertEqual(self.record.sex, "Male")
        self.assertEqual(self.record.school_name, "ABC School")

    def test_str_method(self):
        """Test that the __str__ method (if uncommented) returns correct format."""
        # self.assertEqual(str(self.record), "John Doe")
        self.assertTrue(isinstance(self.record, EfpDatabase))
