var	url=require('url');
var http=require('http');
var wdconfig=require('./wdconfig').wdconfig;	
var wdutils=require('./wdutils.js').wdutils;
var fs=require('fs');
var crypto=require('crypto');
	
http.createServer(function (REQ,RESP) {
	
	var url_parts = url.parse(REQ.url,true);
	var path0=url_parts.pathname;
	
	if (REQ.method == 'OPTIONS') {
		var headers = {};
		// IE8 does not allow domains to be specified, just the *
		// headers["Access-Control-Allow-Origin"] = req.headers.origin;
		headers["Access-Control-Allow-Origin"] = "*";
		headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
		headers["Access-Control-Allow-Credentials"] = false;
		headers["Access-Control-Max-Age"] = '86400'; // 24 hours
		headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
		RESP.writeHead(200, headers);
		RESP.end();
	}
	else if(REQ.method=='GET') {
		console.log ('GET '+path0);
		
		if (path0=='/wdapi/users') {
			get_users(url_parts.query,function(tmp) {
				send_json_response(RESP,tmp);
			});
		}
		else if (path0=='/wdapi/user') {
			get_user(url_parts.query,function(tmp) {
				send_json_response(RESP,tmp);
			});
		}
		else if (path0=='/wdapi/groups') {
			get_groups(url_parts.query,function(tmp) {
				send_json_response(RESP,tmp);
			});
		}
		else if (path0=='/wdapi/group') {
			get_group(url_parts.query,function(tmp) {
				send_json_response(RESP,tmp);
			});
		}
		else if (path0=='/wdapi/projects') {
			get_projects(url_parts.query,function(tmp) {
				send_json_response(RESP,tmp);
			});
		}
		else if (path0=='/wdapi/project') {
			get_project(url_parts.query,function(tmp) {
				send_json_response(RESP,tmp);
			});
		}
		else if (path0=='/wdapi/sessions') {
			get_sessions(url_parts.query,function(tmp) {
				send_json_response(RESP,tmp);
			});
		}
		else if (path0=='/wdapi/session') {
			get_session(url_parts.query,function(tmp) {
				send_json_response(RESP,tmp);
			});
		}
		else if (path0=='/wdapi/acquisitions') {
			get_acquisitions(url_parts.query,function(tmp) {
				send_json_response(RESP,tmp);
			});
		}
		else if (path0=='/wdapi/acquisition') {
			get_acquisition(url_parts.query,function(tmp) {
				send_json_response(RESP,tmp);
			});
		}
		else if (path0=='/wdapi/files') {
			get_files(url_parts.query,function(tmp) {
				send_json_response(RESP,tmp);
			});
		}
		else if (path0=='/wdapi/downloadfile') {
			download_file(RESP,url_parts.query);
		}
		else if (path0=='/wdapi/filestats') {
			get_file_stats(url_parts.query,function(tmp) {
				send_json_response(RESP,tmp);
			});
		}
		else if (path0=='/wdapi/attachments') {
			get_attachments(url_parts.query,function(tmp) {
				send_json_response(RESP,tmp);
			});
		}
		else if (path0=='/wdapi/downloadattachment') {
			download_attachment(RESP,url_parts.query);
		}
		else if (path0=='/wdapi/attachmentstats') {
			get_attachment_stats(url_parts.query,function(tmp) {
				send_json_response(RESP,tmp);
			});
		}
		else {
			send_json_response(RESP,{success:false,error:'Unrecognized path'});			
		}
	}
	else if(REQ.method=='POST') {
		console.log ('POST '+path0);
		if (path0=='/wdapi/uploadfile') {
			upload_file(url_parts.query,REQ,function(tmp) {
				send_json_response(RESP,tmp);
			});
		}
		else {
			get_query_from_post(REQ,function(query) {
				if (path0=='/wdapi/add') {
					var FF=function() {};
					if (query.type=='user') FF=add_user;
					else if (query.type=='group') FF=add_group;
					else if (query.type=='project') FF=add_project;
					else if (query.type=='session') FF=add_session;
					else if (query.type=='acquisition') FF=add_acquisition;
					else if (query.type=='file') FF=add_file;
					else if (query.type=='attachment') FF=add_attachment;
					else {
						send_json_response(RESP,{success:false,error:'Unexpected type: '+query.type});
						return;
					}
					FF(query,function(tmp) {
						send_json_response(RESP,tmp);
					});
				}
				else if (path0=='/wdapi/setattributes') {
					var FF=function() {};
					if (query.type=='user') FF=set_user_attributes;
					else if (query.type=='group') FF=set_group_attributes;
					else if (query.type=='project') FF=set_project_attributes;
					else if (query.type=='session') FF=set_session_attributes;
					else if (query.type=='acquisition') FF=set_acquisition_attributes;
					else {
						send_json_response(RESP,{success:false,error:'Unexpected type: '+query.type});
						return;
					}
					FF(query,function(tmp) {
						send_json_response(RESP,tmp);
					});
				}
				if (path0=='/wdapi/remove') {
					var FF=function() {};
					if (query.type=='user') FF=remove_user;
					else if (query.type=='group') FF=remove_group;
					else if (query.type=='project') FF=remove_project;
					else if (query.type=='session') FF=remove_session;
					else if (query.type=='acquisition') FF=remove_acquisition;
					else if (query.type=='file') FF=remove_file;
					else if (query.type=='attachment') FF=remove_attachment;
					else {
						send_json_response(RESP,{success:false,error:'Unexpected type: '+query.type});
						return;
					}
					FF(query,function(tmp) {
						send_json_response(RESP,tmp);
					});
				}
				if (path0=='/wdapi/rename') {
					var FF=function() {};
					if (query.type=='group') FF=rename_group;
					else if (query.type=='project') FF=rename_project;
					else if (query.type=='session') FF=rename_session;
					else if (query.type=='acquisition') FF=rename_acquisition;
					else if (query.type=='file') FF=rename_file;
					else if (query.type=='attachment') FF=rename_attachment;
					else {
						send_json_response(RESP,{success:false,error:'Unexpected type: '+query.type});
						return;
					}
					FF(query,function(tmp) {
						send_json_response(RESP,tmp);
					});
				}
				else if (path0=='/wdapi/setgrouprole') {
					set_group_role(query,function(tmp) {
						send_json_response(RESP,tmp);
					});
				}
			});
		}
	}
	
}).listen(wdconfig.listen_port);
console.log ('Listening on port '+wdconfig.listen_port);

