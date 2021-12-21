import json
import logging
import urllib3
import boto3
from botocore.exceptions import ClientError

STORE_BRAND = ['Whole Foods', 'Wegmans Store','Wine Store','Trader Joes', 'Target', 'Walmart' ]
keywords = [ 'rice', 'egg','water', 'coffee', 'ham','tea','bread',  'milk', 'coke','banana',
    'blueberry','blackberry','mango','oil','salt', 'pepper','sugar','baking sheet','tin roll','foil',
    'syrup','honey','flower','flour','paper','cranberry','lemon','corn', 'cucumber','potato',
    'carrot','cauliflower','broccoli', 'beans', 'mushroom','pear', 'pasta','lettuce', 'asparagus', 'onion',
    'cabbage','dressing','pen','butter','cheese','juice', 'bear', 'beer', 'wine', 'shirt',
    'raspberry', 'strawberry', 'screwdriver', 'wrench', 'soap', 'soup', 'towel', 'pistol', 'bag', 'fork',
    'pan','watch','cookware']
          
# TODO hardcoded now
STORE_KEYWORD_MAPPING={'Walmart': keywords, 'Target': keywords[5:45], 'Whole Foods':keywords[20:60],
        'Trader Joes':keywords[:15],'Wegmans Store':keywords[13:30], 'Wine Store':['water','tea','coffee','syrup','honey','lemon','juice','beer','wine'] }


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
            
            
def get_store(keyword, dynamodb=None):
    store_list = []
    for store in STORE_BRAND:
        if keyword in STORE_KEYWORD_MAPPING[store]:
            store_list.append(store)
    return store_list
            
            
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
        statusCode = "200"
    else:
        item_list = []
        statusCode = "201"
        
    for tcin in item_list:
        item = get_item(tcin)
        if 'image_backup' in item:
            item['image_backup'] = list(item['image_backup'])
        if 'description' in item:
            item['description'] = list(item['description'])
        if 'keyword' in item:
            store_list = get_store(item['keyword'])
            item['store_list'] = store_list
        item_details.append(item)
        
    print("=========item details")
    print(item_details)
        
    cart['item_details'] = item_details
    return {
        'statusCode': statusCode,
        'headers': {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
        }, 
        'body': json.dumps(cart)
    }
