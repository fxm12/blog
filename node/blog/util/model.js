var mongoose  = require('mongoose');

mongoose.connect('mongodb://localhost:27017/blog');

// 定义数据字段
var Schema = mongoose.Schema;

// 用户字段
var UserSchema = new Schema({
	username: String,
	password: String,
	age: Number,
	sex: String,
	likes: Array,
	position: String,
	intro: String,
	avatar: String
}, {timestamps:true});
exports.User = mongoose.model('User', UserSchema);

// 分类
var TypeSchema = new Schema({
	typename: String
}, {timestamps:true});
exports.Type = mongoose.model('Type', TypeSchema);


// 文章
var ArticleSchema = new Schema({
	articlename: String,
	content: String,
	// {}的内容是固定内容，不能改变，ref指向了是定义的模型
	type: {type: Schema.Types.ObjectId, ref: 'Type'}
}, {timestamps:true});
exports.Article = mongoose.model('Article', ArticleSchema);
