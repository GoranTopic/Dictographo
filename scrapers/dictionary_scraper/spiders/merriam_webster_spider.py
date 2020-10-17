import scrapy
import json 
from  dictionary_scraper.items import Word

class MerriamWebsterSpider(scrapy.Spider):
    name = "merriam_webster"
    allowed_domains = [ 'www.merriam-webster.com']
    #start_urls = [ 'https://www.merriam-webster.com/browse/dictionary/a' ]
    fileName = open('missing_entries.json', 'r')
    start_urls = json.load(fileName)

    def parse(self, response):
        ''' get all the alpha links '''
        
        #yield response.follow(response.url, self.parseWordEntry)
        for alpha_link in response.xpath('//div[@class="alphalinks"]//@href').getall():
            # for every apha link:
            # call ParseAlphaEntriePage which parses and extracs data from every entry
            yield response.follow(alpha_link, self.parseAlphaEntriesPage)


    def parseAlphaEntriesPage(self, response):
        ''' parse all entries from the page '''
        #Gets all the word entris from an Alpha entry page
        entrie_links = response.xpath('//div[@class="entries"]//@href').getall()
        for entry_link in entrie_links:
            # parse each word entry and get all it's infomation
            yield response.follow(entry_link, self.parseWordEntry)
        # get next page
        next_page = response.xpath('//a[@aria-label="Next"]//@href').get()
        # if there is a next page
        print(next_page)
        if next_page != "javascript: void(0)":
            # if it is not a dead link
            yield response.follow(next_page, self.parseAlphaEntriesPage)

    def parseWordEntry(self, response):
        '''Parse the web page with a word'''
        #create a new word item
        word = Word()
        #save url
        word["url"] = response.url
        #get word
        word["word"] = response.xpath('//h1[@class="hword"]/descendant::text()').get()
        #get link id
        word["link_id"] = word["url"].rpartition('/')[-1]
        #get pronunciation
        word["pronunciations"] = response.xpath('//span[@class="pr"]/text()').getall()
        #get syllables
        word["syllables"] = response.xpath('//span[@class="word-syllables"]/text()').get()
        #get synonyms
        synonyms_urls = response.xpath('//div[@id="synonyms-anchor"]/p[@class="function-label"][contains(text(), "Synonyms")]/following::ul[1]/li/a/@href').getall()
        word["synonyms"]  = [ url.rpartition('/')[-1] for url in synonyms_urls  ] # clean the link to get the last value
        #get antonyms
        antonyms_urls = response.xpath('//div[@id="synonyms-anchor"]/p[@class="function-label"][contains(text(),"Antonyms")]/following::ul[1]/li/a/@href').getall()
        word["antonyms"] = [ url.rpartition('/')[-1] for url in antonyms_urls ] # clean the link to get the last value
        #get use the right synonym
        word["synonym_discussion"] =self.clean_string(response.xpath('//div[@id="synonym-discussion-anchor"]/descendant::*/text()').getall())
        #get the exmaples
        word["examples"] = [ self.clean_string(span.xpath('descendant::text()').getall()) for span in response.xpath('//div[@id="examples-anchor"]/div[@class="in-sentences"]/span')]
        #get etymology
        word["etymology"] = self.clean_string(response.xpath('//div[@id="etymology-anchor"]/descendant::*/text()').getall())
        # get notes if existant
        word["notes"] = self.clean_string(response.xpath('//div[starts-with(@id, "note-")]/descendant::*/text()').getall())
        #get definition
        word["definitions"] = {}

        #empty list to store definitions
        definitions = []
        #get all the syntaxes
        syntaxes = response.xpath('//span[@class="fl"]//text()').getall()
        #get dictionary entriese
        entries = response.xpath('//div[starts-with(@id, "dictionary-entry-")]')
        # for every dictionary entry
        for entry in entries:
            #get the definition lines
            entry_lines = entry.xpath('descendant::span[@class="dtText"]')
            if not entry_lines:
                #if does not have th normal dtText class but has the cxl-ref
                 entry_lines = entry.xpath('descendant::p[@class="cxl-ref"]')
            # for every line in the entry make, get all string and concatinate into a list of lines
            definitions.append( ["".join(line.xpath('descendant::text()').getall()) for line in entry_lines] )
        #Combine the definition and the syntax back together 
        #For every entry found combine with the matching index of syntax found
        if len(entries) > 0  and  len(syntaxes) == 0:
            for i in range(0, len(entries)):
                word["definitions"] = [ self.clean_string(definition) for definition in definitions[i] ]
        if len(entries) >=  len(syntaxes):
            for i in range(0, len(syntaxes)):
                word["definitions"][syntaxes[i]] = [ self.clean_string(definition) for definition in definitions[i] ]
        elif len(entries) <  len(syntaxes):
            for i in range(0, len(entries)):
                word["definitions"][syntaxes[i]] = [ self.clean_string(definition) for definition in definitions[i] ]
            word
        yield word
     
   
    def clean_string(self, dirty):
        ''' basic clean up of random char and format'''
        if isinstance(dirty, str):
            return dirty.replace('\n', '').replace('   ', '').rstrip(' ')
        elif isinstance(dirty, list):
            return " ".join(dirty).replace('\n', '').replace('   ', '').rstrip(' ').replace(" (function() { window.mwHeapEvents['Definition - Has Synonym Guide'] = 'true';  })();", "")


    # def parse_thesaurus()
