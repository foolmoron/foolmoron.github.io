(function() {
  var tags, tagFilters, taggedItems;

  // setup tag filtering
  {
  	tags = [];
    tagFilters = $('[data-tag]');
    taggedItems = $('[data-tags]');

    tagFilters.click(function(e) {
    	var tagFilter = $(e.currentTarget);		
    	var tag = tagFilter.data('tag');
    	if (tags.indexOf(tag) >= 0) {
    		tags.splice(tags.indexOf(tag), 1);
    		tagFilter.removeClass('active');
    	} else {
    		tags.push(tag);
    		tagFilter.addClass('active');
    	}

    	if (tags.length == 0) {
    		taggedItems.removeClass('hidden');
    	} else {
    		for (var i = 0; i < taggedItems.length; i++) {
    			var item = taggedItems.eq(i);
    			var itemTags = item.data('tags');

    			var matchingTag = false;
    			for (var t = 0; t < tags.length; t++) {
    				matchingTag |= itemTags.indexOf(tags[t]) >= 0;
    			};
    			item.toggleClass('hidden', !matchingTag);
    		};
    	}
    });
  }
})()