import extend from 'extend';
import Emitter from '../core/emitter';
import SnowTheme, { SnowTooltip } from './snow';
import icons from '../ui/icons';

class SnowThemeWithPayment extends SnowTheme {
  extendToolbar(toolbar) {
    toolbar.container.classList.add('ql-snow');
    this.buildButtons([].slice.call(toolbar.container.querySelectorAll('button')), icons);
    this.buildPickers([].slice.call(toolbar.container.querySelectorAll('select')), icons);
    this.tooltip = new SnowTooltipWithPayment(this.quill, this.options.bounds);
    if (toolbar.container.querySelector('.ql-link')) {
      this.quill.keyboard.addBinding({ key: 'K', shortKey: true }, function(range, context) {
        toolbar.handlers['link'].call(toolbar, !context.format.link);
      });
    }
  }
}
SnowThemeWithPayment.DEFAULTS = extend(true, {}, SnowTheme.DEFAULTS);


class SnowTooltipWithPayment extends SnowTooltip {
  listen() {
    super.listen();
    this.root.querySelector('select.format-select').addEventListener('change', (({ currentTarget: { value } }) => {
      this.root.setAttribute('data-mode', value);
    }).bind(this));
  }

  save() {
    let { value  } = this.textbox;
    const select = this.root.querySelector('select.format-select');
    switch (this.root.getAttribute('data-mode')) {
      case 'payment': {
        const { scrollTop } = this.quill.root;
        if (this.linkRange) {
          this.quill.formatText(
            this.linkRange,
            'payment',
            value,
            Emitter.sources.USER
          );
          delete this.linkRange;
        } else {
          this.restoreFocus();
          this.quill.format('payment', value, Emitter.sources.USER);
        }
        this.quill.root.scrollTop = scrollTop;
        break;
      }
    }
    super.save();
    this.textbox.value = '';
    select.value = select.querySelector('option').value;
    this.hide();
  }
}
SnowTooltipWithPayment.TEMPLATE = [
  '<select class="format-select">',
  '<option value="link">Link</option>',
  '<option value="payment">Payment</option>',
  '</select>',
  '<a class="ql-preview" target="_blank" href="about:blank"></a>',
  '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">',
  '<a class="ql-action"></a>',
  '<a class="ql-remove"></a>'
].join('');


export { SnowTooltipWithPayment, SnowThemeWithPayment as default };
