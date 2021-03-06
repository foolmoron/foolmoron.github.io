(function() {
  var grid, projectItems;
  grid = $('.project-grid');

  // ditch if this script doesn't apply
  if (!grid.length) {
    return;
  }

  // setup grid
  {
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
    projectItems.on('mouseover touchstart', function(e) {
      clearTimeout(restoreColorTimeout);
      projectItems.addClass('gray');
      $(e.currentTarget).removeClass('gray');
      $(e.currentTarget).addClass('hover'); // force hover
    });
    projectItems.on('mouseout touchend', function(e) {
      $(e.currentTarget).removeClass('hover'); // force unhover
      // debounce color restoration so we know that no for sure no other item has been moused over
      clearTimeout(restoreColorTimeout);
      restoreColorTimeout = setTimeout(function() {
        projectItems.removeClass('gray');
      }, 50);
    });
  }
})()