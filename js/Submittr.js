$(function(){

	Parse.$ = jQuery;

	Parse.initialize("QbnWiSsZXhRgvcw7gLJFE9XMX9l024X5MXmhOexJ", 
					"cmiAs3yoIeOxPl1HEOaLfNXMV7I6TaFtKe2QaVbl");

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
			var self = this;
			var username = this.$('#login-username').val();    //get username and password from form
			var password = this.$('#login-password').val();

			Parse.User.logIn(username, password, {
				//login works, render ACL appropriate view
				success: function(user) {
					new SubmissionsView();
					self.undelegateEvents();
					delete self;
				},


				//Need to make DOM render specific error "something went wrong etc"	
				error: function(user, error){
					self.$(".login-form .error").html("Invalid username or password. Please try again.").show();
          			this.$(".login-form button").removeAttr("disabled");
				}
			});

			this.$(".login-form button").attr("disabled", "disabled");

			return false;	
		},

		signUp: function(e) {
      		var self = this;
      		var username = this.$("#signup-username").val();
      		var password = this.$("#signup-password").val();
      
      		Parse.User.signUp(username, password, { ACL: new Parse.ACL() }, {
        		success: function(user) {
          		new SubmissionsView();
          		self.undelegateEvents();
          		delete self;
        	},

        		error: function(user, error) {
        			//this needs to be fixed!! message disappears 
          		self.$(".signup-form .error").html(error.message).show();
          		this.$(".signup-form button").removeAttr("disabled");
        		}
      	});

      	this.$(".signup-form button").attr("disabled", "disabled");

      	return false;
    	
    	},

    	render: function() {
    		this.$el.html(_.template($("#login-template").html())); 
      		this.delegateEvents();
    	}

	});


	var SubmissionsView = Parse.View.extend({

		el: '.content',

		initialize: function(){
			this.render();
		},

		render: function(){
			this.$el.html(_.template($("#submissions-template").html()));
			this.delegateEvents();

			//if statement here: if current user has a submission, show submission view, else show upload view
		}
	}); 

	var UploadView;
	var CurrentSubmissionView;


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
				//if user has admin role render submissions view
				new SubmissionsView();
			} else {
				new LoginView();
			}
		}

	});

	//Router



//render main view
new SubmittrView();

}) //end