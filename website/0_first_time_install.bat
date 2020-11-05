@ECHO OFF
TITLE Vikstreamz website install on localhost
ECHO -----------------------Website Installer: Please wait till this winodws automatic closes------------------------

ECHO Installed Python Version: 
python -V

python -m pip install --user virtualenv
python -m venv virtualenv
.\virtualenv\Scripts\activate & pip install -r requirements.txt


PAUSE