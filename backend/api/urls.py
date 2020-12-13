from django.contrib import admin
from django.urls import path
from .views import WordDetail, NeighborsDetail, PathDetail, QuerySearchDetail

urlpatterns = [
        # return the word value for a single word
        path('<str:pk>/', WordDetail.as_view()),
        # returns the word querys and all the neiboring words as well
        path('synonyms/<str:pk>/', NeighborsDetail.as_view()),
        # returns the path, if found, between two words
        path('path/<str:pk>/<str:second_pk>/', PathDetail.as_view()),
        # return words the share the same start
        path('querysearch/<str:pk>/', QuerySearchDetail.as_view()),
        ]
