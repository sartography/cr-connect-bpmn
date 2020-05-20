#!/bin/bash

echo 'Substituting environment variables...'

# The first parameter is a comma-delimited list of paths to files which should be substituted
if [[ -z $1 ]]; then
  echo 'ERROR: No target files given.'
  exit 1
fi

# The second parameter is a comma-delimited list of environment variable names
if [[ -z $2 ]]; then
  echo 'ERROR: No environment variables given.'
  exit 1
fi

# Convert "VAR1,VAR2,VAR3,..." to "\$VAR1 \$VAR2 \$VAR3 ..."
env_list="\\\$${2//,/ \\\$}"  # "\" and "$" are escaped as "\\" and "\$"
for file_path in ${1//,/ }
do
  echo "replacing $env_list in $file_path"

  # Replace strings in the given file(s) in env_list
  envsubst "$env_list" < "$file_path" > "$file_path".tmp && mv "$file_path".tmp "$file_path"

  echo '...'
done

echo 'Finished substituting environment variables.'
for env_var in ${2//,/ }
do
  echo "$env_var = ${!env_var}"
done

# Execute all other commands with parameters
exec "${@:3}"
