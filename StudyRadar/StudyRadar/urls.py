"""StudyRadar URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from django.views.generic import TemplateView
from StudyRadar.views import *
from .views import LoginView
from .views import SignupView
from .views import DashboardView, AboutusView, CreateGroupView, StudyGroupSearchView, GroupDetailView, GroupEventListView, EventCreateView, UpcomingEventsView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/signup/', SignupView.as_view(), name='signup'),
    path('api/dashboard/', DashboardView.as_view(), name='dashboard'),
    path("api/profile/", UserProfileView.as_view(), name="user-profile"),
    path("api/create-group/", csrf_exempt(CreateGroupView.as_view())),
    path('about/', AboutusView.as_view(), name='about'),
    path('api/groups/<int:group_id>/', GroupDetailView.as_view(), name='group-detail'),
    path('api/search-groups/', csrf_exempt(StudyGroupSearchView.as_view())),
    path('api/groups/<int:group_id>/events/', csrf_exempt(GroupEventListView.as_view())),
    path('api/groups/<int:group_id>/create-event/', csrf_exempt(EventCreateView.as_view())),
    path("api/events/upcoming/", UpcomingEventsView.as_view(), name="upcoming-events"),
    re_path(r'^.*$', TemplateView.as_view(template_name="index.html"), name='react_app'),

    
]