function send_json_response(RESP,obj) {
	RESP.writeHead(200, {"Access-Control-Allow-Origin":"*", "Content-Type":"application/json"});
	RESP.end(JSON.stringify(obj));
}

function current_user(query) {
	return query.login||'';
}
function is_admin(user0) {
	var admin_users=['admin','jeremy.magland@gmail.com'];
	if (admin_users.indexOf(user0)>=0) return true;
	return false;
}
function has_group_access(user0,group0,access) {
	if (is_admin(user0)) return true;
	var attr=read_group_attributes(group0);
	if (attr.owner==user0) return true;
	var roles=attr.roles||[];
	for (var i in roles) {
		if (roles[i].user==user0) {
			if (roles[i].access.indexOf(access)>=0) return true;
		}
	}
	return false;
}

function get_query_from_post(REQ,callback) {
	var body='';
	REQ.on('data',function (data) {
		body+=data;
	});
	REQ.on('end',function() {
		var query0;
		try {
			query0=JSON.parse(body);
		}
		catch(err) {
			callback({});
			return;
		}
		callback(query0);
	});
}


/* USERS **********************************************************/

function get_users(query,callback) {
	var user0=current_user(query);
	if (!is_admin(user0)) {
		callback({success:false,error:'User '+user0+' is not admin'});
		return;
	}
	var path0=wdconfig.data_path+'/users';
	var dirs=wdutils.get_all_dirs(path0);
	callback({success:true,users:dirs});
}
function get_user(query,callback) {
	var user0=current_user(query);
	if ((!is_admin(user0))&&(user0!=query.username)) {
		callback({success:false,error:'User '+user0+' is not admin'});
		return;
	}
	var path0=wdconfig.data_path+'/users/'+query.user;
	if (!wdutils.dir_exists(path0)) {
		callback({success:false,error:'user '+query.user+' not found'});
		return;
	}
	var ret={success:true,user:query.user};
	ret.attributes=wdutils.read_json_file(path0+'/attributes.json');
	ret.metadata=wdutils.read_json_file(path0+'/metadata.json');
	callback(ret);
}
function add_user(query,callback) {
	var user0=current_user(query);
	if (!is_admin(user0)) {
		callback({success:false,error:'User '+user0+' is not admin'});
		return;
	}
	var err='';
	if (!err) {
		if (!wdutils.mkdir(wdconfig.data_path+'/users')) err='Unable to create users directory.';
	}
	if (!err) {
		if (wdutils.dir_exists(wdconfig.data_path+'/users/'+query.user)) err='User already exists.';
	}
	if (!err) {
		if (!wdutils.mkdir(wdconfig.data_path+'/users/'+query.user)) err='Unable to create user directory.';
	}
	if (!err) {
		if (!wdutils.write_json_file(wdconfig.data_path+'/users/'+query.user+'/attributes.json',{})) err='Unable to write attributes.json.';
	}
	if (err) {
		callback({success:false,error:err});
		return;
	}
	callback({success:true});
}
function set_user_attributes(query,callback) {
	var user0=current_user(query);
	if (!is_admin(user0)) {
		callback({success:false,error:'User '+user0+' is not admin'});
		return;
	}
	var path0=wdconfig.data_path+'/users/'+query.user;
	if (!wdutils.dir_exists(path0)) {
		callback({success:false,error:'user '+query.user+' not found'});
		return;
	}
	var attributes=wdutils.read_json_file(path0+'/attributes.json');
	if ('email' in query) attributes.email=query.email;
	if ('first_name' in query) attributes.email=query.first_name;
	if ('last_name' in query) attributes.last_name=query.last_name;
	if (!wdutils.write_json_file(path0+'/attributes.json',attributes)) {
		callback({success:false,error:'Unable to write attributes file.'});
		return;
	}
	callback({success:true});
}
function remove_user(query,callback) {
	var user0=current_user(query);
	if (!is_admin(user0)) {
		callback({success:false,error:'User '+user0+' is not admin'});
		return;
	}
	var path0=wdconfig.data_path+'/users/'+query.user;
	if (!wdutils.dir_exists(path0)) {
		callback({success:false,error:'user '+query.user+' not found'});
		return;
	}
	if (!wdutils.delete_directory(path0)) {
		callback({success:false,error:'Unable to delete directory.'});
		return;
	}
	callback({success:true});
}

