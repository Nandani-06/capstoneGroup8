
from django.test import TestCase, Client 
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from dataview.models import EfpDatabase 
import json

class EfpDatabaseModelTests(TestCase):
    def setUp(self):
        # 创建测试数据
        self.test_entry = EfpDatabase.objects.create(
            first_name="Test",
            last_name="User",
            email="test@example.com",
            teacher_category="Primary",
            school_name="Test School"
        )

    def test_string_representation(self):
        """测试模型的字符串表示"""
        self.assertEqual(str(self.test_entry), "Test User")
        
    def test_fields_content(self):
        """测试字段内容是否正确保存"""
        self.assertEqual(self.test_entry.first_name, "Test")
        self.assertEqual(self.test_entry.last_name, "User")
        self.assertEqual(self.test_entry.email, "test@example.com")
        self.assertEqual(self.test_entry.teacher_category, "Primary")
        self.assertEqual(self.test_entry.school_name, "Test School")

class EfpDatabaseAPITests(APITestCase):
    def setUp(self):
        # 创建测试用户和认证token
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.token = Token.objects.create(user=self.user)
        self.client = Client()
        
        # 创建测试数据
        self.test_entries = []
        for i in range(3):
            entry = EfpDatabase.objects.create(
                first_name=f"Test{i}",
                last_name=f"User{i}",
                email=f"test{i}@example.com",
                teacher_category="Primary",
                school_name=f"School{i}"
            )
            self.test_entries.append(entry)

    def test_api_authentication(self):
        """测试API认证要求"""
        response = self.client.get('/api/efp-database/')
        self.assertEqual(response.status_code, 401)  # 未认证应返回401

        # 添加认证后重试
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        response = self.client.get('/api/efp-database/')
        self.assertEqual(response.status_code, 200)  # 认证后应返回200

    def test_api_list_entries(self):
        """测试获取数据列表"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        response = self.client.get('/api/efp-database/')
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(len(data), len(self.test_entries))

    def test_api_create_entry(self):
        """测试创建新数据"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        new_entry_data = {
            'first_name': 'New',
            'last_name': 'User',
            'email': 'new@example.com',
            'teacher_category': 'Secondary',
            'school_name': 'New School'
        }
        
        response = self.client.post('/api/efp-database/', new_entry_data)
        self.assertEqual(response.status_code, 201)  # 创建成功应返回201
        
        # 验证数据已被创建
        created_entry = EfpDatabase.objects.get(email='new@example.com')
        self.assertEqual(created_entry.first_name, 'New')
        self.assertEqual(created_entry.school_name, 'New School')
