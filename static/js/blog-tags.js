(function() {
  var tagFilters, taggedItems;
  tagFilters = $('[data-tag]');
  taggedItems = $('[data-tags]');
  
  // setup tag filtering
  {
    tagFilters.click(function(e) {
      var tagsToFilterBy = location.hash.substr(1).split(',').map(function(tag) { return tag.trim(); });

      var tagFilter = $(e.currentTarget);
      var tag = tagFilter.data('tag');

      tagFilter.toggleClass('active', tagsToFilterBy.indexOf(tag) < 0)
      location.hash = tagFilters.filter('.active').get().map(function(item) { return $(item).data('tag'); }).join(',');
    });
  }

  // read hash to determine filters
  {
    var fadeTaggedItemsGenerator = function(fadeSpeed) {
      return function() {
        var tagsToFilterBy = location.hash.substr(1).split(',').map(function(tag) { return tag.trim(); });

        tagFilters.stop();
        if (tagsToFilterBy.length == 0) {
          tagFilters.removeClass('active');
          taggedItems.fadeIn(fadeSpeed);
        } else {
          // activate filter buttons based on tags
          tagFilters.removeClass('active')
          for (var t = 0; t < tagsToFilterBy.length; t++) {
            tagFilters.filter('[data-tag="' + tagsToFilterBy[t] + '"]').addClass('active');
          };
          // hide tagged items based on tags
          for (var i = 0; i < taggedItems.length; i++) {
            var item = taggedItems.eq(i);
            var itemTags = item.data('tags');

            var matchingTag = false;
            for (var t = 0; t < tagsToFilterBy.length; t++) {
              matchingTag |= itemTags.indexOf(tagsToFilterBy[t]) >= 0;
            };
            if (matchingTag) {
              item.fadeIn(fadeSpeed);
            } else {
              item.fadeOut(fadeSpeed);
            }
          };
        }
      };
    };

    $(window).on('load', fadeTaggedItemsGenerator(0)); // make transitions instant on load
    $(window).on('hashchange', fadeTaggedItemsGenerator(300)); // and smoother after that
  }
})()