/* GROUPS **********************************************************/

function get_groups(query,callback) {
	var user0=current_user(query);
	var path0=wdconfig.data_path+'/groups';
	var dirs=wdutils.get_all_dirs(path0);
	var dirs2=[];
	for (var i in dirs) {
		if (has_group_access(user0,dirs[i],'read')) dirs2.push(dirs[i]);
	}
	callback({success:true,groups:dirs2});
}
function get_group(query,callback) {
	var user0=current_user(query);
	if (!has_group_access(user0,query.group,'read')) {
		callback({success:false,error:'User '+user0+' does not have access to group '+query.group});
		return;
	}
	var ret={success:true,group:query.group};
	ret.attributes=read_group_attributes(query.group);
	ret.metadata=read_group_metadata(query.group);
	callback(ret);
}
function add_group(query,callback) {
	if (!query.group) {
		callback({success:false,error:'No group specified.'});
		return;
	}
	var user0=current_user(query);
	if (!is_admin(user0)) {
		callback({success:false,error:'User '+user0+' is not admin'});
		return;
	}
	var err='';
	if (!err) {
		if (!wdutils.mkdir(wdconfig.data_path+'/groups')) err='Unable to create groups directory.';
	}
	if (!err) {
		if (wdutils.dir_exists(wdconfig.data_path+'/groups/'+query.group)) err='Group already exists.';
	}
	if (!err) {
		if (!wdutils.mkdir(wdconfig.data_path+'/groups/'+query.group)) err='Unable to create group directory.';
	}
	if (!err) {
		if (!wdutils.write_json_file(wdconfig.data_path+'/groups/'+query.group+'/attributes.json',{owner:user0})) err='Unable to write attributes.json.';
	}
	if (err) {
		callback({success:false,error:err});
		return;
	}
	callback({success:true});
}
function set_group_attributes(query,callback) {
	var user0=current_user(query);
	if (!has_group_access(user0,query.group,'admin')) {
		callback({success:false,error:'User '+user0+' is not admin of group '+query.group});
		return;
	}
	var path0=wdconfig.data_path+'/groups/'+query.group;
	if (!wdutils.dir_exists(path0)) {
		callback({success:false,error:'group '+query.group+' not found'});
		return;
	}
	
	var attributes=wdutils.read_json_file(path0+'/attributes.json');
	if ('description' in query) attributes.description=query.description;
	if (!wdutils.write_json_file(path0+'/attributes.json',attributes)) {
		callback({success:false,error:'Unable to write attributes file.'});
		return;
	}
	callback({success:true});
}
function remove_group(query,callback) {
	var user0=current_user(query);
	if (!is_admin(user0)) {
		callback({success:false,error:'User '+user0+' is not admin'});
		return;
	}
	var path0=wdconfig.data_path+'/groups/'+query.group;
	if (!wdutils.dir_exists(path0)) {
		callback({success:false,error:'group '+query.group+' not found'});
		return;
	}
	if (!wdutils.delete_directory(path0)) {
		callback({success:false,error:'Unable to delete directory.'});
		return;
	}
	callback({success:true});
}
function rename_group(query,callback) {
	var user0=current_user(query);
	if (!is_admin(user0)) {
		callback({success:false,error:'User '+user0+' is not admin'});
		return;
	}
	var path0=wdconfig.data_path+'/groups/'+query.group;
	var path1=wdconfig.data_path+'/groups/'+query.new_group;
	if (!wdutils.dir_exists(path0)) {
		callback({success:false,error:'group '+query.group+' not found'});
		return;
	}
	if (wdutils.dir_exists(path1)) {
		callback({success:false,error:'group '+query.new_group+' already exists'});
		return;
	}
	if (!wdutils.rename_directory(path0,path1)) {
		callback({success:false,error:'Unable to rename directory.'});
		return;
	}
	callback({success:true});
}
function set_group_role(query,callback) {
	var user0=current_user(query);
	if (!has_group_access(user0,query.group,'admin')) {
		callback({success:false,error:'User '+user0+' is not admin of group '+query.group});
		return;
	}
	var path0=wdconfig.data_path+'/groups/'+query.group;
	if (!wdutils.dir_exists(path0)) {
		callback({success:false,error:'group '+query.group+' not found'});
		return;
	}
	
	var attributes=wdutils.read_json_file(path0+'/attributes.json');
	if (!attributes.roles) attributes.roles=[];
	for (var i in attributes.roles) {
		if (attributes.roles[i].user==query.user) {
			attributes.roles[i].access=query.access;
			wdutils.write_json_file(path0+'/attributes.json',attributes);
			callback({success:true});
			return;
		}
	}
	attributes.roles.push({user:query.user,access:query.access});
	wdutils.write_json_file(path0+'/attributes.json',attributes);
	callback({success:true});
}
function read_group_attributes(group) {
	var path0=wdconfig.data_path+'/groups/'+group;
	return wdutils.read_json_file(path0+'/attributes.json');
}
function read_group_metadata(group) {
	var path0=wdconfig.data_path+'/groups/'+group;
	return wdutils.read_json_file(path0+'/metadata.json');
}

