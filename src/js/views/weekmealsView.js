import View from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';
class weekmealsView extends View {
  _parentElement = document.querySelector('.weekmeals__list');
  _errorMessage =
    'No week meals yet. Find a nice recipe and add it to the plan :)';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  addHandlerDeleteWeekmeal(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.weekmeals__delete');

      if (!btn) return;

      handler();
    });
  }

  _generateMarkup() {
    return this._data
      .map(weekmeal => {
        const markup = previewView.render(weekmeal, false);
        return `${previewView._generateHeading()}${markup}`;
      })
      .join('');
  }
}

export default new weekmealsView();
