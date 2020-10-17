from django.contrib import admin
from .models import Word, Definition, Example, Synonym_Relation
# Register your models here.


admin.site.register(Word)
admin.site.register(Definition)
admin.site.register(Example)
admin.site.register(Synonym_Relation)
