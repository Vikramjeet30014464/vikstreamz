@ECHO OFF
TITLE Vikstreamz.tru.io website on localhost

ECHO -------------------------Development Server started-------------------------
@ECHO OFF

ECHO Open brower and go to http://localhost or http://127.0.0.1
.\virtualenv\Scripts\activate & python manage.py runserver 127.0.0.1:80









PAUSE