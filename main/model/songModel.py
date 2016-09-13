# coding: utf-8

from google.appengine.ext import ndb

import model


class SongModel(model.Base):
  name     = ndb.StringProperty(required=True)
  audioId = ndb.StringProperty(default='')
  audioUrl = ndb.StringProperty(default='')
  youtubeId = ndb.StringProperty(default='')
  lyrics   = ndb.TextProperty(required=True)

