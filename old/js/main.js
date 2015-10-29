ROOT_URL = "/foolmoron.github.io/";

$(function(){
    var router = new Router();
    var mainContent = new MainView({model: MainModel});
    Backbone.history.start({pushState: false, root: ROOT_URL});
    MainModel.set('subtitle', POSSIBLE_SUBTITLES[0].text);
});