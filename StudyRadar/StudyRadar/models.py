from django.db import models
from django.contrib.auth.models import User

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # Link to Django's auth_user
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    grad_year = models.CharField(max_length=4)
    email = models.EmailField(max_length=254)
    phone = models.CharField(max_length=15)
    major = models.CharField(max_length=20)

    def __str__(self):
        return self.user.username;
    
class Course(models.Model):
    name = models.CharField(max_length=20)
    dateTime = models.DateTimeField()
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

class StudyGroup(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    description = models.CharField(max_length=255, blank=True)
    subject = models.CharField(max_length=100)
    creator = models.ForeignKey('Student', on_delete=models.CASCADE, related_name="created_groups")
    members = models.ManyToManyField('Student', related_name="study_groups", blank=True) 

    max_members = models.PositiveIntegerField(default=30)
    join_code = models.CharField(max_length=10, unique=True, null=True, blank=True)
