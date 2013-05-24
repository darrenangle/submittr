$(function(){

	Parse.$ = jQuery;

	Parse.initialize("QbnWiSsZXhRgvcw7gLJFE9XMX9l024X5MXmhOexJ", 
					"cmiAs3yoIeOxPl1HEOaLfNXMV7I6TaFtKe2QaVbl");
		
	//Models

	var Submission = Parse.Object.extend("Submission", {
		//Default attributes for the submission
		defaults: {
			bio: "Bio goes here.",
			cover: "Optional cover letter goes here.",
			sub: "Paste your submission here."
		},

		initialize: function(){

		}

	});

	//Views

	//Login / Signup View
	var LoginView = Parse.View.extend({

		//bind login/signup form submissions to login & signup methods
		events: {
			"submit form.login-form" : "logIn",
			"submit form.signup-form" : "signUp" 
		},

		//bind view to app .content div
		el: ".content",

		initialize: function() {
			_.bindAll(this, "logIn", "signUp");
			this.render();
		},

		logIn: function(e) {
			var t = this;
			var username = t.$('#login-username').val();    //get username and password from form
			var password = t.$('#login-password').val();

			Parse.User.logIn(username, password, {
				//login works, render ACL appropriate view
				success: function(user) {
					new SubmissionsView();
					t.undelegateEvents();
					delete t;
				},


				//Need to make DOM render specific error "something went wrong etc"	
				error: function(user, error){
					t.$(".login-form .error").html("Invalid username or password. Please try again.").show();
					t.$(".login-form button").removeAttr("disabled");
				}
			});

			t.$(".login-form button").attr("disabled", "disabled");

			return false;	
		},

		signUp: function(e) {
			var t = this;
			var firstName = t.$("#signup-firstname").val();
			var lastName = t.$("#signup-lastname").val();
			var username = t.$("#signup-email").val();
			var password = t.$("#signup-password").val();

			Parse.User.signUp(username, password, {ACL: new Parse.ACL(), firstName:firstName, lastName:lastName}, {
				success: function(user) {
				new SubmissionsView();
				t.undelegateEvents();
				delete t;
			},

				error: function(user, error) {
				t.$(".signup-form .error").html(error.message).show();
				t.$(".signup-form button").removeAttr("disabled");
				}
      		});

			//t.$(".signup-form button").attr("disabled", "disabled");

		return false;

		},

		render: function() {
			this.$el.html(_.template($("#login-template").html())); 
			this.delegateEvents();
		}

	});


	var SubmissionsView = Parse.View.extend({

		events: {
			"click #logout-button" : "logOut"
		},
		
		el: '.content',


		initialize: function(){
			_.bindAll(this, "logOut");
			this.render();

		},

		logOut: function(e){
			Parse.User.logOut();
			new LoginView();
			this.undelegateEvents();
			delete this; 
		},

		render: function(){
			this.$el.html(_.template($("#submissions-template").html()));
			this.delegateEvents();
			//if statement here: if current user has a submission, show submission view, else show upload view
			new UploadView;
		}
	});

	//should uploadView and edit view be the same?
	var UploadView = Parse.View.extend({
		
		el: '#uploader',

		events: {
			"click #submit-btn": "save"
		},

		

		initialize: function(){
			_.bindAll(this, "save");
			this.render();
		},

		render: function(){
			this.$el.html(_.template($("#upload-template").html()));
			this.delegateEvents();
			return this;
		},

		save: function(e){
			e.preventDefault();
			if($('#sub').val()){
			var submission = new Submission({
				bio: 	$('#bio').val(),
				cover: 	$('#cover').val(),
				sub: 	$('#sub').val(),
				status: "Recieved",
				user: 	Parse.User.current(),
				ACL: 	new Parse.ACL(Parse.User.current())
			});

			submission.save({
				success: function(model){
					$("#upload").remove();
					new CurrentSubmissionView();
				},
				error: function(model, error){
					alert("Could not upload. Error: " + error);
				}
			});
		} else {
			alert("You didn't include a submission!");
		};
		}
	});

	var CurrentSubmissionView = Parse.View.extend({

		events: {
			"click #withdraw-btn": "withdraw"
		},

		el: '#uploader',

		initialize: function(){
			_.bindAll(this, "withdraw");
			this.render();
		},

		render: function(){

		}

		//if status is under consideration, include in warning
	});


	//Main view for Submittr App
	var SubmittrView = Parse.View.extend({

		//Appends main view to #submittrapp div in html
		el: $('#submittrapp'),

		initialize: function(){
			this.render();
		},
		//if user is logged in, show their submissions, if not show login screen
		//eventually, if user has admin role, render admin view
		render: function(){
			if(Parse.User.current()) {
				//emdedded if needed: if user has admin role render admin view else render submissions
				new SubmissionsView();
			} else {
				new LoginView();
			}
		}

	});

	//Router



//render main view
new SubmittrView();

})//end