"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function radians_to_degrees(radians) {
    var pi = Math.PI;
    return radians * (180 / pi);
}
exports.radians_to_degrees = radians_to_degrees;
function getBlobHeading(heading) {
    var degreesHeading = radians_to_degrees(heading);
    degreesHeading = degreesHeading % 360;
    degreesHeading = (degreesHeading + 360 + 22.5) % 360;
    return Math.floor(degreesHeading / 45);
}
exports.getBlobHeading = getBlobHeading;
//# sourceMappingURL=angles.js.map