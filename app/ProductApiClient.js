//DONE: move this to a file
//ProductApi Client interacts with the products api service to just get the product name

var util = require('util');

var getProduct = function (inProductId,callback) {
	var product;
	console.log('inProductId:' + inProductId);
	if(!util.isNullOrUndefined(inProductId)) {
		//TODO: there is some threading problem with this API, so initializing this every time and using closure .
		var productApiUrl = 'https://api.target.com/products/v3/${productId}';

		var args = {
			path: { "productId": 1 }, // path substitution var 
			//TODO: if you have time parameterize this.
			parameters: { fields : "descriptions", id_type : "TCIN" , key : "43cJWpLjH8Z8oR18KdrZDBKAgLLQKJjz" } // query parameter substitution vars 
		};

		var Client = require('node-rest-client').Client;
		var productApiClient = new Client();
		args.path.productId=inProductId;
		// registering remote methods 
		productApiClient.registerMethod("getProductInfo", productApiUrl, "GET");
		
		//TODO: use proper logging module.
		console.log('productApiClient.methods.getProductInfo'+util.inspect(productApiClient.methods.getProductInfo,false,null));
		//DONE:move this to a separate file
		//productApiClient.get(productApiUrl, function (data, response) {
			productApiClient.methods.getProductInfo(args, function (data, response) {
				//TODO: move this to a separate file.
				console.log('data'+util.inspect(data,false,null));
				if(!util.isNullOrUndefined(data) && 
					!util.isNullOrUndefined(data.product_composite_response) &&  
					!util.isNullOrUndefined(data.product_composite_response.items) &&  
					!util.isNullOrUndefined(data.product_composite_response.items[0]) &&  
				 	!util.isNullOrUndefined(data.product_composite_response.items[0].online_description) ) {
					product = { productId : inProductId ,productName : 'NA'};
					// INFO: data is parsed response body as js object 
					//TODO: make the field to read as configurable
					product.productName = data.product_composite_response.items[0].online_description.value;
					//TODO: replace with better logger.
					console.log('id:' + inProductId + 'data from productAPI' + util.inspect(data.product_composite_response.items[0].online_description,false,null));
					// raw response 
					//console.log('raw response from product api' + response);
					return callback(product);
				} else {
					console.log('data'+util.inspect(data,false,null));
					return callback(product);
				}	
				//TODO: handle error call back.
				//TODO: return correct response code.
			});
	} else {
		return callback(product);
	}
};

module.exports.getProduct = getProduct;