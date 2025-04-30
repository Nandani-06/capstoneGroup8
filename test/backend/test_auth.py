
from django.test import TestCase, Client
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.token = Token.objects.create(user=self.user)

    def test_login_success(self):
        response = self.client.post('/token-auth/', {
            'username': 'testuser',
            'password': 'testpass123'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn('token', response.json())

    def test_login_failure(self):
        response = self.client.post('/token-auth/', {
            'username': 'testuser',
            'password': 'wrongpass'
        })
        self.assertEqual(response.status_code, 400)

    def test_protected_route_access(self):
        # Without token
        response = self.client.get('/api/data/')
        self.assertEqual(response.status_code, 401)

        # With token
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        response = self.client.get('/api/data/')
        self.assertEqual(response.status_code, 200)
