const AWS = require('aws-sdk');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { db } = require('../config/database');
const logger = require('../utils/logger');

class VideoRecorder {
  constructor() {
    this.ec2 = new AWS.EC2({
      region: process.env.AWS_REGION || 'us-east-1'
    });
    
    this.s3 = new AWS.S3({
      region: process.env.AWS_REGION || 'us-east-1'
    });

    this.recordingInstances = new Map();
    this.recordingQueue = [];
    this.isProcessing = false;
  }

  async startRecording(recordingSchedule) {
    try {
      logger.info(`Starting recording for event ID: ${recordingSchedule.eventId}`);

      // Get event details
      const event = await db('events')
        .where('id', recordingSchedule.eventId)
        .first();

      if (!event) {
        throw new Error(`Event not found: ${recordingSchedule.eventId}`);
      }

      // Create EC2 instance for recording
      const instanceId = await this.createRecordingInstance(event);
      
      // Store instance info
      this.recordingInstances.set(recordingSchedule.id, {
        instanceId,
        eventId: recordingSchedule.eventId,
        status: 'starting',
        startTime: new Date()
      });

      // Update recording schedule status
      await db('recording_schedules')
        .where('id', recordingSchedule.id)
        .update({
          status: 'recording',
          instanceId: instanceId,
          startedAt: new Date()
        });

      logger.info(`Recording started on instance: ${instanceId}`);
      return instanceId;

    } catch (error) {
      logger.error('Error starting recording:', error);
      throw error;
    }
  }

  async createRecordingInstance(event) {
    try {
      // Launch EC2 instance for recording
      const instanceParams = {
        ImageId: this.getRecordingAMI(),
        MinCount: 1,
        MaxCount: 1,
        InstanceType: process.env.EC2_INSTANCE_TYPE || 't3.medium',
        KeyName: process.env.EC2_KEY_PAIR_NAME,
        SecurityGroupIds: [process.env.EC2_SECURITY_GROUP_ID],
        SubnetId: process.env.EC2_SUBNET_ID,
        IamInstanceProfile: {
          Name: 'PBRRecorderRole'
        },
        UserData: this.generateUserData(event),
        TagSpecifications: [{
          ResourceType: 'instance',
          Tags: [{
            Key: 'Name',
            Value: `PBR-Recorder-${event.id}-${Date.now()}`
          }, {
            Key: 'Purpose',
            Value: 'PBR-Event-Recording'
          }]
        }]
      };

      const result = await this.ec2.runInstances(instanceParams).promise();
      const instanceId = result.Instances[0].InstanceId;

      logger.info(`EC2 instance created: ${instanceId}`);
      return instanceId;

    } catch (error) {
      logger.error('Error creating EC2 instance:', error);
      throw error;
    }
  }

  getRecordingAMI() {
    // Return appropriate AMI for recording (Ubuntu with FFmpeg pre-installed)
    const region = process.env.AWS_REGION || 'us-east-1';
    
    // Ubuntu 22.04 LTS AMIs by region
    const ubuntuAMIs = {
      'us-east-1': 'ami-0c02fb55956c7d316',
      'us-west-2': 'ami-0892d3c7ee96c0bf7',
      'eu-west-1': 'ami-0d71ea30463e0ff3d'
    };

    return ubuntuAMIs[region] || ubuntuAMIs['us-east-1'];
  }

