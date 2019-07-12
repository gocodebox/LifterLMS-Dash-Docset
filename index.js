// Require.
const scrape = require( 'website-scraper' ),
	  rimraf = require( 'rimraf' );

// Setup variables.
const dest = 'developer.lifterlms.com/',
	  source = 'https://developer.lifterlms.com';

let downloaded_urls = [],
	rerun_urls = [];

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

const blacklist = [
	'/wp-login.php',
	'google.com/recaptcha/api.js',
	'github.com',
	'github.githubassets.com',
	'raw.githubusercontent.com'
];

const isBlacklisted = function( url ) {

	let is_blacklisted = false;
	blacklist.forEach( function( part ) {
		if ( -1 !== url.indexOf( part ) ) {
			is_blacklisted = true;
		}
	} );

	return is_blacklisted;

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
		} );

		registerAction( 'afterResponse', ( { response } ) => {

			if ( response.statusCode === 300 ) {

				console.log( response.statusCode );
				console.log( response.request.uri.href );

				// rerun 429s later
				if ( 429 === response.statusCode ) {
					rerun_urls.push( response.request.uri.href );
				}

				return null

			}

			return Promise.resolve( response.body );

		} );

	}
}



// Scraping options
const scrapingOptions = {
	urls: [ source ],
	directory: dest,
	recursive: true,
	// maxRecursiveDepth: 5,
	filenameGenerator: 'bySiteStructure',
	urlFilter: function( url ) {

		url = url.split( '?' )[0];
		url = url.split( '#' )[0];

		// Skip blacklisted URLs.
		if ( isBlacklisted( url ) ) {

			return false;

		// skip if it's already been downloaded
		} else if ( -1 !== downloaded_urls.indexOf( url ) ) {
			// console.log( 'already downloaded ' + url );
			return false;

		// Static URLs are okay.
		} else if ( isStatic( url ) ) {

			console.log( 'Downloading: ' + url );
			downloaded_urls.push( url );
			return true;

		// only "local" URLs should be downloaded.
		} else if ( 0 !== url.indexOf( 'https://developer.lifterlms.com' ) ) {
			return false;

		}

		console.log( 'Downloading: ' + url );
		downloaded_urls.push( url );

		return true;

	},
	plugins: [ new ScrapePlugins() ],
};

const start = new Date();
console.log( 'Cleaning existing directory: ' + dest );
rimraf( dest, function() {

	console.log( 'Destination directory removed.' );
	console.log( 'Scraping source from:' + source );

	scrape( scrapingOptions ).then( ( result ) => {

		// console.log( result );
		console.log( 'Scraping Complete.' );
		console.log( 'Downloaded ' + downloaded_urls.length + ' files' );

		console.log( 'urls to rerun' );
		console.log( rerun_urls );

		const millis = new Date() - start;
		const mins = Math.floor( millis / 60000 );
		const secs = ( ( millis % 60000 ) / 1000 ).toFixed( 0 );
		console.log( 'Ran in ' + mins + ':' + ( secs < 10 ? '0' : '' ) + secs );

	} );

} );