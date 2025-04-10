export const loadCustomFont = async () => {
    const font = new FontFace('Tajawal-Black', 'url(/fonts/Tajawal-Black.ttf)');
    await font.load();
    document.fonts.add(font);
};