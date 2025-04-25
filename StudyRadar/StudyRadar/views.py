from django.contrib.auth import authenticate    
from django.db.models import Q
from collections import Counter
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
from django.shortcuts import get_object_or_404
from django.db import IntegrityError
from StudyRadar.models import Student, StudyGroup, Event
import json

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

            # Get joined groups
            joined_groups = student.study_groups.all()
            joined_ids = joined_groups.values_list("id", flat=True)

            study_groups_list = []
            joined_keywords = []

            for group in joined_groups:
                text = f"{group.name} {group.description or ''}".lower()
                joined_keywords.extend(text.split())

                study_groups_list.append({
                    "id": group.id,
                    "name": group.name,
                    "description": group.description,
                    "subject": group.subject,
                    "max_members": group.max_members,
                    "join_code": group.join_code,
                })

            # Remove very short or common words 
            joined_keywords = [word for word in joined_keywords if len(word) > 2]
            keyword_freq = Counter(joined_keywords)

            # Get unjoined groups
            unjoined_groups = StudyGroup.objects.exclude(id__in=joined_ids)
            recommendation_list = []

            for group in unjoined_groups:
                text = f"{group.name} {group.description or ''}".lower()
                group_keywords = [word for word in text.split() if len(word) > 2]
                score = sum(keyword_freq.get(word, 0) for word in group_keywords)

                recommendation_list.append({
                    "id": group.id,
                    "name": group.name,
                    "description": group.description,
                    "subject": group.subject,
                    "max_members": group.max_members,
                    "join_code": group.join_code,
                    "score": score  # for internal use
                })

            # Sort and get top 3
            top_recommendations = sorted(recommendation_list, key=lambda x: x["score"], reverse=True)[:3]
            for rec in top_recommendations:
                rec.pop("score")  # remove score before sending to frontend

            # Response
            return JsonResponse({
                "message": f"Welcome, {student.first_name}!",
                "study_groups": study_groups_list,
                "recommendations": top_recommendations
            }, status=200)

        except Student.DoesNotExist:
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

            if not name:
                return Response({"message": "Name is required"}, status=400)

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

@method_decorator(csrf_exempt, name='dispatch')  # Disable CSRF for this view
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

