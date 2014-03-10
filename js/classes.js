//need a less global way of organizing classes, but RequireJS seems like overkill...

var Router = Backbone.Router.extend({
    routes: {
        "": "home",
        ":subroute": "subroute",
    },
    
    route: function() { // fires on any route change
        Backbone.Router.prototype.route.apply(this, arguments); // super()
        MainModel.get('randomizeSubtitle').call(MainModel);
    },
    home: function() {
        var contents = {};
        for (i in Contents) {
            contents[i] = new ContentShortView({model: Contents[i]});
        }
        new ContentsView(contents);
    },
    subroute: function(subroute) {
        if (Contents[subroute]) {
            new ContentsView([new ContentLongView({model: Contents[subroute]})]);
        } else {
            new ContentsView([new ContentInvalidView()]);
        }
    }
});

var Content = Backbone.Model.extend({
    EXTRA_TEMPLATE_PREFIX: 'templateExtra-',
    DETAILS_TEMPLATE_PREFIX: 'templateDetails-',

    defaults: {
        id: "",
        title: "No Title",
        description: "No Description",
        color: [255, 0, 0],
        extraContent: null,
        detailsContent: null,
    },

    initialize: function() {
        var extraContent = this.get('extraContent');
        if (!extraContent) {
            var extraTemplate = $('#' + this.EXTRA_TEMPLATE_PREFIX + this.get('id'));
            if (extraTemplate.length) {
                var extraContent = _.template(extraTemplate.html(), this.toJSON());
                this.set('extraContent', extraContent);
            }
        }
        var detailsContent = this.get('detailsContent');
        if (!detailsContent) {
            var detailsTemplate = $('#' + this.DETAILS_TEMPLATE_PREFIX + this.get('id'));
            if (detailsTemplate.length) {
                var detailsContent = _.template(detailsTemplate.html(), this.toJSON());
                this.set('detailsContent', detailsContent);
            }
        }
    },
    toJSON: function() {
        var colorString = 'rgb(' + this.get('color').join(', ') + ')';
        return _.extend(Backbone.Model.prototype.toJSON.call(this), { // "computed properties"
            colorString: colorString,
            gradientStyleString: "background: -moz-linear-gradient(left, " + colorString + " 0%, rgba(125,185,232,0) 100%); /* FF3.6+ */ background: -webkit-gradient(linear, left top, right top, color-stop(0%," + colorString + "), color-stop(100%,rgba(125,185,232,0))); /* Chrome,Safari4+ */ background: -webkit-linear-gradient(left, " + colorString + " 0%,rgba(125,185,232,0) 100%); /* Chrome10+,Safari5.1+ */ background: -o-linear-gradient(left, " + colorString + " 0%,rgba(125,185,232,0) 100%); /* Opera 11.10+ */ background: -ms-linear-gradient(left, " + colorString + " 0%,rgba(125,185,232,0) 100%); /* IE10+ */ background: linear-gradient(to right, <%= colorString %> 0%,rgba(125,185,232,0) 100%); /* W3C */"
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
        _.bindAll(this, 'render', 'updateSubtitle');
        this.model.bind('change', this.updateSubtitle);
        this.headerTemplate = $('#templateMainContentHeader').html();
        this.footerTemplate = $('#templateMainContentFooter').html();
        this.contentWrapperTemplate = $('#templateMainContentWrapper').html();
        
        this.render();
    },
    render: function() {
        var self = this;
        var el = $(this.el);
        
        var header = _.template(this.headerTemplate, this.model.toJSON());
        el.append(header);
        var contentWrapper = _.template(this.contentWrapperTemplate);
        el.append(contentWrapper);
        var footer = _.template(this.footerTemplate, this.model.toJSON());
        el.append(footer);
        
        return this;
    },
    updateSubtitle: function() {
        $('.subtitle', this.el).text(this.model.get('subtitle'));
    }
});