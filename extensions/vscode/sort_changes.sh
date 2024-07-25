#!/bin/bash

# Get the list of unstaged files
unstaged_files=$(git status --short | grep '^[ M]' | awk '{print $2}')

# Get the modification times and sort them
for file in $unstaged_files; do
    if [ -f "$file" ]; then
        echo "$(stat -f %m "$file") $file"
    fi
done | sort -n | awk '{print $2}'
