ROOT_URL = "/foolmoron.github.io/";
$(function(){
	var Router = Backbone.Router.extend({
		routes: {
			"": "home",
			"test": "test",
			":sub": "sub",
		},
		
		home: function() {
			console.log("home");
		},
		test: function() {
			console.log("test");
		},
		sub: function(sub) {
			console.log("sub=" + sub);
		}
	});
	var router = new Router();
	Backbone.history.start({pushState: false, root: ROOT_URL});
});