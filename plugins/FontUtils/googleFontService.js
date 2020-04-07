import request from 'axios';
import uniq from 'lodash/uniq';

import { match } from 'inner/utils/string';

const GOOGLE_FONT_API = process.env.GOOGLE_FONT_API;
const GOOGLE_WEBFONT_API = process.env.GOOGLE_WEBFONT_API;
const DEFAULT_FONT_WEIGHT = '400';

let googleFonts = [];
const loadedFonts = {};
let googleFontsFetchPromise;

const getFontControlArray = (fontArr) =>
  fontArr.map((font) => ({
    text: font,
    value: `'${font}'`,
    textStyle: `font-family:'${font}';`,
    type: 'menuitem',
  }));

/**
 * Extract "Barlowe Condensed" from a string formatted as "Barlow Condensed:400"
 * @param {string} font
 */
const getFontFamily = (font) =>
  font.includes(':') ? font.split(':')[0] : font;

// Get google style sheets asynchronously fonts are fetched only if they are not fetched already
const addStyleSheetForFonts = (fontArr, resolveCallback) => {
  const fontsList = fontArr.filter((font) => {
    const fontFamily = getFontFamily(font);
    return googleFonts.includes(fontFamily) && !loadedFonts[font];
  });

  if (fontsList.length) {
    const fontStr = fontsList.join('|');
    const link = document.createElement('link');
    link.href = `${GOOGLE_FONT_API}?family=${fontStr}`;
    link.async = true;
    link.rel = 'stylesheet';
    document.body.appendChild(link);
    link.onload = () => {
      fontsList.forEach((font) => {
        loadedFonts[font] = true;
      });
      if (resolveCallback) resolveCallback();
    };
    return link;
  }

  if (resolveCallback) resolveCallback();
};

// Get google style sheets synchronously
const addStyleSheetForFontsSync = (fontStr) =>
  new Promise((resolve) => {
    if (fontStr && fontStr.length) {
      const resolveFontLoading = () => {
        resolve();
      };
      const link = addStyleSheetForFonts(fontStr, resolveFontLoading);
      link.onerror = resolveFontLoading;
    } else resolve();
  });

/**
 * "font-family: 'Barlowe Condensed'" -> "Barlowe Condensed"
 * @param {string} fontFamily
 * @return {string}
 */
const sanitizeFontFamily = (fontFamily) =>
  fontFamily
    .replace('font-family:', '')
    .replace(/\'/g, '') // eslint-disable-line no-useless-escape
    .trimStart()
    .trimEnd();

/**
 * " 800" -> "800"
 * @param {string|null} fontWeight
 * @return {string}
 */
const sanitizeFontWeight = (fontWeight) =>
  fontWeight
    ? fontWeight.replace('font-weight:', '').trimStart()
    : DEFAULT_FONT_WEIGHT;

/**
 * Function below loads all google fonts used in the text context.
 *
 * 1. Fonts are extracted from the content by parsing all style attributes
 * 2. We try to parse the font-family & font-weight rule
 * 3. We filter out all style attributes without a font-family rule
 * 4. We'll sanitize the values we got (details on it below)
 *
 * @param {string} content
 */
const addStyleSheetInContent = (content) => {
  const fonts = match(content, /style="([^"]*)/g)
    .map((style) => ({
      family: match(style, /font-family:([^;]*)/g)[0],
      weight: match(style, /font-weight:([^;]*)/g)[0],
    }))
    .filter((style) => style.family != null)
    .map(
      (font) =>
        `${sanitizeFontFamily(font.family)}:${sanitizeFontWeight(font.weight)}`
    );

  addStyleSheetForFontsSync(uniq(fonts));
};

// The function will send request to load google font info if its not already done.
// It will return a promise which will resolve in an array of fonts.
const getFontList = () =>
  new Promise((resolve) => {
    if (googleFonts.length) resolve(getFontControlArray(googleFonts));
    if (!googleFontsFetchPromise) {
      googleFontsFetchPromise = request.get(
        `${GOOGLE_WEBFONT_API}?key=${process.env.GOOGLE_API_KEY}`
      );
    }
    googleFontsFetchPromise.then(({ data }) => {
      googleFonts = data.items.map((font) => font.family);
      resolve(getFontControlArray(googleFonts));
    });
    googleFontsFetchPromise.catch(() => {
      resolve(googleFonts);
    });
  });

export default {
  addStyleSheetForFonts,
  addStyleSheetForFontsSync,
  addStyleSheetInContent,
  getFontList,
};
