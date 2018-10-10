# A Mastodon Bot but Twitter Trend

This is a Mastodon bot using Python to scrape data from Twitter.
The reference of setting up a bot in Python: [Mastodon.py](https://github.com/halcy/Mastodon.py)
The bot also needs [requests](https://pypi.org/project/requests/), [beautifulsoup](https://pypi.org/project/beautifulsoup4/)

Although it is much difficult making a Twitter bot, I still want to know what’s popular on Twitter right now. 

The way to get the trend keywords is to scrape the data from [trends24.in](https://trends24.in/), a website that shows top 10 keywords/hashtags in a region. 

The bot will randomly choose 1 keyword from a random region and do searching on Twitter then take one tweet to toot on Mastodon.

[A Mastodon Bot but Twitter Trend](https://botsin.space/web/statuses/100867829944531807)