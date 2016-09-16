# coding: utf-8

from flask.ext import wtf
import flask
import wtforms

import auth
import model
import util

from main import app


class SongUpdateForm(wtf.Form):
  name     = wtforms.StringField('Name', [wtforms.validators.required()])
  lyrics   = wtforms.StringField('Lyrics', [wtforms.validators.required()])
  youtubeId = wtforms.StringField('youtubeId', [wtforms.validators.optional()])
  audioId  = wtforms.StringField('audioId', [wtforms.validators.optional()])
  audioUrl  = wtforms.StringField('audioUrl', [wtforms.validators.optional()])
  active  = wtforms.StringField('active', [wtforms.validators.optional()])
  viewCount  = wtforms.StringField('viewCount', [wtforms.validators.optional()])


class HeadlineUpdateForm(wtf.Form):
  name     = wtforms.StringField('Name', [wtforms.validators.required()])
  htmlContent   = wtforms.StringField('HtmlContent', [wtforms.validators.optional()])
  active  = wtforms.StringField('active', [wtforms.validators.optional()])  

@app.route('/song/create/', methods=['GET', 'POST'])
def song_create():
  form = SongUpdateForm()
  if form.validate_on_submit():
    song_db = model.SongModel(
        name    =form.name.data,
        lyrics  =form.lyrics.data,
        youtubeId=form.youtubeId.data,
      )
    song_db.put()
    flask.flash('New Song was successfully created!', category='success')
    return flask.redirect(flask.url_for('song_list', order='-name'))   #order='-created'
  return flask.render_template(
      'ffrog/song_update.html',
      html_class='song-create',
      title='Create Song',
      form=form,
    )

def isAdminUser(auth):
  if auth is None or auth.current_user_db() is None:
      return False

  if "kai" in auth.current_user_db().name.lower():  #TODO
      print "====admin user " , auth.current_user_db().name
      return True
  return False
      
@app.route('/song/')
def song_list():
  if isAdminUser(auth):
      song_dbs, song_cursor = model.SongModel.get_dbs()
  #if auth is not None and auth.current_user_db() is not None and auth.current_user_db().name =='Test':
  #    print auth.current_user_db().name #.current_user_id(); # =='kai.xu.us'
  else:
      song_dbs, song_cursor = model.SongModel.get_dbs(active='1')  #active is a field in SongModel
  return flask.render_template(
      'ffrog/song_list.html',
      html_class='song-list',
      title='Song List',
      song_dbs=song_dbs,
      next_url=util.generate_next_url(song_cursor),
    )


@app.route('/song/<int:song_id>/')
def song_view(song_id):
  song_db = model.SongModel.get_by_id(song_id)
  if not song_db:
    flask.abort(404)
  song_db.viewCount = str(int(song_db.viewCount) + 1)
  song_db.put()
  return flask.render_template(
      'ffrog/song_view.html',
      html_class='song-view',
      title=song_db.name,
      song_db=song_db,
    )

@app.route('/song/<int:song_id>/update/', methods=['GET', 'POST'])
@auth.login_required
def song_update(song_id):
  song_db = model.SongModel.get_by_id(song_id)
  if not song_db:
    flask.abort(404)
  form = SongUpdateForm(obj=song_db)
  if form.validate_on_submit():
    form.populate_obj(song_db)
    song_db.put()
    return flask.redirect(flask.url_for('song_list', order='-modified'))   # order='-modified'
  return flask.render_template(
      'ffrog/song_update.html',
      html_class='song-update',
      title=song_db.name,
      form=form,
      song_db=song_db,
    )

@app.route('/headline/update/', methods=['GET', 'POST'])
def headline_update():
  headline_dbs, headline_cursor = model.HeadlineModel.get_dbs()
  if not headline_dbs:
        form = HeadlineUpdateForm()
        if form.validate_on_submit():
            headline_db = model.HeadlineModel(
                name         =form.name.data,
                htmlContent  =form.htmlContent.data)
            headline_db.put()
            return flask.redirect(flask.url_for('song_list', order='name'))
        return flask.render_template(
            'ffrog/headline_update.html',
            html_class='headline-create',
            title='Create headline',
            form=form,
            )
  else:
        headline_db = headline_dbs.pop()
        form = HeadlineUpdateForm(obj=headline_db)
        if form.validate_on_submit():
            form.populate_obj(headline_db)
            headline_db.put()
            return flask.redirect(flask.url_for('song_list',order='name'))
        return flask.render_template(
            'ffrog/headline_update.html',
            html_class='headline-update',
            title=headline_db.name,
            form=form,
            headline_db=headline_db,
            )