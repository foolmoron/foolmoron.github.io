Contents = {};
$(function() { // have to wait for DOM to load to get templates
	Contents.test = new Content({
		id: "test",
		title: "Test",
		imageURL: "http://img.imgcake.com/foolmoron/Twilightclapeb.gif"
	});
	Contents.one = new Content({
		id: "one",
		title: "Test1",
		description: "Description1",
	});
	Contents.two = new Content({
		id: "two",
		title: "Test2",
		description: "Description2",
	});
	Contents.three = new Content({
		id: "three",
		title: "Test3",
		description: "Description3",
	});
});