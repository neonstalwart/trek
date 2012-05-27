#!/usr/bin/env node

var usage = [
		'migrate data',
		'',
		'Usage:',
		// TODO: add a -g option for generating an empty migration file
		'$0 [-p <path>] [<migration> | up | down | latest]',
		'',
		'Options:',
		'<path>',
		'	path to application root.  path should contain a trek directory with the migrations.',
		'	default is current working directory.',
		'<migration>',
		'	the sequence number of the specific migration to migrate to.',
		'up',
		'	migrate up to next migration',
		'down',
		'	migrate down from current migration',
		'latest',
		'	migrate to the migration with the largest sequence number.',
		'	this is the default behavior if no othe migration is specified'
	].join('\n'),
	argv = require('optimist')
		.usage(usage)
		['default']('p', process.cwd())
		.argv,
	path = require('path'),
	trekDir = path.join(argv.p, 'trek'),
	migrationSpec = argv._[0] || 'latest',
	// NODE_ENV can be used to switch configuration.  default is 'dev'
	env = process.env.NODE_ENV || 'dev',
	// use the config for this environment
	config = require(path.join(trekDir, 'config'))[env],
	trek = require('../');

// migrate the data
trek.hike(trekDir, migrationSpec, config);