﻿import { StringDecoder } from "string_decoder";
import uuidv1 from "uuid/v1";
import uuidv4 from "uuid/v4";
import validator from "validator";

/**
 * Optimized Global Unique ID for DB store and query.
 *
 * ```
 * Before optimize：
 *
 * 58e0a7d7 - eebc    -  11d8     -  9669     -  0800200c9a66
 *
 * time_low   time_mid   time_high   clockseq    node
 *
 * 0 -> 7     9 -> 12    14 -> 17    19 -> 22    24 -> 35
 *
 * Attention:
 *  The indices of this diagram include `dash (-)` symbols.
 *
 * After optimize：
 *
 * time_high  time_mid  time_low    clockseq   node
 *
 * 11d8   -   eebc    - 58e0a7d7  - 9669     - 0800200c9a66
 * ```
 */
export class Ruid {
  /**
   * Get a v1 uuid.
   */
  public static getUuidV1() {
    return uuidv1().toUpperCase();
  }

  /**
   * Get a v4 uuid.
   */
  public static getUuidV4() {
    return uuidv4().toUpperCase();
  }

  public static transformToBuffer(id: string): Buffer {
    return Ruid.encodeIdString(id);
  }

  public static transformToString(id: Buffer): string {
    return Ruid.decodeIdBuffer(id);
  }

  public static checkRuidString(ruid: string) {
    return typeof ruid === "string" && ruid.length === 32 && validator.isHexadecimal(ruid);
  }

  public fromUuid(uuid: string) {
    const ruidString = Ruid.convertUuidToRuid(uuid);

    return new Ruid(ruidString);
  }

  public toString() {
    return this.ruidString;
  }

  public toJSON() {
    return this.ruidString;
  }

  public toSqlString() {
    return `X'${this.ruidString}'`;
  }

  public toBuffered() {
    return this.ruidBuffer;
  }

  /**
   * @param ruidStringOrRuidBuffer The reference Ruid, could be a string or a buffer type.
   */
  constructor(ruidStringOrRuidBuffer?: string | Buffer) {
    if (Buffer.isBuffer(ruidStringOrRuidBuffer)) {
      const ruidString = Ruid.decodeIdBuffer(ruidStringOrRuidBuffer);

      if (!Ruid.checkRuidString(ruidString)) {
        throw new Error(`Invalid buffer type reference RUID.`);
      }

      this.ruidBuffer = ruidStringOrRuidBuffer;
      this.ruidString = ruidString;
    } else {
      if (ruidStringOrRuidBuffer && !Ruid.checkRuidString(ruidStringOrRuidBuffer)) {
        throw new Error(`Invliad string type reference RUID.`);
      }

      const ruidString = ruidStringOrRuidBuffer ? ruidStringOrRuidBuffer : Ruid.convertUuidToRuid(uuidv1());

      this.ruidString = ruidString.toUpperCase();
      this.ruidBuffer = Buffer.from(ruidString, "hex");
    }
  }

  private static decodeIdBuffer(id: Buffer): string {
    const decoder = new StringDecoder("hex");

    return decoder.end(id).toUpperCase();
  }

  private static encodeIdString(id: string): Buffer {
    return Buffer.from(id, "hex");
  }

  private static convertUuidToRuid(uuid: string): string {
    if (!validator.isUUID(uuid)) {
      throw new Error(`Invliad reference UUID.`);
    }

    const ruid = uuid.slice(14, 18) + uuid.slice(9, 13) + uuid.slice(0, 8) + uuid.slice(19, 23) + uuid.slice(24);

    return ruid.toUpperCase();
  }

  private readonly ruidString: string;
  private readonly ruidBuffer: Buffer;
}