  generateUserData(event) {
    const script = `#!/bin/bash
# PBR Recording Instance Setup Script

# Update system
apt-get update -y
apt-get upgrade -y

# Install required packages
apt-get install -y ffmpeg wget curl unzip

# Install Chrome/Chromium for web automation
apt-get install -y chromium-browser

# Create recording directory
mkdir -p /opt/pbr-recording
cd /opt/pbr-recording

# Download recording script
cat > /opt/pbr-recording/record.sh << 'EOF'
#!/bin/bash

EVENT_ID="${event.id}"
EVENT_TITLE="${event.title}"
PLATFORM="${event.streamingPlatform}"
START_TIME="${event.startTime}"
END_TIME="${event.endTime}"

echo "Starting PBR recording for event: $EVENT_TITLE"

# Start recording based on platform
case $PLATFORM in
  "fox_nation")
    recordFoxNation
    ;;
  "cw")
    recordCW
    ;;
  "cbs")
    recordCBS
    ;;
  "ridepass")
    recordRidePass
    ;;
  *)
    echo "Unknown platform: $PLATFORM"
    exit 1
    ;;
esac

recordFoxNation() {
  # Fox Nation recording logic
  echo "Recording from Fox Nation..."
  
  # Launch Chromium in headless mode
  chromium-browser --headless --disable-gpu --no-sandbox \
    --remote-debugging-port=9222 \
    --user-data-dir=/tmp/chrome-profile &
  
  sleep 5
  
  # Use FFmpeg to record screen
  ffmpeg -f x11grab -r 30 -s 1920x1080 -i :0.0 \
    -c:v libx264 -preset ultrafast -crf 18 \
    -c:a aac -b:a 128k \
    -f segment -segment_time 3600 \
    "/opt/pbr-recording/fox_nation_${event.id}_%03d.mp4" &
  
  FFMPEG_PID=$!
  
  # Wait for recording duration
  sleep 7200  # 2 hours default
  
  # Stop recording
  kill $FFMPEG_PID
  pkill chromium-browser
  
  echo "Fox Nation recording completed"
}

recordCW() {
  # CW Network recording logic
  echo "Recording from CW Network..."
  
  # Similar recording logic for CW
  ffmpeg -f x11grab -r 30 -s 1920x1080 -i :0.0 \
    -c:v libx264 -preset ultrafast -crf 18 \
    -c:a aac -b:a 128k \
    -f segment -segment_time 3600 \
    "/opt/pbr-recording/cw_${event.id}_%03d.mp4" &
  
  FFMPEG_PID=$!
  sleep 7200
  kill $FFMPEG_PID
}

recordCBS() {
  # CBS recording logic
  echo "Recording from CBS..."
  
  # Similar recording logic for CBS
  ffmpeg -f x11grab -r 30 -s 1920x1080 -i :0.0 \
    -c:v libx264 -preset ultrafast -crf 18 \
    -c:a aac -b:a 128k \
    -f segment -segment_time 3600 \
    "/opt/pbr-recording/cbs_${event.id}_%03d.mp4" &
  
  FFMPEG_PID=$!
  sleep 7200
  kill $FFMPEG_PID
}

recordRidePass() {
  # RidePass recording logic
  echo "Recording from RidePass..."
  
  # Similar recording logic for RidePass
  ffmpeg -f x11grab -r 30 -s 1920x1080 -i :0.0 \
    -c:v libx264 -preset ultrafast -crf 18 \
    -c:a aac -b:a 128k \
    -f segment -segment_time 3600 \
    "/opt/pbr-recording/ridepass_${event.id}_%03d.mp4" &
  
  FFMPEG_PID=$!
  sleep 7200
  kill $FFMPEG_PID
}

# Upload recorded files to S3
echo "Uploading recorded files to S3..."
aws s3 sync /opt/pbr-recording/ s3://${process.env.AWS_S3_BUCKET}/recordings/${event.id}/ --delete

# Notify completion
aws sns publish \
  --topic-arn "arn:aws:sns:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:pbr-recording-complete" \
  --message "Recording completed for event ${event.id}: ${event.title}" \
  --subject "PBR Recording Complete"

# Terminate instance
aws ec2 terminate-instances --instance-ids $(curl -s http://169.254.169.254/latest/meta-data/instance-id)

EOF

# Make script executable
chmod +x /opt/pbr-recording/record.sh

# Start recording
/opt/pbr-recording/record.sh > /var/log/pbr-recording.log 2>&1 &
`;

    return Buffer.from(script).toString('base64');
  }

