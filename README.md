# `@polarrco/ruid`

RUID stores UUID data in a database-friendly byte order while retaining the UUID's uniqueness. The package preserves
the existing Polarr representation:

```text
UUID: 58e0a7d7-eebc-11d8-9669-0800200c9a66
RUID: 11D8EEBC58E0A7D796690800200C9A66
```

## Usage

```ts
import { Ruid } from "@polarrco/ruid";

const generated = new Ruid();
const fromUuid = generated.fromUuid("58e0a7d7-eebc-11d8-9669-0800200c9a66");

fromUuid.toString(); // 11D8EEBC58E0A7D796690800200C9A66
fromUuid.toFriendlyString(); // 11D8-EEBC-58E0A7D7-9669-0800200C9A66
fromUuid.toSqlString(); // X'11D8EEBC58E0A7D796690800200C9A66'
fromUuid.toBuffered(); // 16-byte Buffer
```

`Ruid.getUuidV1()` and `Ruid.getUuidV4()` return uppercase UUID strings. `Ruid.transformToBuffer()` and
`Ruid.transformToString()` convert between the 32-character hexadecimal form and its 16-byte representation.

## Development

Use Node.js 26 and npm 11:

```sh
npm ci
npm run check
```

The contract suite exercises the packaged CommonJS entry point and enforces 100% line, branch, and function coverage.
