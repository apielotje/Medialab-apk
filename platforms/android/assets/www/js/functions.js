// JavaScript Document 

//function index
/*
insertText('ids','values')
	Zet values in ids, gescheiden met een "|"

copyInput('id',this.value)
	Kopierd value naar andere id

changeStyle('id','css','style')
	Veranderd de gewenste style
	
editUser(id,state)
	disable tekstvelden als de gebruiker bewerkt wordt

displayCheckbox('className')
	Geef checkbox een id en alle items met dezelfde class als de id worden getoggled in display:none/block
	
removeElement('class1|class2')
*/
$(document).ready(function(){
	login();
	checkLogin();
	if(window.login){
		deleteDataFromDb();
		insertDataToDb();
		getDataFromDb();
		addTogleListeners();
		}
		
});

function removeSpaces(string) {
 return string.split(' ').join('');
}	 

	
function addTogleListeners(){
	
	
	$(".logout").click(function(){
		//alert("logout");
		checkLogin('logout');
		});
		
		
	$("wrapper").click(function(){
		$("#menu_checkbox").prop("checked",false);
		});
		
	$("#menu_checkbox").click(function(){
		if($("#popup_checkbox").prop("checked") == true){
			var popup_checkbox = $("#popup_checkbox");
			popup_checkbox.trigger('click');
			}
		});
	$(".toggle_popup_menu").click(function(){
		var checkBox = $("#popup_checkbox");
		checkBox.trigger('click');
		$("#menu_checkbox").prop("checked",false);
		$('#action').val("insert");	$('#id').val("");		$('#type').val(""); 
		$('#name').val("");			$('#owner').val(""); 	$('#note').val("");
		if($(".edit").css('display') == 'none'){
			setTimeout(
			  function() 
			  {
				$('.edit').css("display","block");
				$('#delete').css("display","none");
				$('#confirm_delete').css("display","none");
				$('#id').prop('readonly',false);
			  }, 300);
			
			}
		});
		
	$("#itemlist").on("click",".edit_popup_menu",function(){
		$('.edit').css("display","none");
		$('#delete').css("display","inline");
		$('#id').prop('readonly',true);
		var checkBox = $("#popup_checkbox");
		checkBox.trigger('click');
		$("#menu_checkbox").prop("checked",false);
		window.editid = event.target.id;
		//alert(editid);
		getDataFromDb(editid);
		});
		
	$("#itemlist").on("click",".show_product",function(){
		window.showid = event.target.id;
		getDataFromDb(window.showid);
		//alert(editid);
		var checkBox = $("#product_checkbox");
		checkBox.trigger('click');
		$("#product_checkbox").prop("checked",true);
		showProduct();
		});
		
	$(".home").click(function(){
			$("#menu_checkbox").prop("checked",false);
			$("#product_checkbox").prop("checked",false);
		});
};

function showProduct(){
	
	$("#product_info").empty()
	var name="<h1>"+window.editname+" ("+window.showid+")</h1>";
 	var type=window.edittype;
 	var state=window.editstate;
	var createdate=window.createdate;
	var editdate=window.editdate;
	var notes=window.notes;
	
	var info="<i>aangemaakt: "+createdate+"<br>opgeslagen: "+editdate+"</i>";
	$("#product_info").append(name+info);
	
	}
function fillIn(){
	$('#action').val("update");
	$('#id').val(window.editid);
	$('#type').val(window.edittype); 
	$('#name').val(window.editname);
	$('#owner').val(window.editowner); 
	
	$("#info").empty()
	$("#info").append('<b>aangemaakt: </b>'+window.createdate+'<br><b>opgeslagen: </b>'+window.editdate);
	}
	
function checkLogin(logout){
	
	if(logout){
		window.localStorage.removeItem('login');
		}
	// To retrieve a value
	login = window.localStorage.getItem('login');
	//alert(login);
	var pagename = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
	
	if(login != 'true'){
		if(pagename != 'login.html'){
			window.location.replace("login.html");

			}
		}else if(login == 'true'){
			if(pagename == 'login.html'){
				window.location.replace("index.html");

				}
			}
	}
	
function login(){
	$("#login").click(function(){
		//alert("login");
		var username=$("#username").val();
		var password=$("#password").val();
		var ready=false;
		
		 if($.trim(username).length>0 & $.trim(password).length>0){
			 ready=true;
			}else{
				$("body").append("<msg>vul alle velden in</msg>");
				}
		 var dataString="username="+username+"&password="+password;
		 if(ready == true){
			 $.ajax({
				type: "POST",
				url:"http://rubenkoops.nl/medialab/php/includes.php",
				data: dataString,
				xhrFields: {
				   withCredentials: true
				},
				crossDomain: true,
				cache: false,
				beforeSend: function(){ $("#login").val('Connecting...');},
				success: function(data){
					//alert(data);
					if(data=="ok"){
						//alert("inserted");
						$("body").append("<msg>login gelukt</msg>");
						window.localStorage.setItem('login', true);
						checkLogin();
						$("#login").val('login');
						}
						else{
							//alert(data);
							$("body").append("<msg>"+data+"</msg>");
							$("#login").val('login');
							}
						}
					});
				}return false;
				
			
		});
		};