  async stopRecording(recordingScheduleId) {
    try {
      const instanceInfo = this.recordingInstances.get(recordingScheduleId);
      
      if (!instanceInfo) {
        throw new Error(`No recording instance found for schedule: ${recordingScheduleId}`);
      }

      // Terminate EC2 instance
      await this.ec2.terminateInstances({
        InstanceIds: [instanceInfo.instanceId]
      }).promise();

      // Update recording schedule
      await db('recording_schedules')
        .where('id', recordingScheduleId)
        .update({
          status: 'stopped',
          stoppedAt: new Date()
        });

      // Remove from tracking
      this.recordingInstances.delete(recordingScheduleId);

      logger.info(`Recording stopped for schedule: ${recordingScheduleId}`);

    } catch (error) {
      logger.error('Error stopping recording:', error);
      throw error;
    }
  }

  async processRecordingQueue() {
    if (this.isProcessing || this.recordingQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      while (this.recordingQueue.length > 0) {
        const recordingSchedule = this.recordingQueue.shift();
        
        try {
          await this.startRecording(recordingSchedule);
        } catch (error) {
          logger.error(`Failed to start recording for schedule ${recordingSchedule.id}:`, error);
          
          // Update status to failed
          await db('recording_schedules')
            .where('id', recordingSchedule.id)
            .update({
              status: 'failed',
              error: error.message,
              updatedAt: new Date()
            });
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  async addToQueue(recordingSchedule) {
    this.recordingQueue.push(recordingSchedule);
    logger.info(`Added recording schedule ${recordingSchedule.id} to queue`);
    
    // Process queue if not already processing
    if (!this.isProcessing) {
      this.processRecordingQueue();
    }
  }

  async getRecordingStatus(recordingScheduleId) {
    try {
      const instanceInfo = this.recordingInstances.get(recordingScheduleId);
      
      if (!instanceInfo) {
        return { status: 'not_found' };
      }

      // Get instance status from AWS
      const result = await this.ec2.describeInstances({
        InstanceIds: [instanceInfo.instanceId]
      }).promise();

      const instance = result.Reservations[0].Instances[0];
      const status = instance.State.Name;

      return {
        status: status,
        instanceId: instanceInfo.instanceId,
        startTime: instanceInfo.startTime,
        publicIp: instance.PublicIpAddress,
        privateIp: instance.PrivateIpAddress
      };

    } catch (error) {
      logger.error('Error getting recording status:', error);
      return { status: 'error', error: error.message };
    }
  }

  async cleanupCompletedRecordings() {
    try {
      // Find completed recordings
      const completedRecordings = await db('recording_schedules')
        .where('status', 'completed')
        .where('cleanupAt', null);

      for (const recording of completedRecordings) {
        // Clean up S3 files older than 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        if (recording.completedAt < thirtyDaysAgo) {
          await this.cleanupS3Files(recording.eventId);
          
          // Mark as cleaned up
          await db('recording_schedules')
            .where('id', recording.id)
            .update({
              cleanupAt: new Date()
            });
        }
      }

    } catch (error) {
      logger.error('Error cleaning up completed recordings:', error);
    }
  }

  async cleanupS3Files(eventId) {
    try {
      const objects = await this.s3.listObjectsV2({
        Bucket: process.env.AWS_S3_BUCKET,
        Prefix: `recordings/${eventId}/`
      }).promise();

      if (objects.Contents.length > 0) {
        const deleteParams = {
          Bucket: process.env.AWS_S3_BUCKET,
          Delete: {
            Objects: objects.Contents.map(obj => ({ Key: obj.Key }))
          }
        };

        await this.s3.deleteObjects(deleteParams).promise();
        logger.info(`Cleaned up S3 files for event: ${eventId}`);
      }

    } catch (error) {
      logger.error('Error cleaning up S3 files:', error);
    }
  }

  async getRecordingMetrics() {
    try {
      const metrics = await db('recording_schedules')
        .select('status')
        .count('* as count')
        .groupBy('status');

      const totalRecordings = await db('recording_schedules').count('* as total').first();
      const activeRecordings = this.recordingInstances.size;

      return {
        total: totalRecordings.total,
        active: activeRecordings,
        byStatus: metrics.reduce((acc, metric) => {
          acc[metric.status] = parseInt(metric.count);
          return acc;
        }, {})
      };

    } catch (error) {
      logger.error('Error getting recording metrics:', error);
      return { total: 0, active: 0, byStatus: {} };
    }
  }
}

module.exports = VideoRecorder;
