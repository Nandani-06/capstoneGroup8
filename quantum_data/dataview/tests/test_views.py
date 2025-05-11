# dataview/tests/test_views.py

from django.test import TestCase, Client
from django.urls import reverse
from dataview.models import EfpDatabase
import json

class EfpDatabaseAPITest(TestCase):
    def setUp(self):
        self.client = Client()
        # Create 6 test data (for testing, a maximum of 5 data can be returned)
        for i in range(6):
            EfpDatabase.objects.create(
                first_name=f"First{i}",
                last_name=f"Last{i}",
                email=f"user{i}@example.com",
                school_name="Test School"
            )

    def test_efp_database_api_returns_200(self):
        url = reverse("efp_database_api")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_efp_database_api_returns_json_with_data(self):
        url = reverse("efp_database_api")
        response = self.client.get(url)
        self.assertEqual(response["Content-Type"], "application/json")

        json_data = json.loads(response.content)
        self.assertIn("data", json_data)
        self.assertEqual(len(json_data["data"]), 5)  # Only the first 5 records should be returned

        sample = json_data["data"][0]
        self.assertIn("first_name", sample)
        self.assertIn("last_name", sample)
        self.assertIn("email", sample)
