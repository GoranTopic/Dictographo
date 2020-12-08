from django.apps import AppConfig
import networkx as nx 

class ApiConfig(AppConfig):
    name = 'api'
    # Create Graph
    synonym_graph = nx.DiGraph()

    def ready(self):
        '''
            Load graph from database. This process can take time, 
            run manage.py with --noreload to ony run once.
        '''
        # Call get database
        synonym_model = AppConfig.get_model(self, 'Synonym_Relation')
        # Queryset all 
        relations = synonym_model.objects.all()
        # query all values from word_from
        relations = relations.select_related('word_from')
        # query all values from synonyms
        relations = relations.select_related('synonym')
        print("Loading Words into graph..")
        for relation in relations:
            self.synonym_graph.add_edge(relation.word_from, relation.synonym)
        print("done")


