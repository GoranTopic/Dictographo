from rest_framework import serializers, fields
from .models import Word, Definition, Example, Synonym_Relation 


class Synonym_RelationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Synonym_Relation
        fields = ('synonym',)

class DefinitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Definition
        fields = ('syntax', 'definition',)

class ExampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Example
        fields = ('example',)


class WordSerializer(serializers.ModelSerializer):
    examples = ExampleSerializer(read_only=True, many=True) 
    definitions = DefinitionSerializer(read_only=True, many=True) 
    synonyms = Synonym_RelationSerializer(read_only=True, many=True) 
    class Meta:
        model = Word
        fields = ( 'w_id', 'word', 'etymology', 'notes', 'examples', 'definitions', 'synonyms')

class CharFieldSerializer(serializers.Serializer):
    # used for the query serializer and error serializer
    char_field = serializers.CharField(max_length=100)

class QuerySearchSerializer(serializers.Serializer):
    w_id = serializers.CharField(max_length=100)
    word = serializers.CharField(max_length=100)
    
class MsgSerializer(serializers.Serializer):
    # serilaixer for error messages 
    w_id = serializers.CharField(max_length=100)
    detail = serializers.CharField(max_length=100)
    first = serializers.CharField(max_length=100)
    last = serializers.CharField(max_length=100)


