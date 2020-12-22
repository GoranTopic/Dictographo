from .models import Word, Definition, Example, Synonym_Relation
from .serializers import WordSerializer, QuerySearchSerializer, CharFieldSerializer, MsgSerializer
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
    
    def jsonNotFoundMsg(self, words=None, detail = "Not Found.", first=None, last=None ):
        '''returns a dict with the not found word'''
        if isinstance(words, list): 
            multiple = True
            message = []
            for word in words:
                message.append({ # not found dict
                    'w_id': word, 
                    'detail': detail,
                    'first': first,
                    'last': last,})
        else:
            word = words # there is only one word
            multiple = False
            message = { # not found dict
                    'w_id': word, 
                    'detail': detail,
                    'first': first,
                    'last': last,
                    }
        serializer = MsgSerializer(message, many=multiple)
        # tranfer as json 
        return JsonResponse(serializer.data,safe=False)
     
    def jsonFoundMsg(self, words=None, detail = "Found.", first=None, last=None ):
        '''returns a dict with the not found word'''
        if isinstance(words, list): 
            multiple = True
            message = []
            for word in words:
                message.append({ # not found dict
                    'w_id': word, 
                    'detail': detail,
                    'first': first,
                    'last': last,})
        else:
            word = words # there is only one word
            multiple = False
            message = { # not found dict
                    'w_id': word, 
                    'detail': detail,
                    'first': first,
                    'last': last,
                    }
        serializer = MsgSerializer(message, many=multiple)
        # tranfer as json 
        return JsonResponse(serializer.data,safe=False)
     
    

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
            return self.jsonNotFoundMsg(word)
        else:
            # if the word is in the db
            # get word form the db and append to the list of words
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
        jsonNotFoundMsg = NeighborsDetail.jsonNotFoundMsg
        query_neighbors = NeighborsDetail.query_neighbors
        first_word = kwargs['pk']
        second_word = kwargs['second_pk']
        word_list = [] 
        if not Word.objects.filter(w_id=first_word).exists():
            # if the first word is not in db
            if not Word.objects.filter(w_id=second_word).exists():
                # if second and first is not in db
                # send both as not founds
                return jsonNotFoundMsg(self, [first_word, second_word])
            # send only first word not found
            return jsonNotFoundMsg(self, first_word)
        else:
            # if first is in db
            if not Word.objects.filter(w_id=second_word).exists():
                # but second word is not im db
                # return second word not found
                return jsonNotFoundMsg(self, second_word)
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
                    # if the path does not exists
                    # append both neibors to the result
                    return jsonNotFoundMsg(self,detail ='Path not found.', first=first_word, last=second_word)
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
    synonym_graph = ApiConfig.synonym_graph
    
    def filterSuggestion(self, word):
        if " "  in word.w_id:
            # don't send word that have spaces in the
            if self.synonym_graph.has_node(word):
                # nor words which are not in our graph
                return True
        return False

    def get(self, request, *args, **kwargs):
        ''' get a word and return a list of the json with requested word and neiboring words '''
        search_key = kwargs['pk']
        min_search_key_length = 2
        queried_list = []
        if len(search_key) > min_search_key_length:  
            # if it is grater then the minimum size
            queried_list = Word.objects.filter(w_id__startswith=search_key)
        # filter words which we don't want to suggest
        queried_list = filter(self.filterSuggestion, queried_list)
        # only get the first 15 words
        #queried_list = queried_list[:15]
        # pass thru the serilizer as many 
        serializer = self.get_serializer(queried_list, many=True)
        # tranfer as json 
        json = JSONRenderer().render(serializer.data)
        # send json data back, must have safe parameter as False
        return JsonResponse(serializer.data,safe=False)

class CheckDetail(generics.RetrieveAPIView):
    queryset = Word.objects.all()
    serializer_class = MsgSerializer
    permission_classes = (IsAuthorOrReadOnly,)
    synonym_graph = ApiConfig.synonym_graph
    jsonNotFoundMsg = NeighborsDetail.jsonNotFoundMsg
    jsonFoundMsg = NeighborsDetail.jsonFoundMsg

    def get(self, request, *args, **kwargs):
        '''return true if word is in db and graph'''
        word = kwargs['pk'] # get word from parameter
        if Word.objects.filter(w_id=word).exists():
            # if the word is in the db
            node = self.get_queryset().get(w_id=word)
            # get that word
            if self.synonym_graph.has_node(node):
                # check if that word is in graph
                # return foumd msg
                return self.jsonFoundMsg(words=word);
        # return not found msg
        return self.jsonNotFoundMsg(words=word);


