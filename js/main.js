ROOT_URL = "/foolmoron.github.io/";

$(function(){
	var router = new Router();
	var mainContent = new MainView();
	Backbone.history.start({pushState: false, root: ROOT_URL});
});