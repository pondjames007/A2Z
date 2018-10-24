import requests
from bs4 import BeautifulSoup
import random
from shmarkov import *
from collections import Counter

def getRandomQuestion():
    html = requests.get("https://answers.yahoo.com/answer").text
    soup = BeautifulSoup(html, 'html.parser')
    questions = soup.select(".qHead a")

    question = random.choice(questions).text
    
    return question

def makePairs(text):
    pairs = []
    for i in range(len(text) - 1):
        this_pair = (text[i], text[i+1])
        pairs.append(this_pair)
    
    return pairs

def ngrams_for_sequence(n, seq):
    return [tuple(seq[i:i+n]) for i in range(len(seq) - (n-1))]


text = ""
for i in range(10):
    text += getRandomQuestion() + " "
words = text.split()
print(text)

print()
# char_pairs = ngrams_for_sequence(5, words)
# print(char_pairs)

model = markov_model(5, text)
print(model)
print()
output_text = "".join(gen_from_model(5, model))
print(output_text)