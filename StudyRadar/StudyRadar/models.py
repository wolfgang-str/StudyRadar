from django.db import models

class Student(models.Model):
    name = models.CharField(max_length=20)
    grad_year = models.CharField(max_length=4)
    email = models.EmailField(max_length=254)
    phone = models.CharField(max_length=15)
    major = models.CharField(max_length=20)
    
class Course(models.Model):
    name = models.CharField(max_length=20)
    dateTime = models.DateTimeField()
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, null=True)