/* PROJECTS **********************************************************/

function get_projects(query,callback) {
	var user0=current_user(query);
	if (!has_group_access(user0,query.group,'read')) {
		callback({success:false,error:'User '+user0+' does not have read access to '+query.group});
		return;
	}
	var path0=wdconfig.data_path+'/groups/'+query.group+'/projects';
	var dirs=wdutils.get_all_dirs(path0);
	callback({success:true,projects:dirs});
}
function get_project(query,callback) {
	var user0=current_user(query);
	if (!has_group_access(user0,query.group,'read')) {
		callback({success:false,error:'User '+user0+' is does not have read access to '+query.group});
		return;
	}
	var path0=wdconfig.data_path+'/groups/'+query.group+'/projects/'+query.project;
	if (!wdutils.dir_exists(path0)) {
		callback({success:false,error:'project '+query.project+' not found'});
		return;
	}
	var ret={success:true,project:query.project};
	ret.attributes=wdutils.read_json_file(path0+'/attributes.json');
	ret.metadata=wdutils.read_json_file(path0+'/metadata.json');
	callback(ret);
}
function add_project(query,callback) {
	if (!query.group) {
		callback({success:false,error:'No group specified.'});
		return;
	}
	if (!query.project) {
		callback({success:false,error:'No project specified.'});
		return;
	}
	var user0=current_user(query);
	if (!has_group_access(user0,query.group,'write')) {
		callback({success:false,error:'User '+user0+' does not have write access to '+query.group});
		return;
	}
	var path0=wdconfig.data_path+'/groups/'+query.group+'/projects';
	var err='';
	if (!err) {
		if (!wdutils.mkdir(path0)) err='Unable to create projects directory.';
	}
	if (!err) {
		if (wdutils.dir_exists(path0+'/'+query.project)) err='Project already exists.';
	}
	if (!err) {
		if (!wdutils.mkdir(path0+'/'+query.project)) err='Unable to create project directory.';
	}
	if (!err) {
		if (!wdutils.write_json_file(path0+'/'+query.project+'/attributes.json',{})) err='Unable to write attributes.json.';
	}
	if (err) {
		callback({success:false,error:err});
		return;
	}
	callback({success:true});
}
function set_project_attributes(query,callback) {
	var user0=current_user(query);
	if (!has_group_access(user0,query.group,'admin')) {
		callback({success:false,error:'User '+user0+' does not have admin access to '+query.group});
		return;
	}
	var path0=wdconfig.data_path+'/groups/'+query.group+'/projects/'+query.project;
	if (!wdutils.dir_exists(path0)) {
		callback({success:false,error:'project '+query.project+' not found'});
		return;
	}
	var attributes=wdutils.read_json_file(path0+'/attributes.json');
	if ('description' in query) attributes.description=query.description;
	if (!wdutils.write_json_file(path0+'/attributes.json',attributes)) {
		callback({success:false,error:'Unable to write attributes file.'});
		return;
	}
	callback({success:true});
}
function remove_project(query,callback) {
	var user0=current_user(query);
	if (!has_group_access(user0,query.group,'admin')) {
		callback({success:false,error:'User '+user0+' does not have admin access to '+query.group});
		return;
	}
	var path0=wdconfig.data_path+'/groups/'+query.group+'/projects/'+query.project;
	if (!wdutils.dir_exists(path0)) {
		callback({success:false,error:'project '+query.project+' not found'});
		return;
	}
	if (!wdutils.delete_directory(path0)) {
		callback({success:false,error:'Unable to delete directory.'});
		return;
	}
	callback({success:true});
}
function rename_project(query,callback) {
	var user0=current_user(query);
	if (!has_group_access(user0,query.group,'admin')) {
		callback({success:false,error:'User '+user0+' does not have admin access to '+query.group});
		return;
	}
	var path0=wdconfig.data_path+'/groups/'+query.group+'/projects/'+query.project;
	var path1=wdconfig.data_path+'/groups/'+query.group+'/projects/'+query.new_project;
	if (!wdutils.dir_exists(path0)) {
		callback({success:false,error:'project '+query.project+' not found'});
		return;
	}
	if (wdutils.dir_exists(path1)) {
		callback({success:false,error:'project '+query.new_project+' already exists'});
		return;
	}
	if (!wdutils.rename_directory(path0,path1)) {
		callback({success:false,error:'Unable to rename directory.'});
		return;
	}
	callback({success:true});
}

/* SESSIONS **********************************************************/

