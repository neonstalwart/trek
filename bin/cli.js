#!/usr/bin/env node

var path = require('path'),
	trek = require('../'),
	usage = [
		'Usage:',
		'  $0 [-h]',
		'  $0 [-p <path>] [<sequence number> | -u | -d | --latest | -g]'
	].join('\n'),
	args = require('optimist')
		.usage(usage)
		.options({
			h: {
				desc: 'print this help message',
				boolean: true,
				alias: 'help'
			},
			p: {
				desc: 'path to application root.  path should have a "trek" directory containing the migrations.  default is current working directory.',
				alias: 'path'
			},
			u: {
				desc: 'migrate up to next migration',
				boolean: true,
				alias: 'up'
			},
			d: {
				desc: 'rollback current migration',
				boolean: true,
				alias: 'down'
			},
			latest: {
				desc: 'migrate to the migration with the largest sequence number.  this is the default if no other migration is specified',
				boolean: true
			},
			g: {
				desc: 'generate a new migration',
				boolean: true,
				alias: 'generate'
			}
		})
		.wrap(100)
		.check(function (argv) {
				// was a specific sequence number provided?
			var specificSeq = argv._.length,
				// was a symbolic sequence number provided?
				symbolicSeq = argv.u || argv.d || argv.latest,
				// is this a migration command?
				migrate = specificSeq || symbolicSeq,
				// is this a generate command?
				generate = argv.g,
				// was this a request for help?
				help = argv.h;

			if (help) {
				// this is a silent exit since we're just going to print the help message anyway
				return;
			}

			if (migrate && generate) {
				throw new Error('cannot migrate and generate at the same time');
			}

			if (migrate && symbolicSeq && specificSeq) {
				throw new Error('cannot migrate to both a symbolic sequence and specific sequence');
			}

			// TODO: fail if an unsupported option is specified

			// by default, set the "latest" symbolic sequence number if:
			//	this is not a generate command
			//	this is not a request for help
			//	no specific sequence number was provided
			argv.latest = argv.latest || !(generate || help || specificSeq);
		}),
	argv = args.argv,
	// path that holds the migrations
	treks = path.join(argv.p || process.cwd(), 'trek'),
	// sequence we are migrating to
	destination = argv._length ? argv._[0] : argv.u ? trek.UP : argv.d ? trek.DOWN : trek.LATEST,
	// NODE_ENV can be used to switch configuration.  default is 'dev'
	env = process.env.NODE_ENV || 'dev',
	config;

if (argv.h) {
	// just show the help message
	args.showHelp();
}
else {
	try {
		// find the config for this environment
		config = require(path.join(treks, 'config'))[env];
	}
	catch (e) {}

	if (argv.g) {
		// generate a new migration template
		trek.generate(treks, config);
	}
	else {
		// migrate the data
		trek.hike(treks, destination, config);
	}
}
