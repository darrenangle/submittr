//TRY THE DEMO BUTTON CONVERTS THE PAGE INTO A FAKE MAGAZINE!!!!

//if user is logged in:
// - display logout button
// - display profile link
// - display current submissions

//user upload form includes profile information 
// classes as views? 
// pre-demo view, demo-login view, demo-logged-in view

$(document).ready(function(){ 
						 	
	var $pdv = $(".pre-demo"), 
		$dv = $(".demo-view"),
		$fv = $(".faq-view");
		//initial view navigation
		
		$("#i-btn").click(function(){ 
			pdv.fadeOut(200);
			iv.fadeIn(200); 	
		});

		$("#d-btn").click(function(){ 
			$pdv.fadeOut(200);
			$dv.fadeIn(200); 	
		});

		$("#f-btn").click(function(){ 
			pdv.fadeOut(200);
			dv.fadeIn(200); 	
		});




});

