function searchItem(query, idToken) {
  var params = {'itemName': query}
  var additionalParams =  {
    //If there are any unmodeled query parameters or headers that need to be sent with the request you can add them here
    'headers': {
        'Authorization': idToken
    }
  };

  apigClient.searchGet(params, {}, additionalParams).then(
      res => {
          return res["data"];
      }).catch(result => {})    
}