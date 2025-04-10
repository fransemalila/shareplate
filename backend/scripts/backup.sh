#!/bin/bash

# Configuration
BACKUP_DIR="/backups"
MONGO_CONTAINER="mongodb"
REDIS_CONTAINER="redis"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR/mongodb"
mkdir -p "$BACKUP_DIR/redis"

# MongoDB backup
echo "Starting MongoDB backup..."
docker exec $MONGO_CONTAINER mongodump --out /data/backup
docker cp $MONGO_CONTAINER:/data/backup "$BACKUP_DIR/mongodb/backup_$DATE"
docker exec $MONGO_CONTAINER rm -rf /data/backup
tar -czf "$BACKUP_DIR/mongodb/mongodb_$DATE.tar.gz" -C "$BACKUP_DIR/mongodb" "backup_$DATE"
rm -rf "$BACKUP_DIR/mongodb/backup_$DATE"
echo "MongoDB backup completed"

# Redis backup
echo "Starting Redis backup..."
docker exec $REDIS_CONTAINER redis-cli SAVE
docker cp $REDIS_CONTAINER:/data/dump.rdb "$BACKUP_DIR/redis/redis_$DATE.rdb"
echo "Redis backup completed"

# Clean up old backups
echo "Cleaning up old backups..."
find "$BACKUP_DIR/mongodb" -name "mongodb_*.tar.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR/redis" -name "redis_*.rdb" -mtime +$RETENTION_DAYS -delete

# Upload to S3 (uncomment and configure if needed)
# AWS_ACCESS_KEY_ID="your-access-key" AWS_SECRET_ACCESS_KEY="your-secret-key" \
# aws s3 sync "$BACKUP_DIR" "s3://your-bucket/backups" --delete

echo "Backup process completed" 