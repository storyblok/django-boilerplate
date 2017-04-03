from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings
import requests
import json

def index(request, **kwargs):
  try:
    path = request.get_full_path()
    if path == '/':
      path = '/' + settings.STORYBLOK_CONFIGURATION['HOME_SLUG']
    

    url = "https://api.storyblok.com/v1/cdn/stories" + path
    
    if request.GET.get('_storyblok', False):
      querystring = {"token": settings.STORYBLOK_CONFIGURATION['PRIVATE_TOKEN'], "version":"draft"}
    else: 
      querystring = {"token": settings.STORYBLOK_CONFIGURATION['PRIVATE_TOKEN']}

    headers = { 'cache-control': "no-cache" }
    
    response = requests.request("GET", url, headers=headers, params=querystring)
  
    return render(request, "index.html.j2", json.loads(response.text))
  except:
    # your error handling goes here
    raise