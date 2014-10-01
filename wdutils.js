var fs=require('fs');

var wdutils={};

wdutils.mkdir=function(path) {
	try {
		fs.mkdirSync(path);
	}
	catch(err) {
	}
	return wdutils.dir_exists(path);
};

wdutils.dir_exists=function(path) {
	var stat0;
	try {
		stat0=fs.statSync(path);
	}
	catch(err) {
		return false;
	}
	return stat0.isDirectory();
};

wdutils.file_exists=function(path) {
	var stat0;
	try {
		stat0=fs.statSync(path);
	}
	catch(err) {
		return false;
	}
	return stat0.isFile();
};

wdutils.delete_file=function(path) {
	try {
		fs.unlinkSync(path);
		return true;
	}
	catch(err) {
		return false;
	}
};

wdutils.delete_directory=function(path) {
	var dirs=wdutils.get_all_dirs(path);
	var files=wdutils.get_all_files(path);
	for (var i in dirs) {
		if (!wdutils.delete_directory(path+'/'+dirs[i])) return false;
	}
	for (var i in files) {
		if (!wdutils.delete_file(path+'/'+files[i])) return false;
	}
	try {
		fs.rmdirSync(path);
		return true;
	}
	catch(err) {
		return false;
	}
};

wdutils.rename_file=function(path1,path2) {
	try {
		fs.renameSync(path1,path2);
		return true;
	}
	catch(err) {
		return false;
	}
};

wdutils.rename_directory=function(path1,path2) {
	try {
		fs.renameSync(path1,path2);
		return true;
	}
	catch(err) {
		return false;
	}
};

wdutils.write_json_file=function(path,obj) {
	try {
		var json=JSON.stringify(obj);
		fs.writeFileSync(path,json);
		return true;
	}
	catch(err) {
		return false;
	}
};

wdutils.read_json_file=function(path,obj) {
	try {
		var json=fs.readFileSync(path);
		return JSON.parse(json);
	}
	catch(err) {
		return {};
	}
};


wdutils.get_all_dirs=function(path) {
	try {
		var files=fs.readdirSync(path);
		var ret=[];
		for (var i in files) {
			if (files[i].indexOf('.')!==0) {
				if (wdutils.dir_exists(path+'/'+files[i]))
					ret.push(files[i]);
			}
		}
		return ret;
	}
	catch(err) {
		return [];
	}
};

wdutils.get_all_files=function(path) {
	try {
		var files=fs.readdirSync(path);
		var ret=[];
		for (var i in files) {
			if (files[i].indexOf('.')!==0) {
				if (wdutils.file_exists(path+'/'+files[i]))
					ret.push(files[i]);
			}
		}
		return ret;
	}
	catch(err) {
		return [];
	}
};

wdutils.make_random_id=function(numchars) {
	if (!numchars) numchars=10;
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for( var i=0; i < numchars; i++ ) text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
};

exports.wdutils=wdutils;