#!/usr/bin/env python3.8
"""
==============
Weighted Graph
==============

An example using Graph as a weighted network.
"""
import matplotlib.pyplot as plt
import networkx as nx
import json 
import sys

dest_file = "out_dictionary.json"


if sys.argv[1] is not None:
    dictionary_file = open(str(sys.argv[1]), 'r')
else:
    print("please pass me some json file")
    exit()


dictionary = json.load(dictionary_file)

def load_and_safe_graph(dictionary):

    G = nx.Graph()
    for entry in dictionary:
        if len(entry["synonyms"]) > 0:
            for synonym in entry["synonyms"]:
                G.add_edge(entry["word"], synonym)

    # write to gml file
    nx.write_gml(G, "graph.gml")

    # position the the layout 
    pos=nx.spring_layout(G, k=124, iterations=1, scale=8, fixed=None)   #G is my graph


    # Draw graph 
    nx.draw(G,pos,node_color='#A0CBE2',edge_color='#BB0000',edge_cmap=plt.cm.Blues,with_labels=True)

    # Save image to graph 
    plt.savefig("image.png", dpi=1001, facecolor='w', edgecolor='w',orientation='portrait', papertype=None, format=None,transparent=False, bbox_inches=None, pad_inches=0.1) 


def sort_dictionary(dictionary):
    def sort_title(entry):
        return entry["word"]
    dictionary.sort(key = sort_title)


def dump_dictionary(dictionary):
    out_file = open(dest_file, "w") 
    json.dump(dictionary, out_file, indent = 4) 

def remove_duplicates(dictionary):
    done_words = []
    new_dict = []

    def append_entry(entry):
        done_words.append(entry['word']) 
        new_dict.append(entry)

    for entry in dictionary:
        if entry['word'] not in done_words:
            append_entry(entry)

    return new_dict

def remove_entry(dictionary):
    for entry in dictionary:
        if len(entry["word"]) > 0:
            for synonym in entry["synonyms"]:
                G.add_edge(entry["word"], synonym)
                
dictionary = remove_duplicates(dictionary)
sort_dictionary(dictionary)
dump_dictionary(dictionary)

