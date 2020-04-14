#!/bin/bash

# The first parameter is the path to the file which should be substituted
if [[ -z $1 ]]; then
  echo 'ERROR: No target file given.'
  exit 1
fi

# Replace strings in the given file that have the format ${ENV_VAR}
envsubst '\$PRODUCTION \$API_URL \$IRB_URL' < "$1" > "$1".tmp && mv "$1".tmp "$1"

# Set DEBUG=true in order to log the replaced file
if [ "$DEBUG" = true ] ; then
  exec cat $1
fi

# Execute all other commands with parameters
exec "${@:2}"
