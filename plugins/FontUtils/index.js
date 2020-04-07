import { getBrowserFonts } from './browserFontService';
import GoogleFontService from './googleFontService';
import { getApplicationFonts } from './applicationFontService';
import { sanitizeFont } from './common';

let fontList = [];
const DEFAULT_SEARCH_STR = 'a';

export default {
  // Create combined sorted lists of all fonts
  async initializeFonts(applicationFonts, currentContent) {
    fontList = [
      ...getBrowserFonts(),
      ...(await GoogleFontService.getFontList()),
      ...getApplicationFonts(applicationFonts),
    ].sort((fontA, fontB) => (fontA.text < fontB.text ? -1 : 1));
    GoogleFontService.addStyleSheetInContent(currentContent);
  },

  /**
   * Reload all fonts based on the updatedContent.
   * @param {string} updatedContent
   */
  reinitializeFonts(updatedContent) {
    GoogleFontService.addStyleSheetInContent(updatedContent);
  },

  // Get initial set of fonts to show in font dropdown
  getInitialFonts() {
    const filteredFonts = fontList.filter(
      (font) => font.text.charAt(0).toLowerCase() <= DEFAULT_SEARCH_STR
    );
    if (filteredFonts.length) {
      GoogleFontService.addStyleSheetForFonts(
        filteredFonts.map((font) => sanitizeFont(font.value))
      );
    }
    return filteredFonts;
  },

  // Filter the fonts using the string entered by the user
  async filterFonts(searchStr) {
    const str =
      searchStr && searchStr.length
        ? searchStr.toLowerCase()
        : DEFAULT_SEARCH_STR;
    const filteredFonts = fontList.filter((font) =>
      font.text.toLowerCase().startsWith(str)
    );
    if (filteredFonts.length > 0) {
      await GoogleFontService.addStyleSheetForFontsSync(
        filteredFonts.map((font) => sanitizeFont(font.value))
      );
    }
    return filteredFonts;
  },

  // Check if given font is present in list of fonts
  isFontSupported(fontFamily) {
    const sanitizedFontFamily = sanitizeFont(fontFamily);
    return fontList.filter(
      (font) =>
        font.value === sanitizedFontFamily || font.text === sanitizedFontFamily
    )[0];
  },
};