function get_sessions(query,callback) {
	var user0=current_user(query);
	if (!has_group_access(user0,query.group,'read')) {
		callback({success:false,error:'User '+user0+' does not have read access to '+query.group});
		return;
	}
	var path0=wdconfig.data_path+'/groups/'+query.group+'/projects/'+query.project+'/sessions';
	var dirs=wdutils.get_all_dirs(path0);
	callback({success:true,sessions:dirs});
}
function get_session(query,callback) {
	var user0=current_user(query);
	if (!has_group_access(user0,query.group,'read')) {
		callback({success:false,error:'User '+user0+' is does not have read access to '+query.group});
		return;
	}
	var path0=wdconfig.data_path+'/groups/'+query.group+'/projects/'+query.project+'/sessions/'+query.session;
	if (!wdutils.dir_exists(path0)) {
		callback({success:false,error:'session '+query.session+' not found'});
		return;
	}
	var ret={success:true,session:query.session};
	ret.attributes=wdutils.read_json_file(path0+'/attributes.json');
	ret.metadata=wdutils.read_json_file(path0+'/metadata.json');
	callback(ret);
}
function add_session(query,callback) {
	if (!query.group) {
		callback({success:false,error:'No group specified.'});
		return;
	}
	if (!query.project) {
		callback({success:false,error:'No project specified.'});
		return;
	}
	if (!query.session) {
		callback({success:false,error:'No session specified.'});
		return;
	}
	var user0=current_user(query);
	if (!has_group_access(user0,query.group,'write')) {
		callback({success:false,error:'User '+user0+' does not have write access to '+query.group});
		return;
	}
	var path0=wdconfig.data_path+'/groups/'+query.group+'/projects/'+query.project+'/sessions';
	var err='';
	if (!err) {
		if (!wdutils.mkdir(path0)) err='Unable to create sessions directory.';
	}
	if (!err) {
		if (wdutils.dir_exists(path0+'/'+query.session)) err='Session already exists.';
	}
	if (!err) {
		if (!wdutils.mkdir(path0+'/'+query.session)) err='Unable to create session directory.';
	}
	if (!err) {
		if (!wdutils.write_json_file(path0+'/'+query.session+'/attributes.json',{})) err='Unable to write attributes.json.';
	}
	if (err) {
		callback({success:false,error:err});
		return;
	}
	callback({success:true});
}
function set_session_attributes(query,callback) {
	var user0=current_user(query);
	if (!has_group_access(user0,query.group,'admin')) {
		callback({success:false,error:'User '+user0+' does not have admin access to '+query.group});
		return;
	}
	var path0=wdconfig.data_path+'/groups/'+query.group+'/projects/'+query.project+'/sessions/'+query.session;
	if (!wdutils.dir_exists(path0)) {
		callback({success:false,error:'session '+query.session+' not found'});
		return;
	}
	var attributes=wdutils.read_json_file(path0+'/attributes.json');
	if ('description' in query) attributes.description=query.description;
	if ('time' in query) attributes.time=query.time;
	if ('subject' in query) attributes.subject=query.subject;
	if (!wdutils.write_json_file(path0+'/attributes.json',attributes)) {
		callback({success:false,error:'Unable to write attributes file.'});
		return;
	}
	callback({success:true});
}
function remove_session(query,callback) {
	var user0=current_user(query);
	if (!has_group_access(user0,query.group,'write')) {
		callback({success:false,error:'User '+user0+' does not have write access to '+query.group});
		return;
	}
	var path0=wdconfig.data_path+'/groups/'+query.group+'/projects/'+query.project+'/sessions/'+query.session;
	if (!wdutils.dir_exists(path0)) {
		callback({success:false,error:'session '+query.session+' not found'});
		return;
	}
	if (!wdutils.delete_directory(path0)) {
		callback({success:false,error:'Unable to delete directory.'});
		return;
	}
	callback({success:true});
}
function rename_session(query,callback) {
	var user0=current_user(query);
	if (!has_group_access(user0,query.group,'write')) {
		callback({success:false,error:'User '+user0+' does not have write access to '+query.group});
		return;
	}
	var path0=wdconfig.data_path+'/groups/'+query.group+'/projects/'+query.project+'/sessions/'+query.session;
	var path1=wdconfig.data_path+'/groups/'+query.group+'/projects/'+query.project+'/sessions/'+query.new_session;
	if (!wdutils.dir_exists(path0)) {
		callback({success:false,error:'session '+query.session+' not found'});
		return;
	}
	if (wdutils.dir_exists(path1)) {
		callback({success:false,error:'session '+query.new_session+' already exists'});
		return;
	}
	if (!wdutils.rename_directory(path0,path1)) {
		callback({success:false,error:'Unable to rename directory.'});
		return;
	}
	callback({success:true});
}


/* ACQUISITIONS **********************************************************/

