# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html
import json
import sqlite3
import bisect 
from scrapy.exceptions import NotConfigured
from itemadapter import ItemAdapter

class JsonFilePipeline:

    def open_spider(self, spider):
        
        self.entries = []
        self.errored = [] # keep track of entries with a sorted list
        self.file = open('dictionary_missing.json', 'a')
        self.empty_file = True;
        if self.empty_file:
            #self.file.write('[') 
            self.empty_file = False
        self.error_file = open('errored_words.json', 'a')

    def close_spider(self, spider):
        #self.file.write(']') 
        self.dictionary = json.load(self.file)
        self.dictionary = self.remove_duplicates(dictionary)
        self.sort_dictionary(self.dictionary)
        json.dumps(self.dictionary, self.file, indent=4, sort_keys=True)
        self.file.close()
        self.error_file.close()

    def process_item(self, item, spider):
        item = ItemAdapter(item)
        if self.is_valid_entry(item):
            bisect.insort(self.entries, item['word']) 
            line = json.dumps(item.asdict(), indent=4, sort_keys=True) + ','
            self.file.write(line)
        else:
            line = json.dumps(item.asdict(), indent=4, sort_keys=True) + ','
            self.error_file.write(line)
        return item

    def sort_dictionary(self, dictionary):
        def sort_title(entry):
            return entry["word"]
        self.dictionary.sort(key = sort_title)

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

    def is_valid_entry(self, item):
        # if word could not be extracted wirte to errored file
        # if definition could not be extracted write to errored file
        if item['word'] is None or item['definitions'] is None:
            return False 
        else:
            return True

            
class SQLScraperPipeline:

    def open_spider(self, spider):
        # create database
        self.db_conn = sqlite3.connect('booty.db')
        self.cursor = self.db_conn.cursor()
        # create table for words
        #self.cursor.execute('''CREATE TABLE entries ( word TEXT NOT NULL PRIMARY KEY, url TEXT, notes TEXT, etymology TEXT)''')
        # create table for pronunciations 
        #self.cursor.execute('''CREATE TABLE pronunciations ( word TEXT NOT NULL PRIMARY KEY, prounciation TEXT,)''')
        # create table for sylables 
        #self.cursor.execute('''CREATE TABLE sylables ( word TEXT NOT NULL PRIMARY KEY, sylable TEXT,)''')
        # create table for definitions  
        #self.cursor.execute('''CREATE TABLE definitions ( word TEXT NOT NULL PRIMARY KEY, syntax TEXT, definition TEXT,)''')
        # create table for synonyms 
        #self.cursor.execute('''CREATE TABLE synonyms ( word TEXT NOT NULL PRIMARY KEY, synonym TEXT,)''')
        # create table for antonyms 
        #self.cursor.execute('''CREATE TABLE antonyms ( word TEXT NOT NULL PRIMARY KEY, antonym TEXT,)''')
        # create table for examples 
        #self.cursor.execute('''CREATE TABLE examples ( word TEXT NOT NULL PRIMARY KEY, example TEXT,)''')
        # commit to the tables
        self.db_conn.commit()

    def close_spider(self, spider):
        # close connection
        self.db_conn.close()

    def write_to_db(self, item):
        def iterator_insertor(self, table_name ):
            # incert from a given title a list of element into a table
            if isinstance(item[table_name], list): 
                for element in item[table_name]:
                    buff = (table_name, item['word'], element)
                    self.cursor.execute("INSERT INTO ? VALUES (?,?)", buff)
            elif isinstance(item[table_name], dict):
                dictionary = item[table_name]
                for key in dictionary.keys():
                    for entry in dictionary[key]:
                        buff = (item['word'], key, entry)
                        self.cursor.execute("INSERT INTO pronunciations VALUES (?,?)", buff)

        buff = ( item['word'], item["url"], item['notes'], item['etymology'],)
        self.cursor.execute("INSERT INTO entries VALUES (?,?,?,?)", buff)
            
        iterator_insertor(self, 'pronunciations')
        iterator_insertor(self, 'sylables')
        iterator_insertor(self, 'antonyms')
        iterator_insertor(self, 'definitions')
        iterator_insertor(self, 'examples')
        
        # Save (commit) the changes
        self.db_conn.commit()

    def process_item(self, item, spider):
        item = ItemAdapter(item)
        if item['word'] is None:
        # if word could not be extracted wirte to errored file
            line = json.dumps(item.asdict(), indent=4, sort_keys=True) + ','
            self.error_file.write(line)
        elif item['definitions'] is None:
        # if definition could not be extracted write to errored file
            line = json.dumps(item.asdict(), indent=4, sort_keys=True)
            self.error_file.write(line)
        #else:
            # write to database
            # write_to_db(self, item.asdict())
        return item

