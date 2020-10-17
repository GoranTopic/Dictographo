from django.contrib import admin
from django.urls import path
from .views import WordDetail

urlpatterns = [
        path('<str:pk>/', WordDetail.as_view()),
        path('node/<str:pk>/', WordDetail.as_view()),
        ]
