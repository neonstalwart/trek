# `trek`

data migration

## Usage

```
  trek [-h]
  trek [-p <path>] [<sequence number> | -u | -d | --latest | -g]
```

## Options

```
  -h, --help      print this help message                                                  [boolean]
  -p, --path      path to application root.  path should have a "trek" directory containing the
                  migrations.  default is current working directory.
  -u, --up        migrate up to next migration                                             [boolean]
  -d, --down      rollback current migration                                               [boolean]
  --latest        migrate to the migration with the largest sequence number.  this is the default
                  if no other migration is specified                                       [boolean]
  -g, --generate  generate a new migration                                                 [boolean]
```

## LICENSE
[BSD](http://www.opensource.org/licenses/bsd-license.php)
Copyright (c) 2012, Ben Hockey