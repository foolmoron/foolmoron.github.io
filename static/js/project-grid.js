(function() {
  var grid, projectItems;

  // setup grid
  {
    grid = $('.project-grid');
    grid.isotope({
      itemSelector: '.project-item',

      percentPosition: true,
      masonry: {
        columnWidth: '.project-grid-sizer'
      },

      sortBy: 'sortIndex',
      getSortData: {
        sortIndex: '[data-sort-index]',
      }
    });
  }

  // gray on hover
  {
    var restoreColorTimeout;
    projectItems = $('.project-item', grid);
    projectItems.mouseover(function(e) {
      clearTimeout(restoreColorTimeout);
      projectItems.addClass('gray');
      $(e.currentTarget).removeClass('gray');
    });
    projectItems.mouseout(function(e) {
      // debounce color restoration so we know that no for sure no other item has been moused over
      clearTimeout(restoreColorTimeout);
      restoreColorTimeout = setTimeout(function() {
        projectItems.removeClass('gray');
      }, 50);
    });
  }
})()