import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';

export class PbrAnywhereInfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC for the application
    const vpc = new ec2.Vpc(this, 'PbrAnywhereVPC', {
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 24,
          name: 'Database',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // Security Groups
    const appSecurityGroup = new ec2.SecurityGroup(this, 'AppSecurityGroup', {
      vpc,
      description: 'Security group for PBR Anywhere application',
      allowAllOutbound: true,
    });

    const dbSecurityGroup = new ec2.SecurityGroup(this, 'DbSecurityGroup', {
      vpc,
      description: 'Security group for RDS database',
      allowAllOutbound: false,
    });

    const recordingSecurityGroup = new ec2.SecurityGroup(this, 'RecordingSecurityGroup', {
      vpc,
      description: 'Security group for recording EC2 instances',
      allowAllOutbound: true,
    });

    // Allow app to connect to database
    dbSecurityGroup.addIngressRule(
      appSecurityGroup,
      ec2.Port.tcp(5432),
      'Allow app to connect to database'
    );

    // Allow app to connect to Redis
    const redisSecurityGroup = new ec2.SecurityGroup(this, 'RedisSecurityGroup', {
      vpc,
      description: 'Security group for Redis cluster',
      allowAllOutbound: false,
    });

    redisSecurityGroup.addIngressRule(
      appSecurityGroup,
      ec2.Port.tcp(6379),
      'Allow app to connect to Redis'
    );

    // S3 Bucket for video storage
    const videoBucket = new s3.Bucket(this, 'PbrVideoBucket', {
      bucketName: `pbr-anywhere-videos-${this.account}-${this.region}`,
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      lifecycleRules: [
        {
          id: 'VideoLifecycle',
          enabled: true,
          transitions: [
            {
              storageClass: s3.StorageClass.INFREQUENT_ACCESS,
              transitionAfter: cdk.Duration.days(30),
            },
            {
              storageClass: s3.StorageClass.GLACIER,
              transitionAfter: cdk.Duration.days(90),
            },
          ],
          expiration: cdk.Duration.days(365),
        },
      ],
    });

    // RDS PostgreSQL Database
    const dbInstance = new rds.DatabaseInstance(this, 'PbrDatabase', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_15,
      }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      allocatedStorage: 20,
      maxAllocatedStorage: 100,
      databaseName: 'pbr_anywhere',
      credentials: rds.Credentials.fromGeneratedSecret('pbr_admin'),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      securityGroups: [dbSecurityGroup],
      backupRetention: cdk.Duration.days(7),
      deletionProtection: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Redis Cluster for session management
    const redisSubnetGroup = new elasticache.CfnSubnetGroup(this, 'RedisSubnetGroup', {
      description: 'Subnet group for Redis cluster',
      subnetIds: vpc.privateSubnets.map(subnet => subnet.subnetId),
    });

    const redisCluster = new elasticache.CfnCacheCluster(this, 'RedisCluster', {
      engine: 'redis',
      cacheNodeType: 'cache.t3.micro',
      numCacheNodes: 1,
      vpcSecurityGroupIds: [redisSecurityGroup.securityGroupId],
      cacheSubnetGroupName: redisSubnetGroup.ref,
    });

    // IAM Role for recording instances
    const recordingRole = new iam.Role(this, 'PbrRecorderRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLogsFullAccess'),
      ],
    });

    // Add custom policy for recording instances
    recordingRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'ec2:DescribeInstances',
          'ec2:TerminateInstances',
          'sns:Publish',
        ],
        resources: ['*'],
      })
    );

    // SNS Topic for recording notifications
    const recordingTopic = new sns.Topic(this, 'PbrRecordingTopic', {
      topicName: 'pbr-recording-complete',
      displayName: 'PBR Recording Complete Notifications',
    });

    // CloudFront Distribution for video delivery
    const cloudFrontDistribution = new cloudfront.Distribution(this, 'PbrVideoDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(videoBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        originRequestPolicy: cloudfront.OriginRequestPolicy.CORS_S3_ORIGIN,
      },
      additionalBehaviors: {
        '/recordings/*': {
          origin: new origins.S3Origin(videoBucket),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy: cloudfront.OriginRequestPolicy.CORS_S3_ORIGIN,
        },
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    // Lambda function for processing recording completions
    const recordingProcessor = new lambda.Function(this, 'RecordingProcessor', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          console.log('Processing recording completion:', JSON.stringify(event, null, 2));
          
          // Process the recording completion
          // Update database, trigger notifications, etc.
          
          return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Recording processed successfully' }),
          };
        };
      `),
      timeout: cdk.Duration.seconds(30),
      environment: {
        DATABASE_URL: dbInstance.instanceEndpoint.socketAddress,
        S3_BUCKET: videoBucket.bucketName,
      },
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      securityGroups: [appSecurityGroup],
    });

    // EventBridge rule for SNS notifications
    const recordingRule = new events.Rule(this, 'RecordingRule', {
      eventPattern: {
        source: ['aws.sns'],
        detailType: ['PBR Recording Complete'],
      },
    });

    recordingRule.addTarget(new targets.LambdaFunction(recordingProcessor));

    // CloudWatch Log Group for application logs
    const appLogGroup = new logs.LogGroup(this, 'PbrAppLogGroup', {
      logGroupName: '/pbr-anywhere/application',
      retention: logs.RetentionDays.ONE_MONTH,
    });

    // Outputs
    new cdk.CfnOutput(this, 'VpcId', {
      value: vpc.vpcId,
      description: 'VPC ID for PBR Anywhere application',
    });

    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value: dbInstance.instanceEndpoint.hostname,
      description: 'RDS Database endpoint',
    });

    new cdk.CfnOutput(this, 'VideoBucketName', {
      value: videoBucket.bucketName,
      description: 'S3 bucket for video storage',
    });

    new cdk.CfnOutput(this, 'CloudFrontUrl', {
      value: `https://${cloudFrontDistribution.distributionDomainName}`,
      description: 'CloudFront distribution URL',
    });

    new cdk.CfnOutput(this, 'RedisEndpoint', {
      value: redisCluster.attrRedisEndpointAddress,
      description: 'Redis cluster endpoint',
    });

    // Tags
    cdk.Tags.of(this).add('Application', 'PBR Anywhere');
    cdk.Tags.of(this).add('Environment', 'Production');
    cdk.Tags.of(this).add('Purpose', 'Video Recording and Streaming');
  }
}