function getDataFromDb(key,getdata){
	
	$.ajax({
		url:"http://rubenkoops.nl/medialab/php/json.php?host=test",
		xhrFields: { withCredentials: true },
		crossDomain: true,
		cache: false,
		success: function(data){
			//alert(data);
			
		var result = JSON.parse(data);
		
		$.each(result, function(i, field){
			var reloaddata = true;
			if(key){reloaddata = false;}
			if(getdata){reloaddata = true;}
			var id=field.id;
 			var name="<h1>"+field.name+" ("+id+")</h1>";
 			var type=field.type;
 			var state=field.state;
			
			if(key){
				if(id == key){
					window.editid=field.id;
					window.edittype=field.type;
					window.editname=field.name;
					window.editowner=field.owner;
					window.createdate=field.date;
					window.editdate=field.editdate;
					window.notes=field.notes;
					
					//alert(edittype+", "+editname+", "+editowner);
					
					fillIn();
					showProduct();
					}
				}
				if(reloaddata == true){
					//alert('ik reload nu');
					var bekijkbutton = "<input id='"+id+"' type='button' class='show_product' value='bekijk'>&nbsp;&nbsp;&nbsp;";
					var editbutton = "<input id='"+id+"' type='button' class='edit_popup_menu' value='edit'>";
					$("#itemlist").append("<li>"+name+type+state+"<hr>"+bekijkbutton+editbutton+"</li>");
					}
				
 			});
		}
 		});
}

function insertDataToDb(){ 
 $("#insert").click(function(){
	//alert("insert");
	
var action=$("#action").val();
var id=$("#id").val();
var type=$("#type").val();
var name=$("#name").val();
var owner=$("#owner").val();
var note=$("#note").val();
var action=$("#action").val();
var ready=false;

 if($.trim(id).length>0 & $.trim(type).length>0 & $.trim(name).length>0 & $.trim(owner).length>0){
	 ready=true;
 	}else{
		$("body").append("<msg>vul alle velden in</msg>");
		}
 var dataString="id="+id+"&type="+type+"&name="+name+"&owner="+owner+"&note="+note+"&action="+action;
 if(ready == true){
	 $.ajax({
		type: "POST",
		url:"http://rubenkoops.nl/medialab/php/insert.php",
		data: dataString,
		xhrFields: {
			   withCredentials: true
			},
		crossDomain: true,
		cache: false,
		beforeSend: function(){ $("#insert").val('Connecting...');},
		success: function(data){
			if(data=="ok"){
				//alert("inserted");
				$("#itemlist").empty();
				$("body").append("<msg>product opgeslagen</msg>");
				//$("#id,#type,#name,#owner,#note").val("");
				getDataFromDb(id,'getdata');
				$("#insert").val('opslaan');
				}
				else{
					//alert(data);
					$("body").append("<msg>"+data+"</msg>");
					$("#insert").val('opslaan');
					}
				}
			});
		}return false;
		
	
});
	
 }

function confirmDelete(){
	if($("#confirm_delete").css("max-height") == "100px"){
		$('#confirm_delete').css("max-height","0");
		}else{
			$('#confirm_delete').css("max-height","100px");
			}
	}
function deleteDataFromDb(){
	 $("#delete").click(function(){
		 //alert("probeer "+window.editid+" te verwijderen");
		 var id = window.editid;
		 var dataString="id="+id+"&action=delete";
		 $.ajax({
			type: "POST",
			url:"http://rubenkoops.nl/medialab/php/insert.php",
			data: dataString,
			xhrFields: {
				   withCredentials: true
				},
			crossDomain: true,
			cache: false,
			beforeSend: function(){ $("#insert").val('Connecting...');},
			success: function(data){
				if(data=="ok"){$("body").append("<msg>product "+id+" verwijderd</msg>");
					//$("#id,#type,#name,#owner,#note").val("");
					$("#popup_checkbox").prop("checked",false);
					$("#itemlist").empty()
					getDataFromDb('','getdata');
					$("#insert").val('opslaan');
					}
					else{
					//alert(data);
					$("body").append("<msg>"+data+"</msg>");
					$("#insert").val('opslaan');
					}
				}
			});
		 });
	} 
  

			
	