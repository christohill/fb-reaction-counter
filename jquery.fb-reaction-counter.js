(function($) {

	$.fn.reactionCounter = function(options) {

		// Plugin settings
		var settings = $.extend({
			pageURL: '',
			clientID: '',
			clientSecret: '',
			postID: '',
			refreshTime: 5,
			defaultCount: 0,
			showOutput: true,
			totalSelector: '.fbr-total',
			totalType: 'selected'
		}, options);

		var pageID;
		var reactions = [];
		var container = this;
		var sections = this.find('[data-reaction]').not('p');
		var accessToken = getAccessToken(settings.clientID, settings.clientSecret);

		// Throw alert if required fields are not met
		if(!settings.pageURL || !settings.clientID || !settings.clientSecret || !settings.postID) {
			alert('Please fill out the required plugin settings: pageURL, clientID, clientSecret, postID');
		}

		// Make sure pageID is set properly
		if(pageID = getPageID(settings.pageURL, accessToken)) {
			settings.postID = getPageID(settings.pageURL, accessToken) + "_" + settings.postID;
		}

		// If we have an access token and a proper postID, start the script
		if(accessToken && settings.postID != null) {

			// Init the script
			init();

		}






		/**
		 * Start the script and poll the services
		 * @return NULL
		 */
		function init() {

			// Loop through all of the reaction sections
			$.each(sections, function(index, value) {

				// Add sections reaction attribute to reactions array
				reactions.push($(this).data('reaction'));

				// Add the counter element to the section
				var counter = $('<span>', {'class': 'fbr-counter'});

				if(settings.appendPrepend === 'append') {
					$(this).append(counter);
				}else {
					$(this).prepend(counter);
				}

			});

			setInterval(getTotals, parseInt(settings.refreshTime) * 1000);
	    	getTotals();

	    }





	    /**
	     * Grab the Facebook page ID from a URL
	     * @param {String} url			The URL of the Facebook page
	     * @param {String} accessToken	App access token
	     * @return {Int} 				The integer value of the ID
	     */
	    function getPageID(url, accessToken) {

	    	var segment = url.substr(url.lastIndexOf('/') + 1);

	    	$.ajax({

	    		url: 'https://graph.facebook.com/v2.9/' + segment + '?access_token=' + accessToken,
	    		method: 'GET',
	    		dataType: 'json',
	    		async: false

	    	})

	    	.done(function(response) {

				pageID = response.id;

			})

			.fail(function(response) {

				settings.postID = null;
				console.log(response.status + ' - ' + response.responseJSON.error.message);

			});

			return pageID;

	    }





		/**
		 * Grab an app access token from Facebook API
		 * @param  {Int/String} clientID     The client ID provided by developers.facebook.com
		 * @param  {Int/String} clientSecret The client secret provided by developers.facebook.com
		 * @return {String}              	 The access token
		 */
		function getAccessToken(clientID, clientSecret) {

			// Set app credentials
			var credentials = {
			    client_id: clientID,
			    client_secret: clientSecret,
			    grant_type: "client_credentials"
			}

			// Make request for access token using above credentials
			$.ajax({
			    url: "https://graph.facebook.com/oauth/access_token?" + $.param(credentials),
			    type: 'GET',
			    dataType: 'json',
			    async: false
			})

			// If successful, set data for return
			.done(function(response) {
				accessToken = response.access_token;
			})

			// If failed, show the user an error
			// Fail quietly in case stream is live
			.fail(function(response) {
				console.log(response.status + ' - ' + response.responseJSON.error.message);
			});

			return accessToken;

		}





		/**
	     * Build the Facebook Graph query, sent the request and return the data
	     * @return NULL
	     */
    	function getTotals() {

    		// Build Facebook Graph query from reactions array
			var query = reactions.map(function (e) {

			    var code = e;
			    var upper = e.toUpperCase();

			    return 'reactions.type(' + upper + ').limit(0).summary(total_count).as(' + code + ')'

			});

			// Add total reactions to query
			query.push('reactions.limit(0).summary(total_count).as(total)');



			// Query Facebook Graph
			$.ajax({
				url: 'https://graph.facebook.com/v2.9/?ids=' + settings.postID + '&fields=' + query.join(',') + '&access_token=' + accessToken,
				method: 'GET',
				dataType: 'json'
			})

			// If successful, populate sections with updated totals
			.done(function(response) {

				var output = [];
				var total = 0;


				// Loop through the responses and get the total amount of votes for the active reactions
				// This prevents using the totals from reactions that arent wanted and makes the percentages more accurate
				$.each(response[settings.postID], function(index, value) {

					if(index != 'total' && index != 'id') {
						total = total + this.summary.total_count
					}

				});


				// Loop through sections and update the totals
				$.each(sections, function(index, value) {

					var reaction = $(this).data('reaction');
					var reactionTotal = response[settings.postID][reaction].summary.total_count;

					$(this).find('.fbr-counter').text(settings.defaultCount + reactionTotal);
					$(this).attr('data-reaction-total', reactionTotal).attr('data-reaction-percent', (reactionTotal / total) * 100);

					// Push current total to console output string
					output.push(reaction + " (" + reactionTotal +  " [" + ((reactionTotal / total) * 100).toFixed(1) + "%])");

				});

				// Set the totals
				// Add the final total to the parent container
				if(settings.totalType === 'selected') {
					container.attr('data-reaction-total', total);
					$(settings.totalSelector).text(total);
				}else if(settings.totalType === 'all') {
					container.attr('data-reaction-total', response[settings.postID].total.summary.total_count);
					$(settings.totalSelector).text(response[settings.postID].total.summary.total_count);
				}


				// Show current totals for overview
				if(settings.showOutput === true) {
					output.push("total(" + total + ")");
					console.log("Data: " + output.join(' | '));
				}

			})

			// If failed, show the user an error
			// Fail quietly in case stream is live
			.fail(function(response) {
				console.log(response.status + ' - ' + response.responseJSON.error.message);
			});

		}


	}

})(jQuery);
