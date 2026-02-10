/**
 * svgExporter.js
 * Serializes the SVG for export.
 */

export function getSVGContent(svgElement) {
    if (!svgElement) return null;

    // Clone to ensure we don't mess up the live one?
    // Or just serialize.
    // We already use inline styles in renderer, so it should be good.

    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgElement);

    // add name spaces.
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    // Add xml declaration
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    return source;
}
