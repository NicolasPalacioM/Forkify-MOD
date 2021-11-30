import View from './view.js';
import icons from 'url:../../img/icons.svg';
import inputsView from './inputsView.js';
class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded :)';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _btnAdd = document.querySelector('upload__ingredients-add');
  _inputs = document.querySelector('.upload__inputs');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener(
      'click',
      function () {
        this.toggleWindow();

        if (this._inputs.childNodes.length === 3) inputsView.render(true);
      }.bind(this)
    );
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      const ingredients = document.querySelectorAll('.ingredient');
      const quantities = document.querySelectorAll('.quantity');
      handler(data, [ingredients, quantities]);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
