from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.utils.crypto import get_random_string
from django.contrib.auth.models import User 
from django.db import IntegrityError
from StudyRadar.models import Student, StudyGroup
import json
import traceback

# Login API
@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    def post(self, request):
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")

            if not username or not password:
                return JsonResponse({"message": "Missing username or password"}, status=400)

            user = authenticate(username=username, password=password)

            if user:
                refresh = RefreshToken.for_user(user)
                student = Student.objects.get(user=user)
        
                return JsonResponse({
                    "message": "Login successful",
                    "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh),
                    "first_name": student.first_name,
                }, status=200)
            else:
                return JsonResponse({"message": "Invalid credentials"}, status=401)

        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON format"}, status=400)

        except Exception as e:
            return JsonResponse({"message": f"Server error: {str(e)}"}, status=500)
        

# Register API
@method_decorator(csrf_exempt, name='dispatch')
class SignupView(APIView):
    def post(self, request):
        try:
            # Parse JSON data from request
            data = json.loads(request.body)

            # Extract fields from request
            username = data.get("username")
            password = data.get("password")
            email = data.get("email")
            first_name = data.get("first_name")  
            last_name = data.get("last_name")  
            grad_year = data.get("grad_year")
            phone = data.get("phone")
            major = data.get("major")

            # Validate required fields
            if not username or not password or not email or not first_name or not last_name:
                return JsonResponse({"message": "Missing required fields"}, status=400)

            if User.objects.filter(username=username).exists():
                return JsonResponse({"message": "Username already exists"}, status=400)

            # Create a new user in Django's auth system
            user = User.objects.create_user(username=username, password=password, email=email, first_name=first_name, last_name=last_name)

            # Create a linked Student profile
            Student.objects.create(
                user=user,
                first_name=first_name,
                last_name=last_name,
                email=email,
                grad_year=grad_year,
                phone=phone,
                major=major
            )

            return JsonResponse({"message": "Signup successful"}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON format"}, status=400)

        except Exception as e:
            return JsonResponse({"message": f"Server error: {str(e)}"}, status=500)

class DashboardView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            student = Student.objects.get(user=request.user)
            # print(f"Fetching groups for student: {student.user.username}")  # Debugging

            groups = student.study_groups.all().values(
                "id", "name", "description", "subject", "max_members", "join_code"
            )

            study_groups_list = []
            for group in groups:
                try:
                    group_obj = StudyGroup.objects.get(id=group["id"])
                    members = group_obj.members.all().values("id", "first_name", "last_name")
                    group["members"] = list(members)
                    study_groups_list.append(group)
                except StudyGroup.DoesNotExist:
                    print(f"Study Group ID {group['id']} not found!")

            # print(f"Groups fetched successfully: {study_groups_list}") # Debugging

            return JsonResponse({ 
                "message": f"Welcome, {student.first_name}!",
                "study_groups": study_groups_list
            }, status=200)

        except Student.DoesNotExist:
            print("Student profile not found!")
            return JsonResponse({"message": "Student profile not found"}, status=404)

        except Exception as e:
            print(f"Unexpected Error in DashboardView: {str(e)}")
            return JsonResponse({"message": f"Unexpected error: {str(e)}"}, status=500)

@method_decorator(csrf_exempt, name='dispatch')  # Disable CSRF for this view
class CreateGroupView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            data = request.data
            student = Student.objects.get(user=request.user)

            name = data.get("name")
            description = data.get("description", "")
            subject = data.get("subject")
            max_members = data.get("max_members", 30)

            if not name or not subject:
                return Response({"message": "Name and subject are required"}, status=400)

            if StudyGroup.objects.filter(name=name).exists():
                return Response({"message": "A study group with this name already exists"}, status=400)

            # Generate a unique join code
            join_code = get_random_string(length=8)
            max_attempts = 5
            attempts = 0

            while StudyGroup.objects.filter(join_code=join_code).exists() and attempts < max_attempts:
                join_code = get_random_string(length=8)
                attempts += 1

            if attempts == max_attempts:
                return Response({"message": "Could not generate a unique join code. Try again."}, status=500)

            # Create the study group
            group = StudyGroup.objects.create(
                name=name,
                description=description,
                subject=subject,
                creator=student,
                max_members=max_members,
                join_code=join_code  
            )

            # Ensure the creator is also a member
            group.members.add(student)  # Add creator to members
            group.save()

            
            return Response({
                "message": "Study group created successfully",
                "group": {
                    "id": group.id,
                    "name": group.name,
                    "description": group.description,
                    "subject": group.subject,
                    "max_members": group.max_members,
                    "join_code": group.join_code  
                }
            }, status=201)

        except Student.DoesNotExist:
            return Response({"message": "Student profile not found"}, status=404)
        except IntegrityError:
            return Response({"message": "Database error: Could not create study group."}, status=500)
        except Exception as e:
            return Response({"message": f"Unexpected error: {str(e)}"}, status=500)
            
class AboutusView(APIView):
    def post(self, request):
        return 


class UserProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            student = Student.objects.get(user=request.user)

            return Response({
                "username": request.user.username,
                "firstName": student.first_name,
                "lastName": student.last_name,
                "email": student.email,
                "phone": student.phone,
                "gradYear": student.grad_year,
                "major": student.major,
            }, status=status.HTTP_200_OK)

        except Student.DoesNotExist:
            return Response({"message": "Student profile not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": f"Unexpected error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request):
        try:
            student = Student.objects.get(user=request.user)
            data = request.data

            student.first_name = data.get("firstName", student.first_name)
            student.last_name = data.get("lastName", student.last_name)
            student.email = data.get("email", student.email)
            student.phone = data.get("phone", student.phone)
            student.grad_year = data.get("gradYear", student.grad_year)
            student.major = data.get("major", student.major)
            student.save()

            # Update Django's User model email (if changed)
            request.user.email = student.email
            request.user.save()

            return Response({"message": "Profile updated successfully!"}, status=status.HTTP_200_OK)

        except Student.DoesNotExist:
            return Response({"message": "Student profile not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": f"Unexpected error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)