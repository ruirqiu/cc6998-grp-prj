import json
import os
import logging
import urllib3
import boto3

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)


region = 'us-east-1'
service = 'es'


def search(text):
    url = 'https://search-item-search-dqlmodc2m5iid3hfibwvx3egkq.us-east-1.es.amazonaws.com/_search'
    params = {
          "size": 20,
          "query": {
            "multi_match": {
              "query": text,
              "fields": ["search_text"]
            }
          }
        }
    # search from open search
    #request = urllib3.PoolManager()
    headers = urllib3.make_headers(basic_auth='claireluo:Abcd1234.')
    headers['Content-Type'] = 'application/json'
    try:
        #response = request.request_encode_body('GET', url, headers=headers)
        #response = requests.get(url, auth=HTTPBasicAuth("claire_luo", "Aabbccdd1."), data=json.dumps(params), headers=headers)
        http = urllib3.PoolManager()

        response = http.request('GET',
                        url,
                        body = json.dumps(params),
                        headers = headers,
                        retries = False)
                        
        opensearch_results = json.loads(response.data)['hits']['hits']
        print (opensearch_results)
        return opensearch_results
        
    except Exception as e:
        print(e)
        raise e

def get_items(tcin, dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb')

    table = dynamodb.Table('items')

    try:
        response = table.get_item(Key={'id': tcin})
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        return response



def lambda_handler(event, context):
    query_string = event["params"]["querystring"]["itemName"]
    print("===============query string=========")
    print(query_string)
    
    os_results = search(query_string)
    print("===============open search results =========")
    print(len(os_results), os_results[0])
    
    item_list = []
    for os_result in os_results:
        tcin = os_result['_source']['merchandise_id']
        merchandise = get_items(tcin)
        if 'Item' in merchandise:
            if 'image_backup' in merchandise['Item']:
                merchandise['Item']['image_backup'] = list(merchandise['Item']['image_backup'])
                
            if 'description' in merchandise['Item']:
                merchandise['Item']['description'] = list(merchandise['Item']['description'])
            item_list.append(merchandise['Item'])
    print("===============dynamodb results =========")
    print(len(item_list), item_list)
         
    # TODO implement
    response = {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
        },
        'body': json.dumps(item_list)
    }
    return response
