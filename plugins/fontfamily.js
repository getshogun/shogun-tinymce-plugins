import FontUtils from './FontUtils';

// Function will help show font of currently selected block in font-family dropdown
const nodeChange = function (nodeElm) {
  let value = null;
  nodeElm.parents.forEach((node) => {
    if (!value) {
      const fontFamily = node.style.getPropertyValue('font-family');
      const fontInfo = FontUtils.isFontSupported(fontFamily);
      if (fontInfo) {
        value = fontInfo.text;
      }
    }
  });
  this.value(value || '');
};

// Function will update the menu items using the value of input box.
// Re-positioning is done after updating as menu height can change.
const inputChange = async function (evt) {
  if (!this.menu || !this.menu.state.data.visible) this.showMenu();
  const searchStr = evt.target.value;

  // Remove old items before fetching new fonts, to avoid async issues
  // Probably a loading state is needed
  const oldItemsCount = this.menu.items().length;
  const oldItems = Object.values(this.menu.items()).slice(0, oldItemsCount);
  oldItems.forEach((item) => {
    // defensive check: remove method exists
    if (item && item.remove) {
      item.remove();
    }
  });

  const searchedItems = await FontUtils.filterFonts(searchStr);
  this.menu.add(searchedItems);

  if (searchedItems.length) {
    this.menu.renderNew();
    this.menu.initLayoutRect();
    this.menu.moveRel(this.getEl(), ['bl-tl', 'tl-bl']);
  } else {
    this.hideMenu();
  }
};

// Show hide menu when wrapper is clicked
const wrapperClick = function (inputElm, evt) {
  inputElm.focus();
  if (!this.menu) {
    this.showMenu();
    evt.stopPropagation();
  } else {
    if (
      this.menu.state.data.visible === false &&
      this.menu.items().length > 0
    ) {
      this.showMenu();
    } else {
      this.hideMenu();
    }
    evt.stopPropagation();
  }
};

// Open menu on ArrowDown
const wrapperKeydown = function (inputElm, evt) {
  if (evt.key !== 'ArrowDown') return;
  if (!this.menu || !this.menu.state.data.visible) {
    inputElm.focus();
    this.showMenu();
  }
};

export default () => {
  window.tinymce.PluginManager.add('fontfamily', (editor) => {
    editor.on('init', () => {
      editor.formatter.register({
        fontfamily: {
          inline: 'span',
          styles: { 'font-family': '%value' },
        },
      });
    });

    editor.addButton('fontfamilyselect', () => ({
      type: 'combobox',
      text: '',
      tooltip: 'Font Family',
      values: FontUtils.getInitialFonts(),
      fixedWidth: true,
      onPostRender() {
        const self = this;
        // Code in below function helps in updating the selected value in toolbar dropdown
        editor.on('NodeChange', nodeChange.bind(this));

        const rootElm = this.getEl();
        const inputElm = rootElm.querySelector('input');

        // Code below will disable browser native aucomplete in input
        inputElm.setAttribute('autocomplete', 'off');
        inputElm.setAttribute('placeholder', 'Font Family');

        self.onInputChange = inputChange.bind(self);
        inputElm.addEventListener('input', self.onInputChange);
        self.onWrapperClick = wrapperClick.bind(self, inputElm);
        rootElm.addEventListener('click', self.onWrapperClick);
        self.onWrapperKeydown = wrapperKeydown.bind(self, inputElm);
        rootElm.addEventListener('keydown', self.onWrapperKeydown);
      },
      onselect() {
        editor.formatter.apply('fontfamily', { value: this.value() });
        editor.fire('change');
      },
      onremove(evt) {
        if (evt.target.type === 'combobox') {
          const rootElm = this.getEl();
          const inputElm = rootElm.querySelector('input');
          inputElm.removeEventListener('input', this.onInputChange);
          rootElm.removeEventListener('click', this.onWrapperClick);
          rootElm.removeEventListener('keydown', this.onWrapperKeydown);
        }
      },
    }));
  });
};
