Contents = {};
$(function() { // have to wait for DOM to load to get templates
	Contents.test = new Content({
		id: "test",
		title: "Test",
		extraContent: "<img src='http://img.imgcake.com/foolmoron/Twilightclapeb.gif' />"
	});
	Contents.one = new Content({
		id: "one",
		title: "Test1",
		description: "Description1",
		color: [100, 200, 50]
	});
	Contents.two = new Content({
		id: "two",
		title: "Test2",
		description: "Description2",
		color: [20, 80, 255]
	});
	Contents.three = new Content({
		id: "three",
		title: "Test3",
		description: "Description3",
		color: [0, 255, 255]
	});
});