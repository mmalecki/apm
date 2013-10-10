# apm
Anarchy Package Manager - the package manager for [AnarchyOS](https://github.com/juliangruber/anarchyos).

## Paths
Tricky part is how to support "legacy" applications. This means that we have to provide at least:

 * binaries at `/usr/local/bin` and `/usr/local/sbin`
 * libraries at `/usr/local/lib`
 * includes at `/usr/local/include`

A generic solution to that would be to make a package list its own links, relative to prefix (let's stay with `/usr/local`?).

So I thought up this `packet.json` format:

```json
{
  "links": {
    "bin/me": "bin/me",
    "sbin/me-admin": "bin/me-admin",
    "lib/libme.so": "libme.so",
    "include/me.h": "include/me.h"
  }
}
```

This would create links at specified locations, pointing to the installed version.
User would be able to change them with `<p-m> select <packet>@<version>` (this'd relink) or drop into the right subshell with `<p-m> use <packet>@<version>`.

# Dependencies
To ensure that dependencies are satisfied during the compilation, we'll simply be able to execute the compilation in a subshell started with `<p-m> use <dep>@<version>`.

I *think* this frees us from handling recursive dependency trees. Imagine this kind of dependency tree:

  * `a` depends on `b@1.0.0` and `c@1.0.0`
  * `b` depends on `d@1.1.0`
  * `c` depends on `d@1.2.0`

So, we'd compile `b` after dropping to a subshell with `d@1.1.0` and then `c`, after dropping it to a subshell with `d@1.2.0`. Disclaimer: I have no idea if this won't cause some weird linking conflicts.

## Database
The database could live anywhere. Format could be similar to:

```
me
| - 1.0.0
             | - packet.json
             | - bin/me
             | - ...
| - 1.0.1
             | - packet.json
             | - bin/me
             | - ...
```
