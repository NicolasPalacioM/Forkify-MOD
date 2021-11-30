import View from './view.js';
import icons from 'url:../../img/icons.svg';
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _numPages;

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkupPage() {
    return `<div class="btn--inline pagination__btn--numPages">
  <span>${this._data.page} of ${this._numPages}</span>
</div>`;
  }

  _generateMarkup() {
    const curPage = this._data.page;
    this._numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1, and there are other pages
    if (curPage === 1 && this._numPages > 1) {
      return ` ${this._generateMarkupPage()} ${this._generateMarkupButton(
        'next'
      )} `;
    }

    // Last page
    if (curPage === this._numPages && this._numPages > 1) {
      return `
      ${this._generateMarkupPage()} ${this._generateMarkupButton('prev')}`;
    }

    // Other pages
    if (curPage < this._numPages) {
      return `
      ${this._generateMarkupButton('prev')}
      ${this._generateMarkupPage()}
      ${this._generateMarkupButton('next')} `;
    }

    // Page 1, and there are no other pages
    return `${this._generateMarkupPage()}`;
  }

  _generateMarkupButton(type) {
    const curPage = this._data.page;
    return `<button data-goto="${
      type === 'prev' ? curPage - 1 : curPage + 1
    }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-${
      type === 'prev' ? 'left' : 'right'
    }"></use>
      </svg>
      <span>Page ${type === 'prev' ? curPage - 1 : curPage + 1} </span>
    </button>`;
  }
}

export default new PaginationView();
