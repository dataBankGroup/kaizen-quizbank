import os

# Delete and recreate temp folder
# Periodically run this with heroku run python clear_temp.py
if os.path.exists('temp'):
	os.system('rm -rf temp')
os.makedirs('temp')