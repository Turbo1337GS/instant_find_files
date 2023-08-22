from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
from fake_useragent import UserAgent
from urllib.parse import urljoin
import time

app = Flask(__name__)
ua = UserAgent()

MAX_RESULTS_COUNT = 100
MAX_LINKS_COUNT = 30000
TIME_LIMIT = 60

def get_links(query, primary_links=set()):
    print("Rozpoczynam wyszukiwanie w Bing...")
    main_url = f"https://www.bing.com/search?q={query}"
    headers = {'User-Agent': ua.random}
    res1 = requests.get(main_url, headers=headers)
    soup = BeautifulSoup(res1.text, 'html.parser')
    results_bing = [a['href'] for a in soup.select('li.b_algo h2 a')[:MAX_RESULTS_COUNT]]
    new_links = [link for link in results_bing if link not in primary_links]
    primary_links.update(new_links)
    print(f"Znaleziono {len(new_links)} nowych głównych linków.")
    return new_links, primary_links

def get_urls(query):
    start_time = time.time()
    primary_links = set()
    download_links = []

    while time.time() - start_time < TIME_LIMIT:
        new_links, primary_links = get_links(query, primary_links)
        for link in new_links:
            if len(download_links) >= MAX_LINKS_COUNT or time.time() - start_time > TIME_LIMIT:
                break

            print(f"Przetwarzam link: {link}")
            try:
                headers = {'User-Agent': ua.random}
                response = requests.get(link, headers=headers)
                soup = BeautifulSoup(response.text, 'html.parser')
                link_tags = soup.find_all('a', href=True)

                for tag in link_tags:
                    try:
                        found_link = tag['href']
                        found_link = urljoin(link, found_link)
                        file_response = requests.head(found_link, headers=headers, allow_redirects=True)
                        content_length = file_response.headers.get('content-length')
                        file_size = int(content_length) if content_length else None
                        favicon = f"https://www.google.com/s2/favicons?domain={found_link}"

                        if file_size > 10:
                            print(f"Znaleziono link do pliku: {found_link}")
                            download_links.append({'link': found_link, 'favicon': favicon, 'fileSize': file_size})

                        if len(download_links) >= MAX_LINKS_COUNT or time.time() - start_time > TIME_LIMIT:
                            break
                    except:
                        continue
            except Exception as error:
                print(f"Nie można pobrać zawartości dla linku {link} {error}")

    print(f"Znaleziono łącznie {len(download_links)} linków do plików.")
    return download_links

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('q')
    if not query:
        return jsonify(error="Brak parametru q."), 400

    results = get_urls(query)
    return jsonify(results), 200

@app.route('/', methods=['GET'])
def index():
    query = request.args.get('q')
    if query:
        results = get_urls(query)
        return jsonify(results), 200
    else:
        return "Proszę podać parametr q w zapytaniu.", 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4783)
