var express = require('express');
var router = express.Router();
var User = require('../util/model').User; 
/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('login');
});
router.post('/login',function(req,res,next){
	req.body.password = require('../util/md5').md5(req.body.password);
	User.findOne(req.body,function(err,user){
		if(err){
			next(err)
		}else{
			if(user){
				// req.session.admin = user;
				req.session.admin = user;
				res.redirect('/users')
			}else{
				res.redirect('back')
			}
		}
	})
});

router.get('/logout', function(req, res, next) {
	req.session.admin = null;
	res.redirect('/login');
});

router.get('/reg',function(req,res,next){
	res.render('reg');
});


router.post('/reg',function(req,res,next){
	req.body.password = require('../util/md5').md5(req.body.password);
	User.create(req.body,function(err,user){
		if(err){
			next(err)
		}else{
			res.redirect('/login')
		}
	})
})

router.post('/checkUsername', function(req, res, next) {
	User.findOne(req.body, function(err,user){
		if (err) {
			res.json({error:"服务器错误了，你自己想办法把"});
		} else {
			if (user) {
				res.json({success:1});
			} else {
				res.json({success:0});
			}
		}
	})
});

// 接收用户的手机号码，并且发送短信
router.post('/send', function(req, res, next) {
    // 接收手机号码并发送短信
    var phone = req.body.phone;

    // 获取随机的验证码
    function rand(m, n) {
        return Math.floor(Math.random() * (n - m + 1) + m)
    }
    var code = rand(1000, 9999);
    req.session.code = code;

    // 引入阿里大于提供的短信发送代码
    var TopClient = require('../util/msg/topClient.js').TopClient;

    var client = new TopClient({
        'appkey': '23341634',
        'appsecret': '7e30a1c2c254c9a109f283067e8d5e18',
        'REST_URL': 'http://gw.api.taobao.com/router/rest'
    });

    // 执行短信发送
    client.execute('alibaba.aliqin.fc.sms.num.send', {
            'extend': '123456',
            'sms_type': 'normal',
            'sms_free_sign_name': '俊哥技术小站',
            'sms_param': '{\"code\":\"' + code + '\"}',
            'rec_num': phone,
            'sms_template_code': 'SMS_105890028'
        },
        function(error, response) {
            if (error) {
                // 发送失败
                res.json({
                    success: 0
                })
            } else {
                // 发送成功
                res.json({
                    success: 1
                });
            }
        })
})

module.exports = router;
