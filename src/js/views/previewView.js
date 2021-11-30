import View from './view.js';
import icons from 'url:../../img/icons.svg';
class PreviewView extends View {
  _parentElement = '';

  _generateMarkup() {
    const id = window.location.hash.slice(1);
    // if (i === 0) return;
    return `
<li class="preview">
  <a class="preview__link ${
    this._data.id === id ? 'preview__link--active' : ''
  }" href="#${this._data.id}">
    <figure class="preview__fig">
      <img src="${this._data.image}" alt="${this._data.title}" crossorigin=""/>
    </figure>
    <div class="preview__data">
      <h4 class="preview__title">${this._data.title}</h4>
      <p class="preview__publisher">${this._data.publisher}</p>
      <div class="preview__user-generated ${this._data.key ? '' : 'hidden'}">
        <svg>
        <use href="${icons}#icon-user"></use>
        </svg>
      </div>
    </div>
  </a>
</li>`;
  }

  _generateHeading() {
    return `<div class="preview__heading">
    <h3 class="heading--2__weekmeal">${this._data.weekday
      .charAt(0)
      .toUpperCase()}${this._data.weekday.slice(1)}</h3>
    <svg class="recipe__info-icon weekmeals__delete">
      <use href=${icons}#icon-delete></use>
</svg>
  </div>`;
  }
}

export default new PreviewView();
