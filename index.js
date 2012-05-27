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


var path = require('path'),
	promise = require('promised-io/promise'),
	when = promise.when;

// apply migrations from trekDir as determined by migrationSpec and config
exports.hike = function (trekDir, migrationSpec, config) {

	// pack a kit
	// apply migrations
	// unpack the kit

	var kit,
		migrations;

	// TODO: build a queue of migrations to apply based on migrationSpec.

	// TODO: change this to a stat
	// see if there is a kit available
	try {
		kit = require(path.join(trekDir, 'kit'));
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
};

// generate empty migrations in trekDir based on migrationSpec and config
exports.generate = function (trekDir, migrationSpec, config) {
	// TODO
}