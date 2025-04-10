export function drawCenteredText(ctx, text, x, y, maxWidth) {
    const fontSize = fitTextToWidth(text, maxWidth);
    ctx.font = `bold ${fontSize}px Tajawal-Black`;
    const metrics = ctx.measureText(text);
    const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    ctx.fillText(text, x, y + actualHeight / 2 - metrics.actualBoundingBoxDescent);
}

export function fitTextToWidth(text, maxWidth, fontFamily = 'Tajawal-Black', maxFontSize = 70, minFontSize = 8) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    let fontSize = maxFontSize;

    while (fontSize >= minFontSize) {
        context.font = `${fontSize}px ${fontFamily}`;
        const textWidth = context.measureText(text).width;
        if (textWidth <= maxWidth) {
            return fontSize;
        }
        fontSize--;
    }

    
    return minFontSize; // fallback if nothing fits
}