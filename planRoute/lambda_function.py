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




# approximate radius of earth in km
R = 6373.0

STORE_RANGE = 20
LAT_RANGE = 0.25
LON_RANGE = 0.5

STORE_BRAND = ['Whole Foods', 'Wegmans Store','Wine Store','Trader Joes', 'Target', 'Walmart' ]
keywords = [ 'pear', 'pen','water', 'coffee', 'ham','tea','bread',  'milk', 'cranberry','banana',
    'blueberry','blackberry','mango','oil','salt', 'pepper','sugar','baking sheet','tin roll','foil',
    'syrup','honey','flower','flour','paper','pan','lemon','corn', 'cucumber','potato',
    'carrot','cauliflower','broccoli', 'beans', 'mushroom','rice', 'pasta','lettuce', 'asparagus', 'onion',
    'cabbage','dressing','egg','butter','cheese','juice']
          
# TODO hardcoded now
STORE_KEYWORD_MAPPING={'Walmart': keywords, 'Target': keywords, 'Whole Foods':keywords[20:],
        'Trader Joes':keywords[:15],'Wegmans Store':keywords[13:30], 'Wine Store':['water','tea','coffee','syrup','honey','lemon','juice'] }

# Walmart lowest for first 40, same last 6
# Wegman highest for all
# Target correct price
# Whole Foods + 0.9
#  Trader Joes (0.7*h+0.3l)

