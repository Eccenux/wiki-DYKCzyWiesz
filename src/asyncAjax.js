/**
 * MW API call.
 * 
 * Assumes `data.error.info` is provided for API errors (like e.g. edit conflicts).
 * 
 * @param {Object} call Configuration object for `$.ajax`.
 * @returns jQuery promise.
 */
function apiAjax(call) {
	var deferred = $.Deferred();

	$.ajax(call)
		.done(function(data){
			if (data.error) {
				deferred.reject(data.error.info, data);
			}
			else {
				deferred.resolve(data);
			}
		})
		.fail(function(data){
			deferred.reject('$.ajax.fail()', data);
		})
	;

	return deferred.promise();
}

/**
 * MW API call.
 * 
 * Can be used with `await` (2018+ browsers).
 * 
 * @param {Object} call Configuration object for `$.ajax`.
 * @returns ES6 promise.
 */
function apiAsync(call) {
	return new Promise((resolve, reject) => {
		apiAjax(call)
			.done(function(data){
				resolve(data);
			})
			.fail(function(info, data){
				console.error(info, data);
				reject(info);
			})
		;
	})
}

module.exports = { apiAjax, apiAsync };
