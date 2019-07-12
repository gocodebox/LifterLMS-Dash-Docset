const tar = require ( 'tar' ),
	  fs  = require( 'fs' ),
	  pkg = require( process.cwd() + '/package.json' ),
	  filename = 'LifterLMS.tgz',
	  dest = 'Dash-User-Contributions/docsets/LifterLMS/',
	  docsetfile = dest + 'docset.json',
	  json = require( process.cwd() + '/' + dest + 'docset.json' );

tar.c( {
		gzip: true,
		file: filename,
	},
	[ 'LifterLMS.docset' ]
).then( () => {

	// copy main file.
	fs.copyFileSync( filename, dest + filename );

	// copy version file.
	fs.mkdirSync( dest + 'versions/' + pkg.version, { recursive: true } );
	fs.copyFileSync( filename, dest + 'versions/' + pkg.version + '/' + filename );

	// update the docset file to include new version info.
	json.specific_versions.unshift( {
		version: pkg.version,
		archive: 'versions/' + pkg.version + '/' + filename,
	} );

	// update the docset version.
	json.version = pkg.version;

	// save the docset file changes.
	fs.writeFileSync( docsetfile, JSON.stringify( json, null, 2 ) );

	// Remove the original file
	fs.unlinkSync( filename );

} );