# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator
import json
from django.http import JsonResponse
from django.views import View
from StudyRadar.models import Student

# @method_decorator(csrf_exempt, name='dispatch')
class LoginView(View):
    def post(self, request):
        try:
            # Try to get data from form-data
            name = request.POST.get("name")
            password = request.POST.get("password")

            # If no form-data is found, try JSON
            if not name or not password:
                data = json.loads(request.body)
                name = data.get("name")
                password = data.get("password")

            # Find user in the database
            student = Student.objects.get(name=name)
            
            # Check password (Warning: Plain text, not secure)
            if student.password == password:
                request.session["student_id"] = student.id
                return JsonResponse({"message": "Login successful"})

            return JsonResponse({"error": "Invalid credentials"}, status=400)

        except Student.DoesNotExist:
            return JsonResponse({"error": "Invalid credentials"}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)



# from StudyRadar.models import 
# from project_app.classes.admin import Admin
# from project_app.classes.ta import Ta

# class Login(View):
#     def get(self, request):
#         return render(request, "login.html", {})

#     def post(self, request):
#         username = request.POST.get('name')  # Django uses 'username' instead of 'name'
#         password = request.POST.get('password')

#         # Authenticate user using Django's built-in authentication system
#         user = authenticate(request, username=username, password=password)

#         if user is not None:
#             login(request, user)  # Creates a session for the user
#             return redirect('/home/')  # Redirects to the home page

#         else:
#             return render(request, "login.html", {"errorMessage": "Invalid username or password"})
