#!/bin/bash

# Get the absolute path of the script's directory
BASE_DIR="$(dirname "$(realpath "$0")")"

# Define relative data directories based on the script's location
DATA_DIRS=(
    "$BASE_DIR/boot-node/data"
    "$BASE_DIR/node-1/data"
    "$BASE_DIR/node-2/data"
    "$BASE_DIR/node-3/data"
)

# Iterate over each directory and clean up data except for 'key' and 'key.pub'
for DATA_DIR in "${DATA_DIRS[@]}"; do
    echo "Cleaning up data in $DATA_DIR"

    # Check if directory exists before proceeding
    if [[ -d "$DATA_DIR" ]]; then
        find "$DATA_DIR" ! -name 'key' ! -name 'key.pub' -exec rm -rf {} +
    else
        echo "Directory $DATA_DIR does not exist. Skipping..."
    fi
done

echo "Cleanup completed in all nodes."