function get_acquisitions(query,callback) {
	var user0=current_user(query);
	if (!has_group_access(user0,query.group,'read')) {
		callback({success:false,error:'User '+user0+' does not have read access to '+query.group});
		return;
	}
	var path0=wdconfig.data_path+'/groups/'+query.group+'/projects/'+query.project+'/sessions/'+query.session+'/acquisitions';
	var dirs=wdutils.get_all_dirs(path0);
	callback({success:true,acquisitions:dirs});
}
function get_acquisition(query,callback) {
	var user0=current_user(query);
	if (!has_group_access(user0,query.group,'read')) {
		callback({success:false,error:'User '+user0+' is does not have read access to '+query.group});
		return;
	}
	var path0=wdconfig.data_path+'/groups/'+query.group+'/projects/'+query.project+'/sessions/'+query.session+'/acquisitions/'+query.acquisition;
	if (!wdutils.dir_exists(path0)) {
		callback({success:false,error:'session '+query.session+' not found'});
		return;
	}
	var ret={success:true,acquisition:query.acquisition};
	ret.attributes=wdutils.read_json_file(path0+'/attributes.json');
	ret.metadata=wdutils.read_json_file(path0+'/metadata.json');
	callback(ret);
}

function add_acquisition(query,callback) {
	if (!query.group) {
		callback({success:false,error:'No group specified.'});
		return;
	}
	if (!query.project) {
		callback({success:false,error:'No project specified.'});
		return;
	}
	if (!query.session) {
		callback({success:false,error:'No session specified.'});
		return;
	}
	if (!query.acquisition) {
		callback({success:false,error:'No acquisition specified.'});
		return;
	}
	var user0=current_user(query);
	if (!has_group_access(user0,query.group,'write')) {
		callback({success:false,error:'User '+user0+' does not have write access to '+query.group});
		return;
	}
	var path0=wdconfig.data_path+'/groups/'+query.group+'/projects/'+query.project+'/sessions/'+query.session+'/acquisitions';
	var err='';
	if (!err) {
		if (!wdutils.mkdir(path0)) err='Unable to create acquisitions directory.';
	}
	if (!err) {
		if (wdutils.dir_exists(path0+'/'+query.acquisition)) err='Acquisition already exists.';
	}
	if (!err) {
		if (!wdutils.mkdir(path0+'/'+query.acquisition)) err='Unable to create acquisition directory.';
	}
	if (!err) {
		if (!wdutils.write_json_file(path0+'/'+query.acquisition+'/attributes.json',{})) err='Unable to write attributes.json.';
	}
	if (err) {
		callback({success:false,error:err});
		return;
	}
	callback({success:true});
}
function set_acquisition_attributes(query,callback) {
	var user0=current_user(query);
	if (!has_group_access(user0,query.group,'write')) {
		callback({success:false,error:'User '+user0+' does not have write access to '+query.group});
		return;
	}
	var path0=wdconfig.data_path+'/groups/'+query.group+'/projects/'+query.project+'/sessions/'+query.session+'/acquisitions/'+query.acquisition;
	if (!wdutils.dir_exists(path0)) {
		callback({success:false,error:'acquisition '+query.acquisition+' not found'});
		return;
	}
	var attributes=wdutils.read_json_file(path0+'/attributes.json');
	if ('description' in query) attributes.description=query.description;
	if ('type' in query) attributes.type=query.time;
	if (!wdutils.write_json_file(path0+'/attributes.json',attributes)) {
		callback({success:false,error:'Unable to write attributes file.'});
		return;
	}
	callback({success:true});
}
function remove_acquisition(query,callback) {
	var user0=current_user(query);
	if (!has_group_access(user0,query.group,'write')) {
		callback({success:false,error:'User '+user0+' does not have write access to '+query.group});
		return;
	}
	var path0=wdconfig.data_path+'/groups/'+query.group+'/projects/'+query.project+'/sessions/'+query.session+'/acquisitions/'+query.acquisition;
	if (!wdutils.dir_exists(path0)) {
		callback({success:false,error:'acquisition '+query.acquisition+' not found'});
		return;
	}
	if (!wdutils.delete_directory(path0)) {
		callback({success:false,error:'Unable to delete directory.'});
		return;
	}
	callback({success:true});
}
function rename_acquisition(query,callback) {
	var user0=current_user(query);
	if (!has_group_access(user0,query.group,'write')) {
		callback({success:false,error:'User '+user0+' does not have write access to '+query.group});
		return;
	}
	var path0=wdconfig.data_path+'/groups/'+query.group+'/projects/'+query.project+'/sessions/'+query.session+'/acquisitions/'+query.acquisition;
	var path1=wdconfig.data_path+'/groups/'+query.group+'/projects/'+query.project+'/sessions/'+query.session+'/acquisitions/'+query.new_acquisition;
	if (!wdutils.dir_exists(path0)) {
		callback({success:false,error:'acquisition '+query.acquisition+' not found'});
		return;
	}
	if (wdutils.dir_exists(path1)) {
		callback({success:false,error:'acquisition '+query.new_acquisition+' already exists'});
		return;
	}
	if (!wdutils.rename_directory(path0,path1)) {
		callback({success:false,error:'Unable to rename directory.'});
		return;
	}
	callback({success:true});
}

/* FILES **********************************************************/

function get_files(query,callback) {
	var user0=current_user(query);
	if (!has_group_access(user0,query.group,'read')) {
		callback({success:false,error:'User '+user0+' does not have read access to '+query.group});
		return;
	}
	var path0=wdconfig.data_path+'/groups/'+query.group+'/projects/'+query.project+'/sessions/'+query.session+'/acquisitions/'+query.acquisition+'/files';
	var files=wdutils.get_all_files(path0);
	callback({success:true,files:files});
}

