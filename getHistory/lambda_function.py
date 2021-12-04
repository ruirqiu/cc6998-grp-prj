import json
import json
import logging
import urllib3
import boto3
from botocore.exceptions import ClientError
from decimal import Decimal
import datetime 
import dateutil.tz

def get_history(user_id, dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb')

    table = dynamodb.Table('history')

    try:
        response = table.get_item(Key={'user_id': user_id})
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        if 'Item' in response:
            return "200", response['Item']
        else:
            return "201", {}

def lambda_handler(event, context):
    print("==========Input==========")
    print(event)
    userId = event["queryStringParameters"]["userId"]
    
    statusCode, history = get_history(userId)
    print("==========history==========")
    print(history)
    
    
    return {
        'statusCode': statusCode,
        'headers': {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
        }, 
        'body': json.dumps(history)
    }
