#!/bin/bash

# Set default values for parameters
SERVER="192.168.162.41"
PORT=5432
DATABASE="nutrinovadb"
LOCALFOLDER="./TestDbScripts"
BACKUPNAME="$(date +%Y%m%d.%H.%M.%S).sql"
SCHEMA="public"

# Function to display a help message and exit if mandatory parameters are missing
function check_mandatory {
    if [ -z "$1" ]; then
        echo "Mandatory parameter $2 is missing."
        echo "Usage: $0 -u USER [-s SERVER] [-p PORT] [-d DATABASE] [-l LOCALFOLDER] [-b BACKUPNAME] [-s SCHEMA] [--password PASSWORD]"
        exit 1
    fi
}

# Parse command line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -s|--server) SERVER="$2"; shift ;;
        -p|--port) PORT="$2"; shift ;;
        -d|--database) DATABASE="$2"; shift ;;
        -u|--user) USER="$2"; shift ;;
        --password) PASSWORD="$2"; shift ;;
        -l|--localfolder) LOCALFOLDER="$2"; shift ;;
        -b|--backupname) BACKUPNAME="$2"; shift ;;
        --schema) SCHEMA="$2"; shift ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

# Check if mandatory parameter is set
check_mandatory "$USER" "USER"

# If password is not set, ask the user
if [ -z "$PASSWORD" ]; then
    read -s -p "Enter your password: " PASSWORD
    echo
fi

# Execute docker command
docker run --rm -e PGPASSWORD="$PASSWORD" -v "$LOCALFOLDER:/usr/backupoutput" -it postgres pg_dump -h "$SERVER" -p "$PORT" -U "$USER" -f "/usr/backupoutput/$BACKUPNAME" -d "$DATABASE" --schema="$SCHEMA"
