# `trek`

data migration

## Usage

```
  trek [-h]
  trek [-p <path>] [<sequence number> | -u | -d | --latest | -g]
```

## Options

```
  -h, --help      print this help message
  -p, --path      path to application root.  path should have a "trek" directory
                  containing the migrations.  default is current working directory.
  -u, --up        migrate up to next migration
  -d, --down      rollback current migration
  --latest        migrate to the migration with the largest sequence number.  this is
                  the default if no other migration is specified
  -g, --generate  generate a new migration
```

## LICENSE
[BSD](http://www.opensource.org/licenses/bsd-license.php)
Copyright (c) 2012, Ben Hockey