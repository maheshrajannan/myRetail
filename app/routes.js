var PriceInfo = require('./models/priceInfo');
var util = require('util');
var ProductApiClient = require('./productApiClient');
 
function getPriceInfos(res){
	PriceInfo.find(function(err, priceInfos) {

			var priceProductInfos =[];
			var itemsProcessed = 0;

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			//TODO: add not null function.
			//TODO: check in.
			//TODO: format nicely.
			//TODO: unit testing.
			//TODO: callback mayhem for each price info, call forEachCallback, 
			priceInfos.forEach(function(priceInfo) {
				var product;
				ProductApiClient.getProduct(priceInfo.productId,function(outProduct) {
					product = outProduct;
					console.log('updating product' + util.inspect(product,false,null));
					//var priceProductInfo = {priceInfo:priceInfo ,product : ProductApiClient.getProduct(priceInfo.productId)}
					//Example response: {"id":13860428,"name":"The Big Lebowski (Blu-ray) (Widescreen)","current_price":{"value": 13.49,"currency_code":"USD"}}
					var priceProductInfo = {id:product.productId,name:product.productName,priceInfo:priceInfo};
					//TODO: null check on productId
					console.log('priceInfo' + util.inspect(priceProductInfo,false,null));
					priceProductInfos.push(priceProductInfo);
					//return priceInfo2;
					 itemsProcessed++;
					 console.log('itemsProcessed'+itemsProcessed+'priceInfos.length'+priceInfos.length);
					 if(itemsProcessed == priceInfos.length) {
					 	console.log('returing');
					 	return res.json(priceProductInfos);
					 }
				});

			});

		});
};

module.exports = function(app) {

	// api ---------------------------------------------------------------------
	// get all priceInfos
	app.get('/api/priceInfos', function(req, res) {
		// use mongoose to get all priceInfos in the database
		getPriceInfos(res);
	});

	// create priceInfo and send back all priceInfos after creation
	app.post('/api/priceInfos', function(req, res) {
		// create a priceInfo, information comes from AJAX request from Angular
		PriceInfo.create({
			value : req.body.value,
			currencyCode : req.body.currencyCode,
			productId : req.body.productId,
			done : false
		}, function(err, priceInfo) {
			if (err)
				res.send(err);
			// get and return all the priceInfos after you create another
			getPriceInfos(res);

		});
	});

	// create priceInfo and send back all priceInfos after creation
	app.put('/api/priceInfos', function(req, res) {

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
		getPriceInfos(res);

	});	

	// delete a priceInfo
	app.delete('/api/priceInfos/:priceInfoId', function(req, res) {
		PriceInfo.remove({
			priceInfoId : req.params.priceInfoId
		}, function(err, priceInfo) {
			if (err)
				res.send(err);

			getPriceInfos(res);
		});
	});

	//TODO: remove the front end.
	//TODO: check in.
	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};