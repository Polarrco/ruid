"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ruid = void 0;
const uuid_1 = require("uuid");
class Ruid {
    static getUuidV1() {
        return (0, uuid_1.v1)().toUpperCase();
    }
    static getUuidV4() {
        return (0, uuid_1.v4)().toUpperCase();
    }
    static transformToBuffer(id) {
        return Ruid.encodeIdString(id);
    }
    static transformToString(id) {
        return Ruid.decodeIdBuffer(id);
    }
    static checkRuidString(ruid) {
        return typeof ruid === "string" && /^[0-9a-f]{32}$/i.test(ruid);
    }
    fromUuid(uuid) {
        const ruidString = Ruid.convertUuidToRuid(uuid);
        return new Ruid(ruidString);
    }
    toString() {
        return this.ruidString;
    }
    toFriendlyString() {
        return `${this.ruidString.slice(0, 4)}-${this.ruidString.slice(4, 8)}-${this.ruidString.slice(8, 16)}-${this.ruidString.slice(16, 20)}-${this.ruidString.slice(20, 32)}`;
    }
    toJSON() {
        return this.ruidString;
    }
    toSqlString() {
        return `X'${this.ruidString}'`;
    }
    toBuffered() {
        return this.ruidBuffer;
    }
    constructor(ruidStringOrRuidBuffer) {
        if (Buffer.isBuffer(ruidStringOrRuidBuffer)) {
            const ruidString = Ruid.decodeIdBuffer(ruidStringOrRuidBuffer);
            if (!Ruid.checkRuidString(ruidString)) {
                throw new Error(`Invalid buffer type reference RUID.`);
            }
            this.ruidBuffer = ruidStringOrRuidBuffer;
            this.ruidString = ruidString;
        }
        else {
            if (ruidStringOrRuidBuffer && !Ruid.checkRuidString(ruidStringOrRuidBuffer)) {
                throw new Error(`Invliad string type reference RUID.`);
            }
            let ruidString = ruidStringOrRuidBuffer;
            if (ruidString === undefined || ruidString.length === 0) {
                ruidString = Ruid.convertUuidToRuid((0, uuid_1.v1)());
            }
            this.ruidString = ruidString.toUpperCase();
            this.ruidBuffer = Buffer.from(ruidString, "hex");
        }
    }
    static decodeIdBuffer(id) {
        return id.toString("hex").toUpperCase();
    }
    static encodeIdString(id) {
        return Buffer.from(id, "hex");
    }
    static convertUuidToRuid(uuid) {
        if (!(0, uuid_1.validate)(uuid)) {
            throw new Error(`Invliad reference UUID.`);
        }
        const ruid = uuid.slice(14, 18) + uuid.slice(9, 13) + uuid.slice(0, 8) + uuid.slice(19, 23) + uuid.slice(24);
        return ruid.toUpperCase();
    }
}
exports.Ruid = Ruid;
//# sourceMappingURL=index.js.map