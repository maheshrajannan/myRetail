var PriceInfo = require('./models/priceInfo');
var util = require('util');
var ProductApiClient = require('./productApiClient');

function getProduct(res,inProductId){
	console.log('getProduct inProductId:' + inProductId);
	//TODO: format nicely.
	//TODO: unit testing.
	//TODO: callback mayhem for each price info, call forEachCallback, 
	//TODO: add the authentication param
	var product;
	ProductApiClient.getProduct(inProductId,function(foundProduct) {
		console.log('getProduct updating product' + util.inspect(foundProduct,false,null));
		//Example response: {"id":13860428,"name":"The Big Lebowski (Blu-ray) (Widescreen)","current_price":{"value": 13.49,"currency_code":"USD"}}
		if(!util.isNullOrUndefined(foundProduct)) {
			PriceInfo.find(
				{productId:inProductId},
				function(err, foundPriceInfos) {
					if (err)
						res.send(err)
					console.log('foundPriceInfo ' + util.inspect(foundPriceInfos,false,null));
					product = {id:inProductId,name:foundProduct.productName,priceInfos:foundPriceInfos};
					res.json(product);
				});
		} else {
			//TODO: return correct response code.
			console.log('unable to find product#'+inProductId);
			res.json();
		}

	});

};

module.exports = function(app) {

	// api ---------------------------------------------------------------------
	// get all priceInfos
	//TODO: return the correct response code if product is not found.
	app.get('/api/products/:productId', function(req, res) {
		console.log('getProduct:' + req.params.productId);
		// use mongoose to get all priceInfos in the database
		getProduct(res,req.params.productId);
	});

	// create priceInfo and send back all priceInfos after creation
	//TODO: delete this after creating enough test data.
	app.post('/api/products', function(req, res) {
		// create a priceInfo, information comes from AJAX request from Angular
		console.log('Posting' + req.body.productId);
		PriceInfo.create({
			value : req.body.value,
			currencyCode : req.body.currencyCode,
			productId : req.body.productId,
			done : false
		}, function(err, priceInfo) {
			if (err)
				res.send(err);
			res.json(priceInfo);
		});
	});

	// create priceInfo and send back all priceInfos after creation
	app.put('/api/products', function(req, res) {
		//TODO: use a better logger.
		console.log(req);

		PriceInfo.findOneAndUpdate({ priceInfoId: req.body.priceInfoId },
		 { 
		 	currencyCode: req.body.currencyCode,
		 	value: req.body.value
		  }, 
		 function(err, priceInfo) {
		  if (err) throw err;
		  console.log('updated priceInfo ' + priceInfo);
		});
	});	

	// delete a priceInfo
	app.delete('/api/products/:priceInfoId', function(req, res) {
		PriceInfo.remove({
			priceInfoId : req.params.priceInfoId
		}, function(err, priceInfo) {
			if (err)
				res.send(err);

			getPriceInfos(res);
		});
	});

	//TODO: remove the front end.
	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};