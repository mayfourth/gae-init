# coding: utf-8

import flask

import config
import model
import util

from main import app


###############################################################################
# Welcome
###############################################################################
@app.route('/')
def welcome():
  headline = '';
  headline_dbs, headline_cursor = model.HeadlineModel.get_dbs()
  if headline_dbs:
      headline = headline_dbs.pop().htmlContent

  song_dbs, song_cursor = model.SongModel.get_dbs()
  #return flask.render_template('welcome.html', html_class='welcome')
  return flask.render_template(
      'welcome.html', 
      html_class='welcome',
      title='Welcome',
      headline=headline,
      song_dbs=song_dbs,
      next_url=util.generate_next_url(song_cursor),
      )


###############################################################################
# Sitemap stuff
###############################################################################
@app.route('/sitemap.xml')
def sitemap():
  response = flask.make_response(flask.render_template(
    'sitemap.xml',
    lastmod=config.CURRENT_VERSION_DATE.strftime('%Y-%m-%d'),
  ))
  response.headers['Content-Type'] = 'application/xml'
  return response


###############################################################################
# Warmup request
###############################################################################
@app.route('/_ah/warmup')
def warmup():
  # TODO: put your warmup code here
  return 'success'
