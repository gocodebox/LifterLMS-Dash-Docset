// Require.
const scrape = require( 'website-scraper' ),
	  rimraf = require( 'rimraf' );

// Setup variables.
const dest = 'developer.lifterlms.com/',
	  source = 'https://developer.lifterlms.com';

const isStatic = function( url ) {

	const static = [ '.css', '.js', '.png', '.jpg' ];
	let is_static = false;
	static.forEach( function( ext ) {
		if ( -1 !== url.indexOf( ext ) ) {
			is_static = true;
		}
	} );

	return is_static;

}

class ScrapePlugins {
	apply( registerAction ) {
		// add 'docscrape=1' to all requests for non-static resources.
		registerAction( 'beforeRequest', ( { resource, requestOptions } ) => {
			return {
				requestOptions: Object.assign( requestOptions, {
					qs: {
						docscrape: 1,
					}
				} )
			};
		} )
	}
}

// URLs we'll ignore
const blacklist = [ '/wp-login.php', 'google.com/recaptcha/api.js', ];

// Scraping options
const scrapingOptions = {
	urls: [ source ],
	directory: dest,
	recursive: true,
	// maxRecursiveDepth: 5,
	filenameGenerator: 'bySiteStructure',
	urlFilter: function( url ) {

		// Skip blacklisted URLs.
		if ( -1 !== blacklist.indexOf( url ) ) {
			return false;

		// Static URLs are okay.
		} else if ( isStatic( url ) ) {
			return true;
		}

		let addUrl = false;

		// only "local" URLs should be added.
		addUrl = 0 === url.indexOf( 'https://developer.lifterlms.com' );

		if ( addUrl ) {
			console.log( 'Downloading: ' + url );
		}

		return addUrl;

	},
	plugins: [ new ScrapePlugins() ],
};

console.log( 'Cleaning existing directory: ' + dest );
rimraf( dest, function() {
	console.log( 'Destination directory removed.' );
	console.log( 'Scraping source from:' + source );

	scrape( scrapingOptions ).then( ( result ) => {

		console.log( result );
		console.log( 'Scraping Complete.' );

	} );

} );