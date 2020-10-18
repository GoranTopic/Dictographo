from django.db import models

# Create your models here.

class Word(models.Model):
    w_id = models.CharField(primary_key=True, max_length=200, blank=False)
    word = models.CharField(max_length=200, blank=False)
    url = models.CharField(max_length=200, blank=True)
    etymology = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    def __str__(self):
        return self.title

class Definition(models.Model):
    word = models.ForeignKey(Word, related_name="definitions", on_delete=models.CASCADE)
    definition = models.TextField()
    syntax = models.CharField(max_length=200, null=True, blank=True)
    def __str__(self):
        return self.word.title + ": " + self.definition

class Example(models.Model):
    word = models.ForeignKey(Word, related_name="examples", on_delete=models.CASCADE)
    example = models.CharField(max_length=200, blank=True)
    def __STR__(SELF):
        return self.word.title + ": " + self.example

class Synonym_Relation(models.Model):
    word_from = models.ForeignKey(Word, related_name='synonyms', on_delete=models.CASCADE)
    synonym = models.ForeignKey(Word, on_delete=models.CASCADE)
    def __str__(self):
        return self.word_from.title + "  -->  " + self.synonym.title