def distance_in_km(lat1, lon1, lat2, lon2):
    lat1_ = radians(lat1)
    lon1_ = radians(lon1)
    lat2_ = radians(lat2)
    lon2_ = radians(lon2)
    
    dlon = lon2_ - lon1_
    dlat = lat2_ - lat1_
    
    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    
    distance = R * c
    
    #print("Result:", distance)
    return distance

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
            
            
def get_stores(lat, lon, dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb')

    table = dynamodb.Table('stores')

    # get stores within range
    try:
        response = table.scan(
            FilterExpression=
                Attr('lat').between(Decimal(str(lat-LAT_RANGE)),Decimal(str(lat+LAT_RANGE))) & Attr('lon').between(Decimal(str(lon-LON_RANGE)), Decimal(str(lon+LON_RANGE)))
        )
        print("============stores ========")
        if 'Count' in response and 'Items' in response:
            print(response['Count'], response['Items'] )
            return response['Items']
        else:
            return []
        
    except ClientError as e:
        print(e.response['Error']['Message'])
        
def get_closest(lat, lon, store_list):
    store_short_list = []
    for store in store_list:
        lat2, lon2 = store['lat'], store['lon']
        distance = distance_in_km(lat,lon, lat2, lon2)
        
        # dict cant be compared 
        brand_id, brand_name, id, name = store['brand_id'], store['brand_name'], store['id'], store['name']
        heapq.heappush(store_short_list, (distance, lat2, lon2, brand_id, brand_name, id, name))
        
    result = []
    for i in range(STORE_RANGE):
    
        store = heapq.heappop(store_short_list)
        result.append(store)
    return result
            
def get_cart_details(user_id):
    cart = get_cart(user_id)
    
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
        
    cart['item_details'] = item_details
    return cart
    
def compare_price(lowest, highest, price, keyword):
    price_list = []
    # Compute price for each shop
    if keyword in keywords[:40]:
        # Walmart lowest bound
        heapq.heappush(price_list, (lowest,'Walmart'))
    else:
        heapq.heappush(price_list, (price,'Walmart'))
        
    # Wegman highest for all
    if keyword in STORE_KEYWORD_MAPPING['Wegmans Store']:
        heapq.heappush(price_list, (highest,'Wegmans Store'))
    
    # Target correct price
    heapq.heappush(price_list, (price,'Target'))
    
    # Whole Foods + 0.9
    if keyword in STORE_KEYWORD_MAPPING['Whole Foods']:
        heapq.heappush(price_list, (price+0.9,'Whole Foods'))
    
    #  Trader Joes (0.7*h+0.3l)
    if keyword in STORE_KEYWORD_MAPPING['Trader Joes']:
        heapq.heappush(price_list, (0.7*highest + 0.3* lowest,'Trader Joes'))
        
    #  Wine Store highest + 1.3
    if keyword in STORE_KEYWORD_MAPPING['Wine Store']:
        heapq.heappush(price_list, (highest+1.3,'Wine Store'))
        
    result = []
    for i in range(len(price_list)):
        result.append(heapq.heappop(price_list))
    return result

def find_price(lowest, highest, price, keyword):
    price_list = {}
    # Compute price for each shop
    if keyword in keywords[:40]:
        # Walmart lowest bound
        price_list['Walmart']=lowest
    else:
        price_list['Walmart']=price
        
    # Wegman highest for all
    if keyword in STORE_KEYWORD_MAPPING['Wegmans Store']:
        price_list['Wegmans Store']=highest
    
    # Target correct price
    price_list['Target']=price
    
    # Whole Foods + 0.9
    if keyword in STORE_KEYWORD_MAPPING['Whole Foods']:
        price_list['Whole Foods']=price+0.9
    
    #  Trader Joes (0.7*h+0.3l)
    if keyword in STORE_KEYWORD_MAPPING['Trader Joes']:
        price_list['Trader Joes']=0.7*highest + 0.3* lowest
        
    #  Wine Store highest + 1.3
    if keyword in STORE_KEYWORD_MAPPING['Wine Store']:
        price_list['Wine Store']=highest+1.3
        
    return price_list




def find_cheapest(item_details, short_list):
    total_price = 0
    route = []
    
    duplicate_check = {}
    
    for item in item_details:
        price_range, price_s, title, tcin, keyword = item['price_range'], item['price'], item['title'], item['id'], item['keyword']
        if " - " in price_range:
            lowest_s, highest_s = price_range.split(" - ")
        elif "-" in price_range:
            lowest_s, highest_s = price_range.split("-")
        elif price_range == '':
            lowest_s, highest_s = price_s, price_s
        else:
            lowest_s, highest_s = price_range, price_range
            
        lowest, highest, price = float(lowest_s.strip("$")), float(highest_s.strip("$")), float(price_s.strip("$"))
        
        # sort price based on low to high using brand
        price_chart = compare_price(lowest, highest, price, keyword)
        
        # process stores near user, already sorted based on distance
        store_by_brand = {'Whole Foods':[], 'Wegmans Store':[],'Wine Store':[],'Trader Joes':[], 'Target':[], 'Walmart':[]}
        for store in short_list:
            # (distance, lat2, lon2, brand_id, brand_name, id, name)
            brand = store[4]
            store_by_brand[brand].append(store)
            
        # go through price chart, see if the brand with the lowest price can be found in nearby store list
        # if not, check the next one
        index  = 0
        for price, brand_name in price_chart:
            if len(store_by_brand[brand_name]) != 0:
                # purcahse this item at this store
                distance, lat2, lon2, brand_id, brand_name, id, name = store_by_brand[brand_name][0]
                if id not in duplicate_check:
                    # this item can not be purchased with previous items at the same location
                    route.append( (distance, lat2, lon2, brand_id, brand_name, id, name, [(tcin ,price)]))
                    duplicate_check[id] = index
                    index += 1
                else:
                    # this item should be purchased with earlier items at the same location
                    index_ = duplicate_check[id]
                    route[index_][7].append((tcin, price))
                total_price += price
                break
            
        
        # if ever executes here, this item can not be purchased near by
        # TODO
    
    # route contains a path to buy cheapest products
    print("=================cheapest===========")    
    print(route)
    print(total_price)
    
    return route, total_price
        
        
        
             


def find_shortest(item_details, short_list):
    total_price = 0
    route = []
    
    # price_map [brand] = {item id:price}
    price_map = {'Whole Foods':{}, 'Wegmans Store':{},'Wine Store':{},'Trader Joes':{}, 'Target':{}, 'Walmart':{}}
       
    # get price of each item from each store
    # process items to keep track of which are not visited yet 
    duplicate_check = {}
    for item in item_details:
        
        price_range, price_s, title, tcin, keyword = item['price_range'], item['price'], item['title'], item['id'], item['keyword']
        if " - " in price_range:
            lowest_s, highest_s = price_range.split(" - ")
        elif "-" in price_range:
            lowest_s, highest_s = price_range.split("-")
        elif price_range == '':
            lowest_s, highest_s = price_s, price_s
        else:
            lowest_s, highest_s = price_range, price_range
        lowest, highest, price = float(lowest_s.strip("$")), float(highest_s.strip("$")), float(price_s.strip("$"))
        
        # find price of each item based on brand
        # price_map_ = {brand: price}
        price_map_ = find_price(lowest, highest, price, keyword)
        for key, val in price_map_.items():
            price_map[key][tcin] = val
        
        duplicate_check[tcin] = 1
        
    # go to the nearest store first, buy all available items
    # then go to cloestest store next to current location
    # repeat until all items covered    
    # TODO: distance not recalculated
    for store in short_list:
        distance, lat2, lon2, brand_id, brand_name, id, name = store
        
        # see which items are sold here
        purchase_here = []
        item_price_map = price_map[brand_name]
        for item_id, item_price in item_price_map.items():
            #print("!!!!!!", item_id,duplicate_check)
            if item_id in duplicate_check:
                # not yet purcahsed:
                # purchase here
                total_price += item_price
                purchase_here.append((item_id ,item_price))
                del duplicate_check[item_id]
        if len(purchase_here) != 0:
            route.append( (distance, lat2, lon2, brand_id, brand_name, id, name, purchase_here))
        
        if not duplicate_check :
            # all items purchased
            break
        
        
    
    # route contains a shortest path to buy all products
    print("=================shortest===========")    
    print(route)
    print(total_price)
    
    return route, total_price
    
    
def google_map_route(lat1,lat2,lon1,lon2):
    url = "https://maps.googleapis.com/maps/api/directions/json?origin="+str(lat1)+"%2C"+str(lon1)+"&destination="+str(lat2)+"%2C"+str(lon2)+"&mode=transit&key=AIzaSyBegMW_bP41xNKWlLy9Op-3U9kDHA8ABJQ"

    payload={}
    headers = {}
    
    http = urllib3.PoolManager()
    response = http.request('GET',
                        url,
                        body = payload,
                        headers = headers,
                        retries = False)
    
    dirs = json.loads(response.data)
    distance = dirs['routes'][0]['legs'][0]['distance']
    duration = dirs['routes'][0]['legs'][0]['duration']
    print(distance['text'], duration['text'])
    
    return dirs, distance, duration
    

def lambda_handler(event, context):
    print("==========Input==========")
    print(event)
    user_id, option, lat, lon = event["params"]["querystring"]["user_id"], event["params"]["querystring"]["route_option"], event["params"]["querystring"]["lat"], event["params"]["querystring"]["lon"]
    if option != "CHEAP":
        option = "SHORT"
    
    # get list of items
    cart = get_cart_details(user_id)
    print("==========cart==========")
    print(cart)
    if 'item_details' not in cart:
        # not buying anything
        return {
            'statusCode': 201,
            'body': json.dumps('Cart Empty')
        }
    
    
    # get closeby stores 
    store_list = get_stores(lat, lon)
    num = len(store_list)
    print("===============store list example========")
    print(store_list[0])
    
    # get closest 20 stores
    short_list = get_closest(lat, lon, store_list) 
    print("===============store short list example========")
    print(short_list[0])
    
    # find order of stores to visit 
    if option=="CHEAP":
        route, total_price = find_cheapest(cart['item_details'], short_list)
    else:
        route, total_price = find_shortest(cart['item_details'], short_list)
    
    
    # plot such route
    total_duration, total_distance = 0, 0
    result = []
    t1,n1 = lat, lon
    for point in route:
        distance, t2, n2, brand_id, brand_name, id, name, purchase_here = point
        dirs, distance, duration = google_map_route(t1,t2,n1,n2)
        result.append(dirs)
        total_duration += float(duration['value'])
        total_distance += float(distance['value'])
        t1,n1 = t2,n2
    t2,n2 = lat,lon
    dirs, distance, duration = google_map_route(t1,t2,n1,n2)
    total_duration += float(duration['value'])
    total_distance += float(distance['value'])
    result.append(dirs)
    
    # convert to east to read units
    total_duration_min = str(int(total_duration/60))+ " min"
    total_distance_mile = str(int(total_distance/1000)) + " km"
    total_price_dollar = "$"+ str(total_price) 
    
    print("===================route======================")
    print(result)
    print(total_price_dollar, total_duration_min, total_distance_mile)
    
    return total_price_dollar, total_duration_min, total_distance_mile, result
