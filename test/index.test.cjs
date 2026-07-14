const assert = require("node:assert/strict");
const { describe, it } = require("node:test");
const { validate: validateUuid, version: uuidVersion } = require("uuid");
const { Ruid } = require("..");

const FIXTURE_UUID_V1 = "58e0a7d7-eebc-11d8-9669-0800200c9a66";
const FIXTURE_UUID_V4 = "123e4567-e89b-42d3-a456-426614174000";
const FIXTURE_RUID = "11D8EEBC58E0A7D796690800200C9A66";

describe("Ruid", () => {
  it("generates a valid RUID when constructed without a value", () => {
    const ruid = new Ruid();

    assert.equal(Ruid.checkRuidString(ruid.toString()), true);
    assert.equal(ruid.toString(), ruid.toString().toUpperCase());
    assert.deepEqual(ruid.toBuffered(), Buffer.from(ruid.toString(), "hex"));
  });

  it("preserves the legacy empty-string constructor behavior", () => {
    assert.equal(Ruid.checkRuidString(new Ruid("").toString()), true);
  });

  it("normalizes a string RUID and exposes every serialized form", () => {
    const ruid = new Ruid(FIXTURE_RUID.toLowerCase());

    assert.equal(ruid.toString(), FIXTURE_RUID);
    assert.equal(ruid.toFriendlyString(), "11D8-EEBC-58E0A7D7-9669-0800200C9A66");
    assert.equal(ruid.toSqlString(), `X'${FIXTURE_RUID}'`);
    assert.deepEqual(ruid.toBuffered(), Buffer.from(FIXTURE_RUID, "hex"));
    assert.equal(ruid.toJSON(), FIXTURE_RUID);
    assert.equal(JSON.stringify({ id: ruid }), `{"id":"${FIXTURE_RUID}"}`);
  });

  it("constructs the same RUID from its binary representation", () => {
    const ruid = new Ruid(Buffer.from(FIXTURE_RUID, "hex"));

    assert.equal(ruid.toString(), FIXTURE_RUID);
    assert.deepEqual(ruid.toBuffered(), Buffer.from(FIXTURE_RUID, "hex"));
  });

  it("converts a v1 UUID using the stable database byte ordering", () => {
    const source = new Ruid(FIXTURE_RUID);
    const converted = source.fromUuid(FIXTURE_UUID_V1);

    assert.equal(converted.toString(), FIXTURE_RUID);
    assert.deepEqual(converted.toBuffered(), Buffer.from(FIXTURE_RUID, "hex"));
    assert.equal(source.toString(), FIXTURE_RUID);
  });

  it("converts UUID versions other than v1 without changing the public algorithm", () => {
    assert.equal(new Ruid().fromUuid(FIXTURE_UUID_V4).toString(), "42D3E89B123E4567A456426614174000");
  });

  for (const [label, generateUuid, expectedVersion] of [
    ["v1", Ruid.getUuidV1, 1],
    ["v4", Ruid.getUuidV4, 4],
  ]) {
    it(`generates an uppercase, valid ${label} UUID`, () => {
      const uuid = generateUuid();

      assert.equal(validateUuid(uuid), true);
      assert.equal(uuidVersion(uuid), expectedVersion);
      assert.equal(uuid, uuid.toUpperCase());
    });
  }

  it("round-trips between RUID strings and buffers", () => {
    const buffer = Buffer.from(FIXTURE_RUID, "hex");

    assert.deepEqual(Ruid.transformToBuffer(FIXTURE_RUID), buffer);
    assert.equal(Ruid.transformToString(buffer), FIXTURE_RUID);
  });

  for (const ruid of [FIXTURE_RUID, FIXTURE_RUID.toLowerCase()]) {
    it(`accepts a 32-character hexadecimal RUID: ${ruid}`, () => {
      assert.equal(Ruid.checkRuidString(ruid), true);
    });
  }

  for (const ruid of ["", "A".repeat(31), "A".repeat(33), "G".repeat(32), `X'${FIXTURE_RUID}'`, null, undefined, 123]) {
    it(`rejects an invalid RUID value: ${String(ruid)}`, () => {
      assert.equal(Ruid.checkRuidString(ruid), false);
    });
  }

  it("rejects invalid constructor and UUID inputs with the existing errors", () => {
    assert.throws(() => new Ruid("G".repeat(32)), {
      message: "Invliad string type reference RUID.",
    });
    assert.throws(() => new Ruid(Buffer.alloc(15)), {
      message: "Invalid buffer type reference RUID.",
    });
    assert.throws(() => new Ruid().fromUuid("not-a-uuid"), {
      message: "Invliad reference UUID.",
    });
  });
});
