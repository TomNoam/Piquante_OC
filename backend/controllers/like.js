const express = require('express');
const Sauce = require('../models/Sauce');

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({_id : req.params.id})
    .then((object) => {  
// -----LIKES-----    
        if(!object.usersLiked.includes(req.body.userId) && req.body.like === 1){   
            Sauce.updateOne(
                {_id : req.params.id},
                {
                    $inc: {likes : 1}, 
                    $push: {usersLiked: req.body.userId} 
                }
            )
            .then(()=> res.status(201).json({message: "Sauce Liked !"}))
            .catch((error) => res.status(400).json({error}));
        }

        if(object.usersLiked.includes(req.body.userId) && req.body.like === 0){
            Sauce.updateOne(
                {_id : req.params.id},
                {
                    $inc: {likes : -1}, 
                    $pull: {usersLiked: req.body.userId} 
                }
            )
            .then(()=> res.status(201).json({message: "Sauce Neutral Like!"}))
            .catch((error) => res.status(400).json({error}));       
        }    
// -----DISLIKES-----
        if(!object.usersDisliked.includes(req.body.userId) && req.body.like === -1){  
            Sauce.updateOne(
                {_id : req.params.id},
                {
                    $inc: {dislikes : 1}, 
                    $push: {usersDisliked: req.body.userId} 
                }
            )
            .then(()=> res.status(201).json({message: "Sauce Disliked!"}))
            .catch((error) => res.status(400).json({error}));
        }
                        
        if(object.usersDisliked.includes(req.body.userId) && req.body.like === 0){  
            Sauce.updateOne(
                {_id : req.params.id},
                {
                    $inc: {dislikes : -1}, 
                    $pull: {usersDisliked: req.body.userId} 
                }
            )
            .then(()=> res.status(201).json({message: "Sauce Neutral Dislike!"}))
            .catch((error) => res.status(400).json({error}));
        }                    
    })

    .catch((error) => res.status(404).json({error}));
};