grid = $('.project-grid');
grid.isotope({
  itemSelector: '.project-item',

  // percentPosition: true,
  masonry: {
    columnWidth: '.project-grid-sizer'
  },

  sortBy: 'sortIndex',
  getSortData: {
    sortIndex: '[data-sort-index]',
  }
});