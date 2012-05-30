var path = require('path'),
	promise = require('promised-io/promise'),
	when = promise.when;

function parseSpec(migrationSpec) {
	var current = 0, // TODO: get current migration from a file or something
		dest;

	if (migrationSpec == null) {
		migrationSpec = Number.Infinity;
	}

	switch (migrationSpec) {
		case 'up':
			dest = current + 1;
			break;
		case 'down':
			dest = current -1;
			break;
		default:
			dest = migrationSpec;
	}

	return {
		rollback: dest <  current,
		dest: dest
	};
}

// apply migrations from treks as determined by destination and config
function trek(treks, destination, config) {

	// pack a kit
	// apply migrations
	// unpack the kit

	var kit,
		migrations;

	// TODO: build a queue of migrations to apply based on migrationSpec.

	// TODO: change this to a stat
	// see if there is a kit available
	try {
		kit = require(path.join(treks, 'kit'));
	}
	catch (e) {}

	if (kit) {
		return when(kit.pack(/* pass something here */), function (/* kit gives us something */) {
			// TODO: put this in a transaction
			return promise.seq(migrations.map(function (migrate) {
				return function () {
					return migrate(/* pass something here */);
				};
			})).then(function () {
				return when(kit.unpack(/* pass something here */), function (/* ??? */) {
					return true; // ???
				});
			});
		});
	}
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