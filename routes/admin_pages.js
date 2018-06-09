            var express = require('express');
            var router = express.Router();
            var expressValidator = require('express-validator');
            var bodyParser=require('body-parser');
            var models=require('../models');


              // Get Page model
            var Page = require('../models/page');

                    /*
                    * Get Page model 
                    */

                    router.get('/',function(req,res){

                        models.Page.findAll({
                            order: [
                                ['sorting', 'DESC']
                            ],
                        }).then(function(pages){
                            res.render('admin/pages',{
                                pages:pages
                            });
                        }).catch(function(err){
                            console.log(err);
                        });
                    });
            
                        /*
                        * GET add page
                        */
            router.get('/add-page', function (req, res) {

                var title = "";
                var slug = "";
                var content = "";

                res.render('admin/add_page', {
                    title: title,
                    slug: slug,
                    content: content
                });

            });

            /*
            * POST add page
            */
            router.post('/add-page', function (req, res) {

                req.checkBody('title', 'Title must have a value.').notEmpty();
                req.checkBody('content', 'Content must have a value.').notEmpty();

                var title = req.body.title;
                var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
                if (slug == " ")
                    slug = title.replace(/\s+/g, '-').toLowerCase();
                var content = req.body.content;

                var errors = req.validationErrors();

                if (errors) {
                    res.render('admin/add_page', {
                        errors: errors,
                        title: title,
                        slug: slug,
                        content: content
                    });
                } else {
                models.Page.findOne({
                    where :{slug:slug}
                    })
                            models.Page.create({
                                title: title,
                                slug: slug,
                                content: content,
                                sorting: 0
                            })
                            
                                .then((page)=>{
                        
                                req.flash('success', 'Page added!');
                                res.redirect('/admin/pages');
                            })
                            .catch((err) => {
                            console.log(err);
                            })
                        }
                    });

                    //Sort Function
                    function sortPages(ids, callback) {
                        var count = 0;
                    
                        for (var i = 0; i < ids.length; i++) {
                            var id = ids[i];
                            count++;
                    
                            (function (count) {
                                models.Page.findById(id, function (err, page) {
                                    page.sorting = count;
                                    page.save(function (err) {
                                        if (err)
                                            return console.log(err);
                                        ++count;
                                        if (count >= ids.length) {
                                            callback();
                                        }
                                    });
                                });
                            })(count);
                    
                        }
                    }

/*
 * POST reorder pages
 */
router.post('/reorder-pages', function (req, res) {
    var ids = req.body['id[]'];

    sortPages(ids, function () {
        models.Page.findAll({
            order: [
                ['sorting', 'ASC']
            ],
        }).then(function(pages){
            res.render('admin/pages',{
                pages:pages
            });
        }).catch(function(err){
            console.log(err);
        });
    });

});

                    //         /*
                    //         *
                    //         *    POST REORDER PAGES AGAIN COPY THE GET METHOD 
                    //         */
                    
                    
                    // router.get('/reorder-pages',function(req,res){

                    //     var ids=req.body.id['id[]'];
                    //     var count=0;

                        
                    //     for(var i=0; i<ids.length; i++)
                    //     {
                    //         var id=ids[i];
                    //         count++;
                    //     (function(count){
                    //         models.page.find({
                    //             where:{
                    //                 id:req.params.id
                    //             }
                    //         })
                    //             .then(function(page){
                    //                 page.sorting=count;
                    //             })
                    //             .catch(function(err){
                    //                 console.log(err);
                    //             })
                    //         })(count);
                    //         }
                    //     });
                    

                        /*
                        * GET Editing page
                        */

                        router.get('/edit-page/:id', function (req, res) {

                        
                            models.Page.findOne({
                                where: {
                                    id:req.params.id
                                }         
                            })
                            .then(function(page){
                                id=page.id,
                                title=page.title,
                                slug=page.slug,
                                content=page.content
                            })
                            .then(function(){
                                res.render('admin/edit_page');
                            })
                                .catch(function(err){
                                console.log(err);
                                
                        })
                    });

                    /*
                    * POST Edit Page
                    */
                    
                    router.post('/edit-page/:id', function (req, res) {

                    req.checkBody('title', 'Title must have a value.').notEmpty();
                    req.checkBody('content', 'Content must have a value.').notEmpty();

                    var title = req.body.title;
                    
                    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
                
                    if (slug == " ")
                        slug = title.replace(/\s+/g, '-').toLowerCase();
                    var content = req.body.content;
                    
                    var Id = req.body.id;
                    
                    var condition={
                        where:
                        {id:Id}
                    };
                    var values={
                        title:req.body.title,
                        slug:req.body.slug,
                        content:req.body.content
                    };
                    options={multi:true};
                    var errors = req.validationErrors();

                    if (errors) {
                        res.render('admin/edit_page', {
                            errors: errors,
                            title: title,
                            slug: slug,
                            content: content,
                            id:id
                        });
                    } else {
                    
                        models.Page.update(values,{...condition,...options})  //ES6 sprade operator       

                            .then((page) => {
                                req.flash('success', 'Page added!');
                                res.redirect('/admin/pages');
                            })
                            .catch(function(err){
                                console.log(err);
                            })
                        }
                        });
                
                            /*
                            * Get Delete Page model 
                            */

                    router.get('/delete-page/:id',function(req,res){

                    
                        models.Page.destroy({
                            where:{id:req.params.id}
                        })
                        .then(function(page){
                            req.flash('success','Page Deleted');
                            res.redirect('/admin/pages/');
                        });
                        
                    });
                
            // Exports
            module.exports = router;
