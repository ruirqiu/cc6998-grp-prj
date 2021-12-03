import json
import logging
import urllib3
import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
from boto3.dynamodb.conditions import Attr
from decimal import Decimal
import heapq
from math import sin, cos, sqrt, atan2, radians
import datetime 
import dateutil.tz

def clear_cart(user_id, dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb')

    table = dynamodb.Table('shopping_cart')

    try:
        response = table.delete_item(
            Key={
                'user_id': user_id
            }
        )
    except ClientError as e:
        if e.response['Error']['Code'] == "ConditionalCheckFailedException":
            print(e.response['Error']['Message'])
        else:
            raise
    else:
        return response

def lambda_handler(event, context):
    # TODO implement
    user_id = event["queryStringParameters"]["userId"]
    response = clear_cart(user_id)
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
        },
        'body': json.dumps(response)
    }
