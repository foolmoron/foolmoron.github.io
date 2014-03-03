//need a less global way of organizing classes, but RequireJS seems like overkill...

var Router = Backbone.Router.extend({
	routes: {
		"": "home",
		":subroute": "subroute",
	},
	
	home: function() {
		console.log("home");
		var contents = {};
		for (i in Contents) {
			contents[i] = new ContentShortView({model: Contents[i]});
		}
		new ContentsView(contents);
	},
	subroute: function(subroute) {
		console.log("subroute=" + subroute);
		if (Contents[subroute]) {
			new ContentsView([new ContentLongView({model: Contents[subroute]})]);
		} else {
			new ContentsView([new ContentInvalidView()]);
		}
	}
});

var Content = Backbone.Model.extend({
	defaults: {
		id: "",
		title: "No Title",
		description: "No Description",
		color: [255, 0, 0],
		imageURL: "http://epaper2.mid-day.com/images/no_image_thumb.gif"
	},
	toJSON: function() {
		return _.extend(Backbone.Model.prototype.toJSON.call(this), { // "computed properties"
			colorString: 'rgb(' + this.get('color').join(', ') + ')'
		});
	}
});

var ContentShortView = Backbone.View.extend({
    tagName: 'div class="contentShort"',
	
	initialize: function() {
		_.bindAll(this, 'render');
		this.contentTemplate = $('#templateContentShort').html();
	},
	render: function() {
		var self = this;
		var el = $(this.el);
		
		var content = _.template(this.contentTemplate, this.model.toJSON());
		el.html(content);
		
		return this;
	}
});

var ContentLongView = Backbone.View.extend({
    tagName: 'div class="contentLong"',
	
	initialize: function() {
		_.bindAll(this, 'render');
		this.contentTemplate = $('#templateContentLong').html();
	},
	render: function() {
		var self = this;
		var el = $(this.el);
		
		var content = _.template(this.contentTemplate, this.model.toJSON());
		el.html(content);
		
		return this;
	}
});

var ContentInvalidView = Backbone.View.extend({
    tagName: 'div',
	
	initialize: function() {
		_.bindAll(this, 'render');
		this.contentTemplate = $('#templateContentInvalid').html();
	},
	render: function() {
		var self = this;
		var el = $(this.el);
		
		var content = _.template(this.contentTemplate, {hash: document.location.hash});
		el.html(content);
		
		return this;
	}
});

var ContentsView = Backbone.View.extend({
	initialize: function(contents) {
		_.bindAll(this, 'render');
		this.contents = contents;
		
		this.render();
	},
	render: function() {
		var self = this;
		var el = $("#content");
		el.empty();
		
		for (i in this.contents) {
			var content = this.contents[i];
			el.append(content.render().el);
		}
		
		return this;
	}
});

var MainView = Backbone.View.extend({
	el: $('body'),
	
	initialize: function(contents) {
		_.bindAll(this, 'render');
		this.headerTemplate = $('#templateMainContentHeader').html();
		this.footerTemplate = $('#templateMainContentFooter').html();
		this.contentWrapperTemplate = $('#templateMainContentWrapper').html();
		
		this.render();
	},
	render: function() {
		var self = this;
		var el = $(this.el);
		
		var header = _.template(this.headerTemplate, {test: "test"});
		el.append(header);
		var contentWrapper = _.template(this.contentWrapperTemplate);
		el.append(contentWrapper);
		var footer = _.template(this.footerTemplate, {test: "Testy McTesterson"});
		el.append(footer);
		
		return this;
	}
});