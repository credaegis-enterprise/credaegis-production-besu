DATA_DIRS=(
    "\\wsl.localhost\Ubuntu\home\anuroop_dev\sm\credaegis-smartcontract-demo-\boot-node\data"
    "\\wsl.localhost\Ubuntu\home\anuroop_dev\sm\credaegis-smartcontract-demo-\node-1\data"
    "\\wsl.localhost\Ubuntu\home\anuroop_dev\sm\credaegis-smartcontract-demo-\node-2\data"
    "\\wsl.localhost\Ubuntu\home\anuroop_dev\sm\credaegis-smartcontract-demo-\node-3\data"
)

for DATA_DIR in "${DATA_DIRS[@]}"; do
    echo "Cleaning up data in $DATA_DIR"
    # Change to the data directory and remove everything except key and key.pub
    cd "$DATA_DIR" || { echo "Failed to access $DATA_DIR"; continue; }
    # Remove all files and directories except for key and key.pub
    find . ! -name 'key' ! -name 'key.pub' -exec rm -rf {} +
done

echo "Cleanup completed in all nodes."


# HOW TO CONFIGURE THIS FILE FOR EACH DEVICE LOCALLY
# --------------------------------------------------
#   -> Replace content in DATA_DIRS (line 1) to the path in the local device is BESU is setup on