class GroupDetailView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes     = [IsAuthenticated]

    def get(self, request, group_id):
        group = get_object_or_404(StudyGroup, id=group_id)
        members = group.members.all()
        creator_name = group.creator.first_name
        member_names = [m.first_name for m in members]

        events_data = [{
            "id": e.id,
            "name": e.name,
            "description": e.description,
            "date": str(e.date),
            "time": str(e.time),
            "location": e.location,
        } for e in group.events.all().order_by('-date')]

        return Response({
            "id": group.id,
            "name": group.name,
            "description": group.description,
            "subject": group.subject,
            "max_members": group.max_members,
            "join_code": group.join_code,
            "creator": creator_name,
            "members": member_names,
            "events": events_data 
        }, status=status.HTTP_200_OK)

    def post(self, request, group_id):
        """
        Join the group with the given group_id.
        """
        try:
            student = Student.objects.get(user=request.user)
            group = get_object_or_404(StudyGroup, id=group_id)

            if group.members.filter(id=student.id).exists():
                return Response({"message": "You are already a member of this group"}, status=status.HTTP_400_BAD_REQUEST)

            if group.members.count() >= group.max_members:
                return Response({"message": "This group is already full"}, status=status.HTTP_400_BAD_REQUEST)

            group.members.add(student)
            return Response({"message": "Joined group successfully"}, status=status.HTTP_200_OK)

        except Student.DoesNotExist:
            return Response({"message": "Student profile not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": f"Unexpected error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, group_id):
        """
        Edit group details—only the group's creator may update.
        """
        try:
            student = Student.objects.get(user=request.user)
            group = get_object_or_404(StudyGroup, id=group_id)

            # Only the creator can edit
            if group.creator != student:
                return Response(
                    {"message": "Only the group owner may edit this group."},
                    status=status.HTTP_403_FORBIDDEN
                )

            data = request.data

            # Optional: validate required fields if provided
            if 'name' in data and not data['name'].strip():
                return Response({"message": "Name cannot be blank."}, status=status.HTTP_400_BAD_REQUEST)
            if 'subject' in data and not data['subject'].strip():
                return Response({"message": "Subject cannot be blank."}, status=status.HTTP_400_BAD_REQUEST)

            # Apply updates
            for field in ('name', 'description', 'subject', 'max_members'):
                if field in data:
                    setattr(group, field, data[field])
            group.save()

            # Return the updated group
            return Response({
                "id": group.id,
                "name": group.name,
                "description": group.description,
                "subject": group.subject,
                "max_members": group.max_members,
                "join_code": group.join_code,
                "creator": group.creator.first_name,
                "members": [m.first_name for m in group.members.all()],
            }, status=status.HTTP_200_OK)

        except Student.DoesNotExist:
            return Response({"message": "Student profile not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": f"Unexpected error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, group_id):
        """
        Leave the group with the given group_id.
        """
        try:
            student = Student.objects.get(user=request.user)
            group = get_object_or_404(StudyGroup, id=group_id)

            if not group.members.filter(id=student.id).exists():
                return Response({"message": "You are not a member of this group"}, status=status.HTTP_400_BAD_REQUEST)

            group.members.remove(student)
            return Response({"message": "Left group successfully"}, status=status.HTTP_200_OK)

        except Student.DoesNotExist:
            return Response({"message": "Student profile not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": f"Unexpected error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
@method_decorator(csrf_exempt, name='dispatch')  # Disable CSRF for this view
class StudyGroupSearchView(APIView):
    authentication_classes = [JWTAuthentication]  
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get('q', '').strip().lower()
        if not query or len(query) < 2:
            return Response({"results": []})

        # Get current student object
        try:
            student = Student.objects.get(user=request.user)
        except Student.DoesNotExist:
            return Response({"error": "Student profile not found"}, status=400)

        # Get IDs of joined groups
        joined_groups = student.study_groups.all()
        joined_ids = joined_groups.values_list('id', flat=True)

        # Tokenize and filter the query into keywords
        keywords = query.split()
        joined_keywords = [word for word in keywords if len(word) > 2]
        keyword_freq = Counter(joined_keywords)

        # Search groups by name, subject, join_code, or keyword in description
        matched_groups = StudyGroup.objects.filter(
            Q(name__icontains=query) |
            Q(subject__icontains=query) |
            Q(join_code__icontains=query) |
            Q(description__icontains=query)
        ).distinct()

        # Convert to JSON response manually
        results = []
        for group in matched_groups:
            results.append({
                'id': group.id,
                'name': group.name,
                'description': group.description,
                'subject': group.subject,
                'join_code': group.join_code,
            })

        return Response({"results": results})

@method_decorator(csrf_exempt, name='dispatch')
class EventCreateView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, group_id):
        try:
            student = Student.objects.get(user=request.user)
            group = get_object_or_404(StudyGroup, id=group_id)

            if student not in group.members.all():
                return Response({"message": "Only group members can create events."}, status=403)

            data = json.loads(request.body)
            event = Event.objects.create(
                group=group,
                name=data.get("name"),
                description=data.get("description", ""),
                date=data.get("date"),
                time=data.get("time"),
                location=data.get("location", "")
            )

            return Response({"event": {
                "id": event.id,
                "name": event.name,
                "description": event.description,
                "date": str(event.date),
                "time": str(event.time),
                "location": event.location,
            }}, status=201)

        except Exception as e:
            return Response({"message": f"Error creating event: {str(e)}"}, status=500)



@method_decorator(csrf_exempt, name='dispatch')
class GroupEventListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, group_id):
        group = get_object_or_404(StudyGroup, id=group_id)
        events = group.events.all().order_by('-date')

        data = [{
            "id": event.id,
            "name": event.name,
            "description": event.description,
            "date": str(event.date),
            "time": str(event.time),
            "location": event.location,
        } for event in events]

        return Response(data, status=200)

    def post(self, request, group_id):
        try:
            student = Student.objects.get(user=request.user)
            group = get_object_or_404(StudyGroup, id=group_id)

            if student not in group.members.all():
                return Response({"message": "Only group members can create events."}, status=403)

            # Accept both raw JSON or request.data
            data = request.data if request.content_type == 'application/json' else json.loads(request.body)

            event = Event.objects.create(
                group=group,
                name=data.get("name"),
                description=data.get("description", ""),
                date=data.get("date"),
                time=data.get("time"),
                location=data.get("location", ""),
                creator=student, 
            )

            return Response({
                "id": event.id,
                "name": event.name,
                "description": event.description,
                "date": str(event.date),
                "time": str(event.time),
                "location": event.location,
            }, status=201)

        except Exception as e:
            return Response({"message": f"Error creating event: {str(e)}"}, status=500)
        
# class EventDetailView(APIView):
#     authentication_classes = [JWTAuthentication]
#     permission_classes     = [IsAuthenticated]

#     def put(self, request, group_id, event_id):
#         """
#         Edit any event in group—but only if request.user is the group's creator.
#         """
#         student = Student.objects.get(user=request.user)
#         group   = get_object_or_404(StudyGroup, id=group_id)

#         # <— only the group creator may proceed
#         if group.creator != student:
#             return Response(
#                 {"message": "Only the group owner may edit events."},
#                 status=status.HTTP_403_FORBIDDEN
#             )

#         event = get_object_or_404(Event, id=event_id, group=group)

#         # now apply updates
#         data = request.data
#         for field in ('name','description','date','time','location'):
#             if field in data:
#                 setattr(event, field, data[field])
#         event.save()

#         return Response({
#             "id":          event.id,
#             "name":        event.name,
#             "description": event.description,
#             "date":        str(event.date),
#             "time":        str(event.time),
#             "location":    event.location,
#         }, status=status.HTTP_200_OK)

#     def delete(self, request, group_id, event_id):
#         """
#         Delete any event in group—but only if request.user is the group's creator.
#         """
#         student = Student.objects.get(user=request.user)
#         group   = get_object_or_404(StudyGroup, id=group_id)

#         if group.creator != student:
#             return Response(
#                 {"message": "Only the group owner may delete events."},
#                 status=status.HTTP_403_FORBIDDEN
#             )

#         event = get_object_or_404(Event, id=event_id, group=group)
#         event.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)
    
# @method_decorator(csrf_exempt, name='dispatch')
# class EditGroupView(APIView):
#     authentication_classes = [JWTAuthentication]
#     permission_classes = [IsAuthenticated]

#     def put(self, request, group_id):
#         """
#         Only the group.creator may update:
#           - name
#           - description
#           - subject
#           - max_members
#         """
#         student = get_object_or_404(Student, user=request.user)
#         group   = get_object_or_404(StudyGroup, id=group_id)

#         # Only creator can edit
#         if group.creator != student:
#             return Response(
#                 {"message": "Only the creator can edit this group."},
#                 status=status.HTTP_403_FORBIDDEN
#             )

#         data = request.data
#         # Update allowed fields
#         for field in ("name", "description", "subject", "max_members"):
#             if field in data:
#                 setattr(group, field, data[field])
#         group.save()

#         return Response({
#             "id": group.id,
#             "name": group.name,
#             "description": group.description,
#             "subject": group.subject,
#             "max_members": group.max_members,
#             "join_code": group.join_code
#         })