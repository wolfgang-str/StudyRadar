from django.test import SimpleTestCase
from django.urls import reverse, resolve
from StudyRadar.views import *
from .views import LoginView, SignupView, DashboardView, AboutusView, CreateGroupView, StudyGroupSearchView, GroupDetailView, GroupEventListView, EventCreateView

class TestUrls(SimpleTestCase):
    
    def test_login_url_resolves(self):
        url = reverse('login')
        self.assertEqual(resolve(url).func.view_class, LoginView)
    
    def test_signup_url_resolves(self):
        url = reverse('signup')
        self.assertEqual(resolve(url).func.view_class, SignupView)
    
    def test_dashboard_url_resolves(self):
        url = reverse('dashboard')
        self.assertEqual(resolve(url).func.view_class, DashboardView)

    def test_about_url_resolves(self):
        url = reverse('about')
        self.assertEqual(resolve(url).func.view_class, AboutusView)

    def test_group_detail_url_resolves(self):
        url = reverse('group-detail', kwargs={'group_id': 1})
        self.assertEqual(resolve(url).func.view_class, GroupDetailView)
    
    def test_react_app_url_resolves(self):
        url = reverse('react_app')
        self.assertEqual(resolve(url).func.view_class, TemplateView)