function upload_file(query,REQ,callback) {
	var user0=current_user(query);
	if (!user0) {
		callback({success:false,error:'Not logged in'});
		return;
	}
	wdutils.mkdir(wdconfig.data_path+'/tmp-uploads');
	var fname=wdutils.make_random_id()+'.dat';
	var path=wdconfig.data_path+'/tmp-uploads/'+fname;
	REQ.pipe(fs.createWriteStream(path));
	REQ.on('end',function() {
		callback({success:true,file_name:fname});
	});
}

function download_file(RESP,query) {
	var path0=wdconfig.data_path+'/groups/'+query.group+'/projects/'+query.project+'/sessions/'+query.session+'/acquisitions/'+query.acquisition+'/files/'+query.file;
	if (!wdutils.file_exists(path0)) {
		send_json_response(RESP,{success:false,error:'file does not exist'});
		return;
	}
	//RESP.writeHead(200,'application/octet-stream');
	RESP.setHeader('Content-disposition','attachment; filename='+query.file);
	RESP.setHeader('Content-type','application/octet-stream');
	var SS=fs.createReadStream(path0);
	SS.pipe(RESP);
}
function get_file_stats(query,callback) {
	var path0=wdconfig.data_path+'/groups/'+query.group+'/projects/'+query.project+'/sessions/'+query.session+'/acquisitions/'+query.acquisition+'/files/'+query.file;
	if (!wdutils.file_exists(path0)) {
		callback({success:false,error:'file does not exist'});
		return;
	}
	compute_sha1_sum_of_file(path0,function(tmp) {
		if (!tmp.success) {
			callback(tmp);
			return;
		}
		var ret={success:true};
		ret.sha1=tmp.sha1;
		var stats=fs.statSync(path0);
		ret.size=stats.size;
		callback(ret);
	});
}

function add_file(query,callback) {
	if (!query.uploaded_file_name) {
		callback({success:false,error:'uploaded_file_name is empty.'});
		return;
	}
	
	var user0=current_user(query);
	if (!has_group_access(user0,query.group,'write')) {
		callback({success:false,error:'User '+user0+' does not have write access to '+query.group});
		return;
	}
	var path0=wdconfig.data_path+'/groups/'+query.group+'/projects/'+query.project+'/sessions/'+query.session+'/acquisitions/'+query.acquisition;
	if (!wdutils.dir_exists(path0)) {
		callback({success:false,error:'acquisition '+query.acquisition+' not found'});
		return;
	}
	if (!wdutils.mkdir(path0+'/files')) {
		callback({success:false,error:'Unable to create files directory.'});
		return;
	}
	var path1=wdconfig.data_path+'/tmp-uploads/'+query.uploaded_file_name;
	if (!wdutils.file_exists(path1)) {
		callback({success:false,error:'No such file: '+query.uploaded_file_name});
		return;
	}
	var path2=path0+'/files/'+query.file;
	if (wdutils.file_exists(path2)) wdutils.delete_file(path2);
	if (!wdutils.rename_file(path1,path2)) {
		callback({success:false,error:'Unable to rename file.'});
		return;
	}
	callback({success:true});
}
function rename_file(query,callback) {
	var user0=current_user(query);
	if (!has_group_access(user0,query.group,'write')) {
		callback({success:false,error:'User '+user0+' does not have write access to '+query.group});
		return;
	}
	var path0=wdconfig.data_path+'/groups/'+query.group+'/projects/'+query.project+'/sessions/'+query.session+'/acquisitions/'+query.acquisition;
	if (!wdutils.dir_exists(path0)) {
		callback({success:false,error:'acquisition '+query.acquisition+' not found'});
		return;
	}
	var path1=path0+'/files/'+query.file;
	var path2=path0+'/files/'+query.new_file;
	if (!wdutils.file_exists(path1)) {
		callback({success:false,error:'No such file: '+query.file});
		return;
	}
	if (wdutils.file_exists(path2)) {
		callback({success:false,error:'File already exists: '+query.new_file});
		return;
	}
	if (!wdutils.rename_file(path1,path2)) {
		callback({success:false,error:'Unable to rename file.'});
		return;
	}
	callback({success:true});
}
function remove_file(query,callback) {
	var user0=current_user(query);
	if (!has_group_access(user0,query.group,'write')) {
		callback({success:false,error:'User '+user0+' does not have write access to '+query.group});
		return;
	}
	var path0=wdconfig.data_path+'/groups/'+query.group+'/projects/'+query.project+'/sessions/'+query.session+'/acquisitions/'+query.acquisition;
	if (!wdutils.dir_exists(path0)) {
		callback({success:false,error:'acquisition '+query.acquisition+' not found'});
		return;
	}
	var path1=path0+'/files/'+query.file;
	if (!wdutils.file_exists(path1)) {
		callback({success:false,error:'No such file: '+query.file});
		return;
	}
	if (!wdutils.delete_file(path1)) {
		callback({success:false,error:'Unable to delete file.'});
		return;
	}
	callback({success:true});
}

/* ATTACHMENTS **********************************************************/

