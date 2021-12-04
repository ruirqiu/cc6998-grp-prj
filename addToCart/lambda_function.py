import json
import logging
import urllib3
import boto3
from botocore.exceptions import ClientError
import datetime 
import dateutil.tz

def get_cart(user_id, dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb')

    table = dynamodb.Table('shopping_cart')

    try:
        response = table.get_item(Key={'user_id': user_id})
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        if 'Item' in response:
            return response['Item']
        else:
            return {}


def append_cart(user_id, item_list, timestamp, dynamodb=None):
    
    # TODO: count of each item. how to handle duplciate?
    
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb')

    table = dynamodb.Table('shopping_cart')

    try:
        response = table.update_item(
        Key={
            'user_id': user_id
        },
        UpdateExpression="set items_list=:i, cart_update_time=:c",
        ExpressionAttributeValues={
            ':i': item_list,
            ':c': timestamp
        },
        ReturnValues="UPDATED_NEW"
    )
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        return response

        
def insert_cart(user_id, tcin, timestamp, dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb')

    table = dynamodb.Table('shopping_cart')
    response = table.put_item(
       Item={
            'user_id': user_id,
            'items_list': [tcin],
            'cart_update_time': timestamp
        }
    )
    return response

def lambda_handler(event, context):
    print("==========Input==========")
    print(event)
    userId, tcin = event["queryStringParameters"]["user_id"],event["queryStringParameters"]["tcin"]
    now = datetime.datetime.now(tz=dateutil.tz.gettz('US/Eastern'))
    timestamp = now.strftime('%Y-%m-%dT%H:%M:%S-%Z')
    
    # insert new item into cart
    # if record already exists, append
    cart = get_cart(userId)
    print("==========cart==========")
    print(cart)
    print("==========cart item list==========")
    if cart != {}:
        item_list = cart['items_list']
        item_list.append(tcin)
        print("Appending to cart")
        print(item_list)
        response = append_cart(userId, item_list, timestamp)
    else:
        response = insert_cart(userId, tcin, timestamp)
        print("Creating cart")
        print(tcin)
    
    
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
