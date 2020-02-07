import os
basedir = os.path.abspath(os.path.dirname(__file__))

NAME = "CR Connect Workflow"
CORS_ENABLED = False
DEVELOPMENT = True
SQLALCHEMY_DATABASE_URI = "postgresql://crc_user:crc_pass@db:5432/crc_dev"

print('\n\n*** USING INSTANCE CONFIG ***\n\n')
