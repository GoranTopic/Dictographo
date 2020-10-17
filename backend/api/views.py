from .models import Word, Definition, Example, Synonym_Relation
from .serializers import WordSerializer
from .permissions import IsAuthorOrReadOnly
from rest_framework import generics
from rest_framework import viewsets
# Create your views here.


class WordDetail(generics.RetrieveAPIView):
    queryset = Word.objects.all()
    serializer_class = WordSerializer
    permission_classes = (IsAuthorOrReadOnly,)

