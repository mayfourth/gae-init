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
    return flask.redirect(flask.url_for('song_list', order='-created'))
  return flask.render_template(
      'ffrog/song_update.html',
      html_class='song-create',
      title='Create Song',
      form=form,
    )


@app.route('/song/')
def song_list():
  song_dbs, song_cursor = model.SongModel.get_dbs()
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
    return flask.redirect(flask.url_for('song_list', order='-modified'))
  return flask.render_template(
      'ffrog/song_update.html',
      html_class='song-update',
      title=song_db.name,
      form=form,
      song_db=song_db,
    )
