#Python Script  stockgraph.py
import os,sys,string
#import md5,datetime
##import pytunnel
#import httplib
#import cookielib
#import cgi,cgitb,urllib,urllib2,os.path
#from   urllib2 import urlopen,Request
##import feedparser
#import time
#http://code.google.com/appengine/docs/gettingstarted/handlingforms.html
#

from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app


class MainPage(webapp.RequestHandler):
  def get(self):
    self.response.headers['Content-Type'] = 'text/plain'
    self.response.out.write('Hello, webapp World!')

application = webapp.WSGIApplication(
                                     [('/helloworld', MainPage)],
                                     debug=True)

def main():
  run_wsgi_app(application)

if __name__ == "__main__":
  main()

