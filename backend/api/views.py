from .models import Word, Definition, Example, Synonym_Relation
from .serializers import WordSerializer, QuerySearchSerializer, CharFieldSerializer
from .permissions import IsAuthorOrReadOnly
from .apps import ApiConfig
from rest_framework import generics
from rest_framework import viewsets
from rest_framework import serializers
from rest_framework.renderers import JSONRenderer
from django.http import HttpResponse, JsonResponse
import networkx as nx 
# Create your views here.

class WordDetail(generics.RetrieveAPIView):
    queryset = Word.objects.all()
    serializer_class = WordSerializer
    permission_classes = (IsAuthorOrReadOnly,)

class NeighborsDetail(generics.ListAPIView):
    queryset = Word.objects.all()
    serializer_class = WordSerializer
    permission_classes = (IsAuthorOrReadOnly,)
    
    def not_found_msg(self, word):
        '''returns a dict with the not found word'''
        not_found ={ 
                    'w_id': word, 
                    'detail':'not found' 
                    }
        return not_found

    def query_neighbors(self, word):
        '''return a list of neiboring word form a given word'''
        # Query from db the restqested central word
        requested_word = self.get_queryset().get(w_id=word)
        # Query from db the relations is has, prequering? the sysynoms for efficiency
        synonyms_relations = requested_word.synonyms.all().select_related('synonym') 
        # get all the words in a list
        return [ relation.synonym for relation in synonyms_relations ]

    def get(self, request, *args, **kwargs):
        ''' get a word and return a list of the json with requested word and neiboring words '''
        word = kwargs['pk']
        word_list = []
        if not Word.objects.filter(w_id=word).exists():
            # if word does not exist in db 
            word_list.append(self.not_found_msg(word))
        else:
            # if the word is in the db
            # get word form the db and appedn to the list of words
            #word_list.append(self.get_queryset().get(w_id=word))
            # query neighbors and append neighboring words too =)
            [word_list.append(word) for word in self.query_neighbors(kwargs['pk'])]
        # pass thru the serilizer as many 
        serializer = WordSerializer(word_list, many=True)
        # tranfer as json 
        json = JSONRenderer().render(serializer.data)
        # send json data back, must have safe parameter as False
        return JsonResponse(serializer.data,safe=False)

class PathDetail(generics.ListAPIView):
    queryset = Word.objects.all()
    serializer_class = WordSerializer
    permission_classes = (IsAuthorOrReadOnly,)
    synonym_graph = ApiConfig.synonym_graph

    def get(self, request, *args, **kwargs):
        ''' get a word and return a list of the json with requested word and neiboring words '''
        not_found_msg = NeighborsDetail.not_found_msg
        query_neighbors = NeighborsDetail.query_neighbors
        first_word = kwargs['pk']
        second_word = kwargs['second_pk']
        word_list = [] 

        if not Word.objects.filter(w_id=first_word).exists():
            # if the first word is not in db
            word_list.append(not_found_msg(self, first_word))
            if not Word.objects.filter(w_id=second_word).exists():
                # if second and first is not in db
                word_list.append(not_found_msg(self, second_word))
            else:
                # if only first is not in not in db
                [word_list.append(word) for word in query_neighbors(self, second_word)]
        else:
            # if first is in db
            if not Word.objects.filter(w_id=second_word).exists():
                # if first word is in but second is not
                word_list.append(not_found_msg(self, second_word))
                [word_list.append(word) for word in NeighborsDetail.query_neighbors(self, first_word)]
            else:
                # if both words are in the db
                # get words from the db
                source_word = self.get_queryset().get(w_id=first_word)
                target_word = self.get_queryset().get(w_id=second_word)
                # check if there is path between them 
                if(nx.has_path(self.synonym_graph, source_word, target_word)):
                    # get the shortest path
                    word_list = nx.shortest_path(self.synonym_graph, source_word, target_word) 
                else:
                    # append both neibors to the result
                    [word_list.append(word) for word in NeighborsDetail.query_neighbors(self, first_word)]
                    [word_list.append(word) for word in NeighborsDetail.query_neighbors(self, second_word)]
        # pass the word list thru the serilizer with parameter many 
        serializer = self.get_serializer(word_list, many=True)
        # tranfer as json 
        json = JSONRenderer().render(serializer.data)
        # send json data back, must have safe parameter as False
        return JsonResponse(serializer.data,safe=False)

class QuerySearchDetail(generics.ListAPIView):
    queryset = Word.objects.all()
    serializer_class = QuerySearchSerializer
    permission_classes = (IsAuthorOrReadOnly,)
    
    def get(self, request, *args, **kwargs):
        ''' get a word and return a list of the json with requested word and neiboring words '''
        search_key = kwargs['pk']
        min_search_key_lenght = 2
        queried_list = []
        if len(search_key) > min_search_key_lenght:  
            # if it is grater then the minimum size
            queried_list = Word.objects.filter(w_id__startswith=search_key)
        # pass thru the serilizer as many 
        serializer = self.get_serializer(queried_list, many=True)
        # tranfer as json 
        json = JSONRenderer().render(serializer.data)
        # send json data back, must have safe parameter as False
        return JsonResponse(serializer.data,safe=False)
