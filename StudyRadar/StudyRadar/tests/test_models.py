from django.test import TestCase
from django.contrib.auth.models import User
from StudyRadar.models import Student, Course, StudyGroup, Event
from datetime import datetime, date, time

class ModelTests(TestCase):
    def setUp(self):
        # Create a user
        self.user = User.objects.create_user(username='johndoe', password='testpass123')
        self.student = Student.objects.create(
            user=self.user,
            first_name='John',
            last_name='Doe',
            grad_year='2025',
            email='john@example.com',
            phone='1234567890',
            major='Computer Science'
        )

    def test_student_str(self):
        self.assertEqual(str(self.student), self.user.username)

    def test_create_course(self):
        course = Course.objects.create(name='Math 101', dateTime=datetime.now(), user_id=self.user)
        self.assertEqual(course.name, 'Math 101')
        self.assertEqual(course.user_id, self.user)

    def test_create_study_group(self):
        group = StudyGroup.objects.create(
            name='CS Study Buddies',
            description='Group for CS majors',
            subject='CS',
            creator=self.student,
            join_code='JOIN123'
        )
        group.members.add(self.student)
        self.assertEqual(group.creator, self.student)
        self.assertIn(self.student, group.members.all())

    def test_study_group_max_members_default(self):
        group = StudyGroup.objects.create(
            name='Physics Group',
            creator=self.student,
            join_code='PHYS123'
        )
        self.assertEqual(group.max_members, 30)

    def test_event_creation(self):
        group = StudyGroup.objects.create(
            name='Chemistry Crew',
            creator=self.student,
            join_code='CHEM321'
        )
        event = Event.objects.create(
            group=group,
            name='Study Session',
            description='Review for midterm',
            date=date.today(),
            time=time(15, 0),
            location='Library Room 1'
        )
        self.assertEqual(event.group, group)
        self.assertEqual(event.name, 'Study Session')
        self.assertIsNotNone(event.created_at)

