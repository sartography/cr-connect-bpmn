#!/bin/bash

echo 'Substituting environment variables...'

# The first parameter is a comma-delimited list of paths to files which should be substituted
if [[ -z $1 ]]; then
  echo 'ERROR: No target files given.'
  exit 1
fi

env_list='\$PRODUCTION \$API_URL \$IRB_URL \$HOME_ROUTE \$PORT0'
for file_path in $(echo $1 | sed "s/,/ /g")
do
  echo "replacing $env_list in $file_path"

  # Replace strings in the given file(s) in env_list
  envsubst "$env_list" < "$file_path" > "$file_path".tmp && mv "$file_path".tmp "$file_path"

  echo '...'
done

echo 'Finished substituting environment variables.'
echo "PRODUCTION = $PRODUCTION"
echo "API_URL = $API_URL"
echo "IRB_URL = $IRB_URL"
echo "HOME_ROUTE = $HOME_ROUTE"
echo "PORT0 = $PORT0"

# Execute all other commands with parameters
exec "${@:2}"
