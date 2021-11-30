import View from './view.js';
import icons from 'url:../../img/icons.svg';
class inputsView extends View {
  _parentElement = document.querySelector('.upload__inputs');
  _column = this._parentElement.closest('.upload__column');

  constructor() {
    super();
    this._addHandlerVerifyQuantity();
  }

  _generateMarkup() {
    const arr = [];
    for (let i = 0; i <= 9; i++) {
      arr.push(`<div class="upload__input ${
        i === 0 ? '' : 'hidden'
      }" data-switch-to="${i + 1}">
          <label>Item</label>
          <input class="ingredient" type="text" name="Item" placeholder="e.g. Russet potatoes" />
          <label>Quantity</label>
          <input class="quantity" type="text" name="Quantity" placeholder="e.g. 2 or 1 kg" />
        </div>`);
    }

    return arr.join('');
  }

  Showinputs(ing, ingredientNum) {
    const inputArr = Array.from(this._parentElement.childNodes).filter(el => {
      if (el.dataset?.switchTo) return el;
    });

    console.log(ingredientNum);

    inputArr.forEach(el => {
      let num;
      if (ing) num = ing.textContent.trim();
      const number = num ? num[num.length - 1] : ingredientNum;
      if (el.dataset.switchTo === number) el.classList.remove('hidden');
      else el.classList.add('hidden');
    });
  }

  _addHandlerVerifyQuantity() {
    this._parentElement.addEventListener(
      'keyup',
      function (e) {
        const quant = e.target.closest('.quantity');
        if (!quant) return;

        const error = document.createElement('p');
        error.textContent =
          'Wrong format. Please, use: Number or Number and unit';
        console.log(error);
        error.classList.add('upload__error');

        if (
          quant.value.split(' ').length > 2 ||
          (quant.value.split(' ').length === 1 && isNaN(quant.value)) ||
          (isNaN(parseInt(quant.value)) && quant.value !== '')
        ) {
          if (!this._column.querySelector('.upload__error'))
            this._column.append(error);
        } else if (this._column.querySelector('.upload__error')) {
          this._column.querySelector('.upload__error').remove();
        }
      }.bind(this)
    );
  }
}

export default new inputsView();
