#!/bin/bash
# MySQL backup to S3 script
# Usage: ./backup_mysql_to_s3.sh

set -e

# Config
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="root"
DB_PASS="your_password"
DB_NAME="your_db"
BACKUP_DIR="/tmp"
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_$DATE.sql.gz"
S3_BUCKET="s3://your-s3-bucket/backups/"

# Dump MySQL database
mysqldump -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" | gzip > "$BACKUP_FILE"

# Upload to S3
aws s3 cp "$BACKUP_FILE" "$S3_BUCKET"

echo "Backup complete: $BACKUP_FILE -> $S3_BUCKET"
