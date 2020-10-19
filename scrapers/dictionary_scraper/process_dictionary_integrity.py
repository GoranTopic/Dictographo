#!/usr/bin/env python3.8
"""
==============
Check the dictionary for synonyms and integrity of the graph 
==============
"""
import json 
import sys
import bisect
import html
import urllib.parse

# pass the dictionary file as argument
if sys.argv[1] is not None:
    dictionary_file = open(str(sys.argv[1]), 'r')
else:
    print("please pass me some json file")
    exit()


# load dictionary
dictionary = json.load(dictionary_file)

def dump_to_json(dictionary, dest_file="out_file.json"):
    out_file = open(dest_file, "w") 
    json.dump(dictionary, out_file, indent = 4) 

def remove_duplicates(dictionary):
    done_words = []
    new_dict = []
    for entry in dictionary:
        if entry['link_id'] not in done_words:
            done_words.append(entry['link_id']) 
            new_dict.append(entry)
        else:
            print(f"{entry['link_id']} was a duplicate!")
    return new_dict

def remove_entry(dictionary):
    for entry in dictionary:
        if len(entry["link_id"]) > 0:
            for synonym in entry["synonyms"]:
                G.add_edge(entry["link_id"], synonym)
                
def get_sorted_entries(dictionary):
    entries = []
    no_def_entries = []
    for entry in dictionary:
        # insent into sorted list
        print(entry['link_id'])
        if not entry['definitions']:
            bisect.insort(entris, entry['url'])
        else:
            bisect.insort(no_def_entries, entry['url'])
    dump_to_json(no_def_entries, "no_def_entries.json")
    return entries

def decode_html(dictionary):
    for entry in dictionary:
        print( f"decoding: {entry['link_id']}")
        entry['link_id'] = html.unescape(entry['link_id'])
        entry['link_id'] = urllib.parse.unquote(entry['link_id'])
        for x in range(0, len(entry['synonyms'])):
            entry['synonyms'][x] = urllib.parse.unquote(entry['synonyms'][x])
            entry['synonyms'][x] = html.unescape(entry['synonyms'][x])
        print( f"to:       {entry['link_id']}")
    return dictionary

def sort_dictionary(dictionary):
        def sort_title(entry):
            return entry["link_id"]
        dictionary.sort(key = sort_title)

def set_all_lowercase(dictionary):
    for entry in dictionary:
        entry['word'] = entry['word'].lower()
        entry['link_id'] = entry['link_id'].lower()
        for synonym in entry['synonyms']:
            synonym = synonym.lower()
        for antonym in entry['antonyms']:
            antonym = antonym.lower()
    return dictionary

def binary_search(arr, word): 
    low = 0
    high = len(arr) - 1
    mid = 0
    while low <= high: 
        mid = (high + low) // 2
        if arr[mid]['link_id'] < word: 
            low = mid + 1 
        elif arr[mid]['link_id'] > word:
            high = mid - 1
        else: 
            return arr[mid]
    return -1
               
def check_missing_entries(dictionary):
    missing_entries = []
    for entry in dictionary:
        if entry["synonyms"]:
            for synonym in entry["synonyms"]:
                if  binary_search(dictionary, synonym) == -1:
                    missing_entries.append((f"https://www.merriam-webster.com/dictionary/{synonym}"))
    return missing_entries

#entry_list =  get_sorted_entries(dictionary)
#dictionary = set_all_lowercase(dictionary)
dictionary = decode_html(dictionary)
dictionary = remove_duplicates(dictionary)
sort_dictionary(dictionary) # sorting is done in place
dump_to_json(dictionary, "dictionary.json")
missing_entries = check_missing_entries(dictionary)
dump_to_json(missing_entries, "missing_entries.json")

