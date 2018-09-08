var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser');
var md5 = require('md5');
var jsonfile = require('jsonfile');
var fs = require('fs');
var file_user = './data/users.json';
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var jsonParser = bodyParser.json()


//register
router.post('/user/register',jsonParser,function(req,res){
	console.log(req.body.txt_email);
	var check = true;
	var user_id = Math.floor(Math.random())+req.body.user_id;
	var data_user = 
        {
            "user_id":user_id,
            "firstname":req.body.txt_first_name,
            "lastname":req.body.txt_last_name,
            "username":req.body.txt_username,
            "password":md5(req.body.txt_password),
            "sex":0,
			"email":req.body.txt_email,
            "avatar":"https://hoanguyenit.com/public/img/user-account2.png",
            "private_message":[],
            "chat_room":[]
        }
	var data=jsonfile.readFileSync(file_user);
	data['datas'].forEach(function(rows){
	   if(rows.username==req.body.txt_username || rows.email==req.body.txt_email){ //tim co to
		  console.log(rows.username+"/"+rows.email)
		  check = false;
	   }
	});
	if(check){
		data.datas.push(data_user);
		fs.writeFile(file_user, JSON.stringify(data), 'utf-8', function(err) {
		  if (err) throw err
		  //console.log('Done!');
		  //console.log(data);
		  
		 
		});

		res.json({"success":1});

	}else{
		res.json({"success":0});
	}
});

//login
router.post('/user/login', jsonParser, function (req, res) {
	var username = req.body.txt_username;
	var password = req.body.txt_password;
	var data = jsonfile.readFileSync(file_user);
	var check = false;
	var check_position_user=-1;
	var dem=0;
	data['datas'].forEach(function(rows){
		if(rows.username==username && rows.password==md5(password)){
			check=true;
			check_position_user=dem;
		}
		dem++;
	});
	if(check){
		res.json({"success":1,"username":username,"password":password,"user_id":data['datas'][check_position_user]['user_id']});
	}
	res.json({"success":0,"username":username,"password":password});
});


//post message user
router.post('/user/sms/private',jsonParser,function(req,res){
	var check_group = req.body.check_group;
	var user_id = req.body.user_id;
	var send_user_id = req.body.send_user_id;
	var id_time = req.body.id_time;
	var time_stamp = req.body.time_stamp;
	var sms_user = req.body.sms_user;
	var sms = req.body.sms;
	var sms_time = req.body.sms_time;
	var data = jsonfile.readFileSync(file_user);
	
	//get vị trí của user
	var check_user=false;
	var position_user = -1;
	var dem=0;
	data['datas'].forEach(function(rows){
		if(rows.user_id==user_id){
			position_user=dem;
			check_user=true;
		}
		dem++;
	});
	var data_user = data['datas'][position_user]['private_message'];
	if(check_user){
		if(check_group>0){
			if(data_user.length>0){
				var check_send_id=false;
				var check_position_send_id=-1;
				var dem2=0;
				data_user.forEach(function(rows){
					if(rows.send_user_id==send_user_id){
						check_send_id=true;
						check_position_send_id=dem2;
					}
					dem2++;
				});
				if(check_send_id){
					var data_box_sms = data_user[check_position_send_id]['message'];
					var check_box_sms=false;
					var check_position_box_sms=-1;
					var dem3=0;
					data_box_sms.forEach(function(rows){
						if(rows.time_stamp==time_stamp){
							check_box_sms=true;
							check_position_box_sms=dem3;
						}
						dem3++;
					});
					if(check_box_sms){
						var data_box_add_sms = data_box_sms[check_position_box_sms]['box_sms'];
						var add_sms = {
							"sms_user": user_id,
							"sms": sms,
							"sms_time": sms_time
						}
						data_box_add_sms.push(add_sms);
						fs.writeFile(file_user, JSON.stringify(data), 'utf-8', function(err) {
							if (err) throw err
							console.log('Done!');
							console.log(data_box_add_sms);
						  
						});
						res.json(data_box_sms);
					}else{

						var add_sms_new={
							"id_time":id_time,
							"time_stamp":time_stamp,
							"box_sms":[
								 {
									 "sms_user":user_id,
									 "sms":sms,
									 "sms_time":sms_time
								 }	
							 ] 
						}
						 data_box_sms.push(add_sms_new);
						 fs.writeFile(file_user, JSON.stringify(data), 'utf-8', function(err) {
						if (err) throw err
							console.log('Done!');
							console.log(data_box_sms);
						  
						});
						res.json(data_box_sms);


					}
				}else{
					var data_sms_user = {
						"send_user_id":send_user_id,
						"message":[
							{
							   "id_time":id_time,
							   "time_stamp":time_stamp,
							   "box_sms":[
									{
										"sms_user":user_id,
										"sms":sms,
										"sms_time":sms_time
									}	
								] 
						   }
						]
					}
					data_user.push(data_sms_user);
					fs.writeFile(file_user, JSON.stringify(data), 'utf-8', function(err) {
					  if (err) throw err
					  console.log('Done!');
					  console.log(data);
					
					});
					res.json(data);
				}
			}
		}

		
	}
	
});


//get list users
router.post('/lists/user',jsonParser,function(req,res){
	var user_id=req.body.user_id;
	var data = jsonfile.readFileSync(file_user);
	var check=false;
	var check_position_user=-1;
	var dem=0;
	data['datas'].forEach(function(rows){
		if(rows.user_id==user_id){
			check=true;
			check_position_user=dem;
		}
		dem++;
	});
    if(check){
    	res.json({"lists":data,"messages":data['datas'][check_position_user]['private_message']});
    }
	
});
module.exports = router