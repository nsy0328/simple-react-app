import json
import boto3
import os
from botocore.exceptions import ClientError
from datetime import datetime

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
bedrock_agent_client = boto3.client("bedrock-agent-runtime")

table = dynamodb.Table(os.environ['TABLE_NAME'])

def lambda_handler(event, context):
    return {
        'statusCode': 200,
        'body': json.dumps('Success')
    }