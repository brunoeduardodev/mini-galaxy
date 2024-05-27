import {
  S3Client,
  CreateBucketCommand,
  PutBucketWebsiteCommand,
  DeletePublicAccessBlockCommand,
  PutBucketAclCommand,
  PutBucketPolicyCommand,
} from '@aws-sdk/client-s3'
import mime from 'mime-types'

import { Meteor } from 'meteor/meteor'
import { S3SyncClient, TransferMonitor } from 's3-sync-client'

type SyncBucketWithFolderOptions = {
  bucketName: string
  localFolder: string
  onProgress?: (progress: number) => void
}

const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: Meteor.settings.aws.accessKeyId,
    secretAccessKey: Meteor.settings.aws.secretAccessKey,
  },
})

export const s3Api = {
  createBucket: async (bucketName: string) => {
    await s3Client.send(
      new CreateBucketCommand({
        Bucket: bucketName,
        ObjectOwnership: 'ObjectWriter',
      }),
    )

    await s3Client.send(new DeletePublicAccessBlockCommand({ Bucket: bucketName }))
    await s3Client.send(new PutBucketAclCommand({ Bucket: bucketName, ACL: 'public-read' }))
  },

  syncBucketWithFolder: async ({
    bucketName,
    localFolder,
    onProgress,
  }: SyncBucketWithFolderOptions) => {
    const { sync } = new S3SyncClient({ client: s3Client })

    const monitor = new TransferMonitor()
    monitor.on('progress', (progress) => onProgress?.(progress))
    await sync(localFolder, `s3://${bucketName}`, {
      monitor,
      commandInput: (input: any) => ({
        ContentType: mime.lookup(input.Key) || 'text/html',
      }),
    })

    return true
  },

  setS3SettingsAsSiteBucket: async (bucketName: string) => {
    const command = new PutBucketWebsiteCommand({
      Bucket: bucketName,
      WebsiteConfiguration: {
        ErrorDocument: {
          Key: 'error.html',
        },
        IndexDocument: {
          Suffix: 'index.html',
        },
      },
    })

    await s3Client.send(command)

    // console.log('Sent command to set S3 settings as site bucket')

    const bucketPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${bucketName}/*`,
        },
      ],
    }

    const putBucketPolicyCommand = new PutBucketPolicyCommand({
      Bucket: bucketName,
      Policy: JSON.stringify(bucketPolicy),
    })

    await s3Client.send(putBucketPolicyCommand)
  },
}
