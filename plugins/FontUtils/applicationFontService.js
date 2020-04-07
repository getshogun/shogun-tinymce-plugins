export const getApplicationFonts = (applicationFonts = []) =>
  applicationFonts.map((font) => ({
    text: font,
    value: font,
    type: 'menuitem',
    textStyle: `font-family:${font.value};`,
  }));
