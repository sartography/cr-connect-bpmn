#!/bin/bash

#####################################################################
# Substitutes the given environment variables in the given files.
# Parameters:
# $1: Comma-delimited list of file paths
# $2: Comma-delimited list of environment variables
#####################################################################

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

# Add trailing slash to $BASE_HREF if needed
if [[ "$2" == *"BASE_HREF"* ]]; then
  length=${#BASE_HREF}
  last_char=${BASE_HREF:length-1:1}
  [[ $last_char == "/" ]] && BASE_HREF="$BASE_HREF"; :
fi

# Convert "VAR1,VAR2,VAR3,..." to "\$VAR1 \$VAR2 \$VAR3 ..."
env_list="\\\$${2//,/ \\\$}"  # "\" and "$" are escaped as "\\" and "\$"
for file_path in ${1//,/ }
do
  echo "replacing $env_list in $file_path"

  # Replace strings in the given file(s) in env_list
  envsubst "$env_list" < "$file_path" > "$file_path".tmp && mv "$file_path".tmp "$file_path"

  echo '...'
  #  Wait a second in case envsubst needs more time
  sleep 1

  # If this is the index.html file, rewrite base href.
  # Use @ as a sed delimiter because $BASE_HREF will contain a / character
  if [[ $file_path == *"/index.html"* ]]; then
    sed -i -e 's@<base href\=\"\/\">@<base href\=\"'"$BASE_HREF"'\">@' "$3"
  fi

  # If this is the nginx default.conf file, replace double slashes with single slashes
  if [[ $file_path == *"/default.conf"* ]]; then
    sed -i -e 's@//@/@g' "$file_path"
  fi
done

echo 'Finished substituting environment variables.'
for env_var in ${2//,/ }
do
  echo "$env_var = ${!env_var}"
done

# Execute all other commands with parameters
exec "${@:3}"
