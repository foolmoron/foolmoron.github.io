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
    $(window).on('hashchange load', function() {
      var tagsToFilterBy = location.hash.substr(1).split(',').map(function(tag) { return tag.trim(); });

      if (tagsToFilterBy.length == 0) {
        tagFilters.removeClass('active');
        taggedItems.removeClass('hidden');
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
          item.toggleClass('hidden', !matchingTag);
        };
      }
    });
  }
})()