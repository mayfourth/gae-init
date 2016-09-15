# coding: utf-8

from google.appengine.ext import ndb

import model

class HeadlineModel(model.Base):
  name        = ndb.StringProperty(required=True)
  htmlContent = ndb.StringProperty(default='')
  active   =  ndb.StringProperty(default='1')
