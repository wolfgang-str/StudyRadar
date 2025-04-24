from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User
from .models import Student, StudyGroup, Event
import json

class CreateGroupViewTests(TestCase):
    
    def setUp(self):
        # Set up a user and student profile
        self.user = User.objects.create_user(username='testuser', password='password')
        self.student = Student.objects.create(user=self.user)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
    
    def test_create_group_success(self):
        url = '/api/create-group/'  # Adjust to actual URL
        data = {
            'name': 'Study Group 1',
            'subject': 'Math',
            'description': 'Math study group.',
            'max_members': 30,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(StudyGroup.objects.count(), 1)
    
    def test_create_group_missing_name(self):
        url = '/api/create-group/'
        data = {'subject': 'Math'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['message'], 'Name is required')
    
    def test_create_group_name_exists(self):
        StudyGroup.objects.create(name='Study Group 1', subject='Math', creator=self.student)
        url = '/api/create-group/'
        data = {'name': 'Study Group 1', 'subject': 'Math'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['message'], 'A study group with this name already exists')
    
    def test_create_group_student_not_found(self):
        self.user.delete()  # Deleting the user will cause the student to not exist
        url = '/api/create-group/'
        data = {'name': 'Study Group 2', 'subject': 'Science'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class UserProfileViewTests(TestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password')
        self.student = Student.objects.create(user=self.user)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
    
    def test_get_profile_success(self):
        url = '/api/profile/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user.username)
    
    def test_put_profile_update(self):
        url = '/api/profile/'
        data = {
            'firstName': 'John',
            'lastName': 'Doe',
            'email': 'john.doe@example.com',
            'phone': '1234567890',
            'gradYear': '2025',
            'major': 'Computer Science',
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.student.refresh_from_db()  # Refresh to get updated data
        self.assertEqual(self.student.first_name, 'John')
        self.assertEqual(self.student.last_name, 'Doe')
    
    def test_get_profile_student_not_found(self):
        self.user.delete()
        url = '/api/profile/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class GroupDetailViewTests(TestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password')
        self.student = Student.objects.create(user=self.user)
        self.group = StudyGroup.objects.create(name='Study Group 1', subject='Math', creator=self.student)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
    
    def test_get_group_detail(self):
        url = f'/api/groups/{self.group.id}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Study Group 1')
    
    def test_post_join_group_success(self):
        url = f'/api/groups/{self.group.id}/'
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(self.group.members.filter(id=self.student.id).exists())
    
    def test_post_join_group_already_member(self):
        self.group.members.add(self.student)
        url = f'/api/groups/{self.group.id}/'
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['message'], 'You are already a member of this group')


class StudyGroupSearchViewTests(TestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password')
        self.student = Student.objects.create(user=self.user)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        # Create some study groups
        StudyGroup.objects.create(name="Math Study Group", subject="Math", creator=self.student)
        StudyGroup.objects.create(name="Science Study Group", subject="Science", creator=self.student)
    
    def test_search_groups_success(self):
        url = '/api/search-groups/?q=math'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['name'], 'Math Study Group')


class EventCreateViewTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password')
        self.student = Student.objects.create(user=self.user)
        self.group = StudyGroup.objects.create(name="Study Group 1", subject="Math", creator=self.student)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_create_event_success(self):
        url = f'/api/groups/{self.group.id}/create-event/'
        data = {
            'name': 'Math Quiz',
            'description': 'A fun math quiz event.',
            'date': '2025-12-12',
            'time': '15:00',
            'location': 'Room 101',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Event.objects.count(), 1)
    
    def test_create_event_not_group_member(self):
        new_user = User.objects.create_user(username='newuser', password='password')
        new_student = Student.objects.create(user=new_user)
        self.client.force_authenticate(user=new_user)
        url = f'/api/groups/{self.group.id}/create-event/'
        data = {
            'name': 'Math Quiz',
            'description': 'A fun math quiz event.',
            'date': '2025-12-12',
            'time': '15:00',
            'location': 'Room 101',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data['message'], 'Only group members can create events.')
    
    def test_create_event_invalid_data(self):
        url = f'/api/groups/{self.group.id}/create-event/'
        data = {
            'name': '',  # Invalid name
            'date': '2025-12-12',
            'time': '15:00',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data)

