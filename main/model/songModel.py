# coding: utf-8

from google.appengine.ext import ndb

import model

#http://stackoverflow.com/questions/31609614/model-validator-goople-app-engine-badvalueerror
#active   =  ndb.IntegerProperty(default=1)
class SongModel(model.Base):
  name     = ndb.StringProperty(required=True)
  audioId = ndb.StringProperty(default='')
  audioUrl = ndb.StringProperty(default='')
  youtubeId = ndb.StringProperty(default='')
  lyrics   = ndb.TextProperty(required=True)
  active   =  ndb.StringProperty(default='1')
  viewCount   = ndb.StringProperty(default='0')
