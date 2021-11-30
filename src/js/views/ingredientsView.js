import View from './view.js';
import icons from 'url:../../img/icons.svg';
import inputsView from './inputsView.js';
class ingredientsView extends View {
  _parentElement = document.querySelector('.upload__container');
  _numIngredients;
  _inputs = document.querySelector('.upload__inputs');

  addHandlerUpdateIngredient(handler) {
    this._parentElement.addEventListener(
      'click',
      function (e) {
        const btn = e.target.closest('.btn--tiny');
        const ing = e.target.closest('.btn--inline');
        if (!btn && !ing) return;

        const updateTo = +this._selectBtn(btn);

        if (btn) this._restructurer(updateTo);

        inputsView.Showinputs(ing, String(updateTo));

        if (updateTo > 0 && updateTo <= 9) handler(updateTo);
      }.bind(this)
    );
  }

  _selectBtn(btn) {
    if (btn) return btn.dataset.updateTo;
    else return '';
  }

  _generateMarkupArr() {
    const arr = [];
    for (let i = 0; i < this._data; i++) {
      arr.push(`<button type="button" class="btn--inline upload__ingredients">
    Ingredient ${i + 1}
  </button>`);
    }

    return arr.join('');
  }

  _restructurer(updateTo) {
    if (updateTo < 4) {
      this._inputs.style.gridRow = '3 / span 2';
    }

    if (updateTo >= 4) {
      this._inputs.style.gridRow = '4 / span 2';
    }
    if (updateTo >= 8) {
      this._inputs.style.gridRow = '5 / span 2';
    }
  }

  _generateMarkup() {
    const plusIcon = `
    <button
      type="button"
      class="btn--tiny upload__ingredients--adjust"
      data-update-to="${this._data + 1}"
      ;
    >
      <svg>
        <use href="${icons}#icon-plus-circle"></use>
      </svg>
    </button>
  `;
    const minusIcon = `
  <button
    type="button"
    class="btn--tiny upload__ingredients--adjust"
    data-update-to="${this._data - 1}"
    ;
  >
    <svg>
      <use href="${icons}#icon-minus-circle"></use>
    </svg>
  </button>
  `;

    // Start number of ingredients
    if (this._data === 1) {
      return `${this._generateMarkupArr()}
      <div class="upload__ingredients">
      ${plusIcon}
      </div>`;
    }

    // Number within 2-7
    if (this._data > 1 && this._data < 9) {
      return `${this._generateMarkupArr()}
      <div class="upload__ingredients">
      ${minusIcon}
      ${plusIcon}
      </div>
      `;
    }

    // Eight ingredients
    if (this._data === 9)
      return `${this._generateMarkupArr()}
      <div class="upload__ingredients">
      ${minusIcon}
      </div>
  `;
  }
}

export default new ingredientsView();
