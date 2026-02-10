/**
 * pngExporter.js
 * Converts SVG to PNG via Canvas.
 */

export function downloadPNG(svgContent, width, height, filename) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
        // Draw white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
            saveAs(blob, filename); // Uses FileSaver.js (global)
            URL.revokeObjectURL(url);
        }, 'image/png');
    };

    img.src = url;
}
