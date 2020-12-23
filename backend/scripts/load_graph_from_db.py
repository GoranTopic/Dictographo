#!/usr/bin/env python3.8
"""
==============
Create Memory Graph From Database With Networkx 
Script for playing with the Networkx 
==============
"""
import sys
import sqlite3
import networkx as nx
db_filename = "/home/telix/dictographo/backend/db.sqlite3"
G = nx.Graph()

try:
    conn = sqlite3.connect(db_filename)
except:
    print("Could not open databse")

print("Opened database successfully")

def print_all_synonym_relations(conn):
    cursor = conn.execute(
            "SELECT word_from_id, synonym_id FROM api_synonym_relation"
            )
    for row in cursor:
        print(row[0] ," --> ", row[1])
    conn.close()

def print_all_tables(conn):
    cursor = conn.execute("select * from SQLite_master")
    tables = cursor.fetchall()
    print("Listing tables and indices from main database:")
    for table in tables:
        print("Type of database object: %s"%(table[0]))
        print("Name of the database object: %s"%(table[1]))
        print("Table Name: %s"%(table[2]))
        print("Root page: %s"%(table[3]))
        print("SQL statement: %s"%(table[4]))
        print("--------------------------------------")
    conn.close()

def print_path(G, start, target):
    '''determines if there is a path, and print it'''
    if(nx.has_path(G, start, target)):
        print(nx.shortest_path(G, start, target))
    else:
        print("could not find a path from", start, "to", target)

def load_networkx_edges(conn):
    ''' takes a connection to db and reads all the synonyms edges '''
    cursor = conn.execute( "SELECT word_from_id, synonym_id FROM api_synonym_relation")
    for row in cursor:
        G.add_edge(row[0], row[1])
    conn.close()

load_networkx_edges(conn)
#print(list(nx.connected_components(G)))
print_path(G, 'pertinacity', 'nicker')
print_path(G, 'type', 'own')
print_path(G, 'good', 'bad')
print_path(G, 'exuberant', 'somber')
print_path(G, 'happy', 'somber')



