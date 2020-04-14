import os
basedir = os.path.abspath(os.path.dirname(__file__))

NAME = "CR Connect Protocol Builder Mock"
CORS_ENABLED = False
DEVELOPMENT = True
TESTING = True
SQLALCHEMY_DATABASE_URI = "postgresql://crc_user:crc_pass@db:5432/pb_test"
SECRET_KEY = 'a really really really really long secret key'

print('\n\n*** USING INSTANCE CONFIG ***\n\n')
