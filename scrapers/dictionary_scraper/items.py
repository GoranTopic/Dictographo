# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy

class Word(scrapy.Item):
    ''' Word Data Item for saving the word definition from merriamwebster'''
    word = scrapy.Field()
    link_id = scrapy.Field()
    url  = scrapy.Field()
    pronunciations = scrapy.Field()
    syllables = scrapy.Field()
    definitions = scrapy.Field()
    synonyms = scrapy.Field()
    antonyms = scrapy.Field()
    synonym_discussion = scrapy.Field()
    notes = scrapy.Field()
    examples = scrapy.Field()
    etymology = scrapy.Field()
                        
          
