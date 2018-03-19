var express = require('express');
var router = express.Router();

// 文章模型
var Article = require('../util/model').Article;
// 文章需要分类模型
var Type = require('../util/model').Type;

// 文章首页
router.get('/', function(req, res, next) {
	var name = {};
	if (req.query.articlename){
		name.articlename = new RegExp(req.query.articlename);
	}
	var str = '';
	for (var i in req.query){
		if (i != 'page'){
			str += i+ '=' + req.query[i]+'&'
		}
	}
	Article.count(function(err,total){
		if(err){
			next(err)
		}else{
			var page = {};
			page.every =4; 
			page.totalPage =Math.ceil(total/page.every);
			page.nowPage = Number(req.query.page ? req.query.page : 1);
			page.prevPage = page.nowPage - 1 <= 1 ? 1 : page.nowPage - 1;
			page.nextPage = page.nowPage + 1 >= page.totalPage ? page.totalPage : page.nowPage + 1
			Article.find(function(err,articles){
				if (err) {
					next(err)
				} else {
					res.render('articles/index', {articles:articles,moment:require('moment'),name:req.articles,str:str,page:page});
				}
			}).where(name).limit(4).skip((page.nowPage-1)*page.every).populate('type');
		}
	}).where(name);
});

// 添加分类
router.get('/create', function(req, res, next) {
	Type.find(function(err,types){
		if (err) {
			next(err);
		} else {
			console.log(types);
			res.render('articles/create', {types:types});
		}
	})
});
//文章添加页
router.get('/create',function(req,res,next){
	res.render('articles/create');
})
router.post('/create',function(req,res,next){
	Article.create(req.body,function(err){
		if(err){
			next(err);
		} else {
			res.redirect('/articles');
		}
	})
})

// 修改分类页面
router.get('/update/:_id', function(req, res, next) {
	Article.findOne(req.params, function(err,article){
		if (err) {
			next(err);
		} else {
			Type.find(function(err, types){
				if (err) {
					next(err);
				} else {
		  			res.render('articles/update',{types:types,article:article});
				}
			})
		}
	})
});

//文章删除
router.get('/remove/:_id',function(req,res,next){
	Article.remove(req.params,function(err){
		if(err){
			next(err);
		} else {
			res.redirect('/articles');
		}
	})
})

//文章修改
router.get('/update/:_id',function(req,res,next){
	Article.findOne(req.params,function(err,article){
		if(err){
			next(err);
		} else {
			res.render('articles/update',{article:article});
		}
	})
})

router.post('/update',function(req,res,next){
	Article.update({_id:req.body._id},req.body,function (err){
		if(err){
			next(err);
		} else {
			res.redirect('/articles');
		}
	})
})
module.exports = router;
