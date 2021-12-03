import json
import logging
import urllib3
import boto3
from botocore.exceptions import ClientError

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
            
def get_item(tcin, dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb')

    table = dynamodb.Table('items')

    try:
        response = table.get_item(Key={'id': tcin})
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        if 'Item' in response:
            return response['Item']
        else:
            return {}
            
            
def lambda_handler(event, context):
    print("==========Input==========")
    print(event)
    userId = event["queryStringParameters"]["userID"]

    cart = get_cart(userId)
    print("==========cart==========")
    print(cart)
    
    # get item details
    item_details = []
    if 'items_list' in cart:
        item_list = cart['items_list']
    else:
        item_list = []
        
    for tcin in item_list:
        item = get_item(tcin)
        if 'image_backup' in item:
            item['image_backup'] = list(item['image_backup'])
        if 'description' in item:
            item['description'] = list(item['description'])
        item_details.append(item)
        
    print("=========item details")
    print(item_details)
        
    cart['item_details'] = item_details
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
        }, 
        'body': json.dumps(cart)
    }
