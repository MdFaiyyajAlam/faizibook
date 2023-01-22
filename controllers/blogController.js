const Post = require('../models/postModel');
const Setting = require('../models/settingModel');
const { ObjectID } = require('mongodb');

const loadBlog = async(req,res)=> {
    try {

        var setting = await Setting.findOne({});
        var limit = setting.post_limit;

        const posts = await Post.find({}).limit(limit);
        res.render('blog',{
            posts:posts,
            postlimit:limit
        });
    } catch (error) {
        console.log(error.message);
    }
}


const loadPost = async(req, res) => {

    try {

       const post = await Post.findOne({ "_id":req.params.id });
        res.render('post',{post:post});
    } catch (error) {
        console.log(error.message);
    }

}
// add comment 

const addComment = async(req,res) => {
    try {
        
        var post_id = req.body.post_id;
        var username = req.body.username;
        var email = req.body.email;
        var comment = req.body.comment;

        var comment_id = new ObjectID();

        await Post.findByIdAndUpdate({_id:post_id},{
            $push:{
                "comments":{_id:comment_id, username:username, email:email, comment:comment}
            }
        });

        res.status(200).send({success:true,msg:'comment added', _id:comment_id});
    } catch (error) {
        res.status(200).send({success:false,msg:error.message});
    }
}


const doReply = async(req, res) =>{
    try {
        
        var reply_id = new ObjectID();
        await Post.updateOne({
            "_id":ObjectID(req.body.post_id),
            "comments._id":ObjectID(req.body.comment_id)
        },{
            $push:{
                "comments.$.replies":{ _id:reply_id, name:req.body.name, reply:req.body.reply }
            }
        });
        res.status(200).send({success:true,msg:'Reply Added',_id:reply_id});
    
    } catch (error) {
        res.status(200).send({success:false,msg:error.message});
    }
}

const getPosts = async(req,res) => {
    try {
        const posts = await Post.find({}).skip(req.params.start).limit(req.params.limit);
        res.send(posts);
    } catch (error) {
        res.status(200).send({success:false,msg:error.message});
    }
}



const loadAbout = async(req, res) => {
    try {
        res.render('about');
    } catch (error) {
        console.log(error.message);
    }
}

const loadContact = async(req, res) => {
    try {
        res.render('contact');
    } catch (error) {
        console.log(error.message);
    }
}

const loadServices = async(req, res) => {
    try {
        res.render('services');
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadBlog,
    loadPost,
    addComment,
    doReply,
    getPosts,
    loadAbout,
    loadContact,
    loadServices
}