'use strict';

var path = require('path'),
	promise = require('promised-io/promise'),
	fs = require('promised-io/fs'),
	when = promise.when,
	trekFilePattern = /^trek\.(\d+)\.js$/;

function getMigrations(treks){
	return when(fs.readdir(treks), function (files) {
		return files.reduceRight(function (acc, file) {
			var match = file.match(trekFilePattern);
			if (match) {
				// don't parseInt this since we want to be able to map back to the filename
				acc.push(match[1]);
			}
			return acc;
		}, []);
	});
}

function getCurrent(treks) {
	// XXX: promised-io/fs#readFile always returns a buffer - https://github.com/kriszyp/promised-io/pull/33
	return when(fs.readFile(path.join(treks, '.trek')), function (buff) {
		return parseInt(buff.toString('utf-8'), 10);
	}, function (err) {
		return 0;
	});
}

function setCurrent(treks, current) {
	return fs.write(path.join(treks, '.trek'), current);
}

function getDestination(migrations, current, destination) {
	var latest = Math.max.apply(Math, migrations),
		first = Math.min.apply(Math, migrations);

	switch (destination) {
		case trek.UP:
			if (current !== latest) {
				current++;
			}
			destination = current;
			break;
		case trek.DOWN:
			if (current !== first) {
				current--;
			}
			destination = current;
			break;
		case trek.LATEST:
			// no validation is required in this case since it is based on the list of migrations
			return latest;
		default:
			// nothing... non-symbolic sequence number
	}

	return destination;
}

// apply migrations from treks as determined by destination and config
function trek(treks, destination, config) {

	// pack a kit
	// apply migrations
	// unpack the kit

	var kit,
		migrations;

	return when(fs.stat(treks), function (stats) {
		when(getMigrations(treks), function (migrations) {
			when(getCurrent(treks), function (current) {
				if (!~migrations.indexOf(current)) {
					console.log('the current migration is missing');
				}
				when(getDestination(migrations, current, destination), function (destination) {
					if (!~migrations.indexOf(destination)) {
						console.log('destination', destination, 'is not reachable');
					}
					else if (destination < current) {
						console.log('migrating down');
					}
					else if (destination > current) {
						console.log('migrating up');
					}
					else {
						console.log('no need to migrate');
					}
				});
			}, function () {
				console.log('could not find the current migration');
			});
		}, function () {
			console.log('something went wrong with searching for migrations at ' + treks);
		});
	}, function () {
		console.log('Path ' + treks + ' does not exist.  Cannot continue the trek.');
	});

/*
	// TODO: build a queue of migrations to apply based on migrationSpec.

	// TODO: change this to a stat
	// see if there is a kit available
	try {
		kit = require(path.join(treks, 'kit'));
	}
	catch (e) {}

	if (kit) {
		return when(kit.pack(/* pass something here /), function (/* kit gives us something /) {
			// TODO: put this in a transaction
			return promise.seq(migrations.map(function (migrate) {
				return function () {
					return migrate(/* pass something here /);
				};
			})).then(function () {
				return when(kit.unpack(/* pass something here /), function (/* ??? /) {
					return true; // ???
				});
			});
		});
	}
*/
}

// generate empty migrations in trekDir based on migrationSpec and config
function generate(treks, config) {
	// TODO
}

// alias trek to trek.hike
trek.hike = trek;

// symbolic migration sequence numbers
trek.UP = 'up';
trek.DOWN = 'down';
trek.LATEST = 'latest';

trek.generate = generate

module.exports = trek;