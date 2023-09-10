import scrapy
from main import embed_document

class CryptoDocSpider(scrapy.Spider):
    name = 'crypto_doc_spider'
    
    start_urls = [
        'https://docs.primeprotocol.xyz/about-prime-protocol/what-is-prime-protocol',
        'https://docs.primeprotocol.xyz/about-prime-protocol/prime-architecture',
        'https://docs.primeprotocol.xyz/about-prime-protocol/why-use-prime',
        'https://docs.primeprotocol.xyz/navigating-prime/main-functionality',
        'https://docs.primeprotocol.xyz/navigating-prime/universal-access',
        'https://docs.primeprotocol.xyz/navigating-prime/money-markets',
        'https://docs.primeprotocol.xyz/navigating-prime/liquidations',
        'https://docs.primeprotocol.xyz/navigating-prime/prime-points',
        'https://docs.primeprotocol.xyz/audits-security/audits',
    ]
    
    def parse(self, response):
        print(f"Visiting: {response.url}")
        
        # Extract text from the current page (depends on the HTML structure)
        page_text = response.css('div.content').extract_first()  # Replace 'div.content' with the actual CSS selector
        if page_text:
            print("Found page text")
            print(page_text)
            # Embed the text and store it in the database
            embed_document(page_text)
        else:
            print("Did not find page text")