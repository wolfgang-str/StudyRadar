from django.db import models
from django.contrib.auth.models import User

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # ✅ Link to Django's auth_user
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