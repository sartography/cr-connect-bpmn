import os
basedir = os.path.abspath(os.path.dirname(__file__))

NAME = "CR Connect Workflow"
DEVELOPMENT = True
SQLALCHEMY_DATABASE_URI = "postgresql://crc_user:crc_pass@db:5432/crc_dev"

# %s/%i placeholders expected for uva_id and study_id in various calls.
PB_USER_STUDIES_URL = "http://pb:5001/pb/user_studies?uva_id=%s"
PB_INVESTIGATORS_URL = "http://pb:5001/pb/investigators?studyid=%i"
PB_REQUIRED_DOCS_URL = "http://pb:5001/pb/required_docs?studyid=%i"
PB_STUDY_DETAILS_URL = "http://pb:5001/pb/study?studyid=%i"

print('\n\n*** USING INSTANCE CONFIG ***\n\n')
