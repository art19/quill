import Link from '../formats/link';

/**
 * Quill payment format - adds rel=payment to existing link format
 *
 * @module ART19
 * @submodule Components/RichTextEditor
 * @class Payment
 * @extends Quill/Link
 */
class Payment extends Link {

  /**
   * Static method for creating new Payments from a DOM element
   *
   * @method create
   * @return {HTMLElement} our modified DOM element
   * @param value a string to use as the anchor
   * @static
   */

  static create(value) {
    const node = super.create(value);
    node.setAttribute('rel', 'payment');
    return node;
  }
}

Payment.blotName = 'payment';

export default Payment;
