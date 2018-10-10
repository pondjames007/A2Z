import requests
from bs4 import BeautifulSoup as bs
from mastodon import Mastodon
import random
import time


headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}


def get_trends():
    url = "https://trends24.in/"
    response = requests.get(url, headers=headers)
    html = response.text
    soup = bs(html, "html.parser")
    countries = soup.select('.location-menu__country-header')
    country = random.choice(countries).text
    country = "United States"


    url = url + country.lower().replace(" ", "-")
    response = requests.get(url, headers=headers)
    html = response.text
    soup = bs(html, "html.parser")
    trends = soup.select('.trend-card__list a')[0:10]
    trend = random.choice(trends).text  
    
    return country, trend

def hashtagTweets(q):
    url = "https://twitter.com/search?q=" + q
    response = requests.get(url, headers=headers)
    html = response.text
    soup = bs(html, "html.parser")
    contents = soup.select(".js-tweet-text.tweet-text")

    content = random.choice(contents).text
    content = content.replace(r"pic\.twitter\.com.*", "")

    return content

mastodon = Mastodon(
    client_id = '998176b56fa3a3775818d7bb17967f74e2c6bb70ea76be0bac1a4615ee15a5a1',
    client_secret = '85964afec9489a2d7b5650d1d39aa21b9fbaebb288f7a81216d65e0822a4e902',
    access_token = '31b8e574228841c0ef4c57fb572160968a27a9b6a04b29f0bea7ef697f8d6e0f',
    api_base_url = 'https://botsin.space'
)


while(1):
    [country, trend] = get_trends()
    print(country)
    print(trend)
    content = hashtagTweets(trend.replace("#", "%23"))
    toot = '''A trend keyword/hashtag and a post in {0} right now: {1}\n\n"{2}" '''
    toot = toot.format(country, trend, content)
    message = mastodon.status_post(toot)

    time.sleep(600)
