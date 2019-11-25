export function radians_to_degrees(radians: number) {
    var pi = Math.PI;
    return radians * (180 / pi);
}

export function getBlobHeading(heading: number) {
    let degreesHeading = radians_to_degrees(heading);
    degreesHeading = degreesHeading % 360;
    degreesHeading = (degreesHeading + 360 + 22.5) % 360;
    return Math.floor(degreesHeading / 45);
}
