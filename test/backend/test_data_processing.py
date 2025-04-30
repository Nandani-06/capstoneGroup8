
from django.test import TestCase, Client
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from dataview.models import EfpDatabase
import json

class ApiViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.client = Client()
        self.client.login(username='testuser', password='testpass123')
        
        # Create test data
        self.test_data = EfpDatabase.objects.create(
            first_name="Test",
            last_name="User",
            email="test@example.com",
            teacher_category="Primary",
            school_name="Test School"
        )

    def test_get_data_list(self):
        response = self.client.get('/api/data/')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertTrue(len(data) > 0)

    def test_create_data(self):
        new_data = {
            'first_name': 'New',
            'last_name': 'User',
            'email': 'new@test.com',
            'teacher_category': 'Secondary',
            'school_name': 'New School'
        }
        response = self.client.post('/api/data/', new_data)
        self.assertEqual(response.status_code, 201)