function get_item_path(query) {
	if (!query.group) return '';
	var path=wdconfig.data_path+'/groups/'+query.group;
	if (query.project) {
		path+='/projects/'+query.project;
		if (query.session) {
			path+='/sessions/'+query.session;
			if (query.acquisition) {
				path+='/acquisitions/'+query.acquisition;
			}
		}
	}
	return path;
}

function get_attachments(query,callback) {
	var user0=current_user(query);
	if (!has_group_access(user0,query.group,'read')) {
		callback({success:false,error:'User '+user0+' does not have read access to '+query.group});
		return;
	}
	var path0=get_item_path(query);
	var attachments=wdutils.get_all_files(path0+'/attachments');
	callback({success:true,attachments:attachments});
}

function download_attachment(RESP,query) {
	var path0=get_item_path(query)+'/attachments/'+query.attachment;
	if (!wdutils.file_exists(path0)) {
		send_json_response(RESP,{success:false,error:'file does not exist'});
		return;
	}
	//RESP.writeHead(200,'application/octet-stream');
	RESP.setHeader('Content-disposition','attachment; filename='+query.attachment);
	RESP.setHeader('Content-type','application/octet-stream');
	var SS=fs.createReadStream(path0);
	SS.pipe(RESP);
}
function get_attachment_stats(query,callback) {
	var path0=get_item_path(query)+'/attachments/'+query.attachment;
	if (!wdutils.file_exists(path0)) {
		callback({success:false,error:'file does not exist'});
		return;
	}
	compute_sha1_sum_of_file(path0,function(tmp) {
		if (!tmp.success) {
			callback(tmp);
			return;
		}
		var ret={success:true};
		ret.sha1=tmp.sha1;
		var stats=fs.statSync(path0);
		ret.size=stats.size;
		callback(ret);
	});
}

function add_attachment(query,callback) {
	if (!query.uploaded_file_name) {
		callback({success:false,error:'uploaded_file_name is empty.'});
		return;
	}
	if (!query.group) {
		callback({success:false,error:'group is empty.'});
		return;
	}
	if (!query.project) {
		callback({success:false,error:'project is empty.'});
		return;
	}
	
	var user0=current_user(query);
	if (!has_group_access(user0,query.group,'write')) {
		callback({success:false,error:'User '+user0+' does not have write access to '+query.group});
		return;
	}
	
	var path0=get_item_path(query);
	if (!wdutils.dir_exists(path0)) {
		callback({success:false,error:'item not found'});
		return;
	}
	if (!wdutils.mkdir(path0+'/attachments')) {
		callback({success:false,error:'Unable to create attachments directory.'});
		return;
	}
	var path1=wdconfig.data_path+'/tmp-uploads/'+query.uploaded_file_name;
	if (!wdutils.file_exists(path1)) {
		callback({success:false,error:'No such file: '+query.uploaded_file_name});
		return;
	}
	var path2=path0+'/attachments/'+query.attachment;
	if (wdutils.file_exists(path2)) wdutils.delete_file(path2);
	if (!wdutils.rename_file(path1,path2)) {
		callback({success:false,error:'Unable to rename attachment file.'});
		return;
	}
	callback({success:true});
}
function rename_attachment(query,callback) {
	var user0=current_user(query);
	if (!has_group_access(user0,query.group,'write')) {
		callback({success:false,error:'User '+user0+' does not have write access to '+query.group});
		return;
	}
	var path0=get_item_path(query);
	if (!wdutils.dir_exists(path0)) {
		callback({success:false,error:'acquisition '+query.acquisition+' not found'});
		return;
	}
	var path1=path0+'/attachments/'+query.attachment;
	var path2=path0+'/attachments/'+query.new_attachment;
	if (!wdutils.file_exists(path1)) {
		callback({success:false,error:'No such file: '+query.attachment});
		return;
	}
	if (wdutils.file_exists(path2)) {
		callback({success:false,error:'File already exists: '+query.new_attachment});
		return;
	}
	if (!wdutils.rename_file(path1,path2)) {
		callback({success:false,error:'Unable to rename file.'});
		return;
	}
	callback({success:true});
}
function remove_attachment(query,callback) {
	var user0=current_user(query);
	if (!has_group_access(user0,query.group,'write')) {
		callback({success:false,error:'User '+user0+' does not have write access to '+query.group});
		return;
	}
	var path0=get_item_path(query);
	if (!wdutils.dir_exists(path0)) {
		callback({success:false,error:'item not found'});
		return;
	}
	var path1=path0+'/attachments/'+query.attachment;
	if (!wdutils.file_exists(path1)) {
		callback({success:false,error:'No such file: '+query.file});
		return;
	}
	if (!wdutils.delete_file(path1)) {
		callback({success:false,error:'Unable to delete file.'});
		return;
	}
	callback({success:true});
}



function compute_sha1_sum_of_file(path,callback) {
	var ret=crypto.createHash('sha1');
	var s=fs.createReadStream(path);
	s.on('data',function(d) {ret.update(d);});
	s.on('end',function() {callback({success:true,sha1:ret.digest('hex')});});
	s.on('error',function(err) {callback({success:false,error:JSON.stringify(err)});});
}


