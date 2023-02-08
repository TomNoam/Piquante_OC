const express = require('express');
const Sauce = require('../models/Sauce');
const validateSauce = require('../validators/validate-sauce');
const fs = require('fs');

// ---------GET ALL-----------
const getAllSauces = (req, res) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
// ---------CREATE SAUCE-----------
const createSauce = (req, res, next) => {
  const payload = JSON.parse(req.body.sauce);
  // TODO you need to validate required fields before saving
  if (validateSauce(payload)) {
    const sauce = new Sauce({
      userId: payload.userId,
      name : payload.name,
      manufacturer : payload.manufacturer,
      description : payload.description,
      mainPepper : payload.mainPepper,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      heat : payload.heat,
      likes : payload.likes,
      dislikes : payload.dislikes,
      usersLiked : payload.usersLiked,
      usersDisliked : payload.usersDisliked
    });
    sauce.save().then(
      () => {
        res.status(201).json({
          message: 'Post saved successfully!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          message: error
        });
      }
    );
  } else {
    res.status(400).json({
      message: "your sauce is not valid"
    });
  }
};
// ---------GET ONE SAUCE-----------
const getOneSauce = ('/:id', (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
});
// ---------MODIFY SAUCE-----------
const modifySauce = ('/:id', (req, res, next) => {
  const sauce = new Sauce({
    _id: req.params.id,
    userId: req.body.userId,
    name : req.body.name,
    manufacturer : req.body.manufacturer,
    description : req.body.description,
    mainPepper : req.body.mainPepper,
    imageUrl : req.body.imageUrl,
    heat : req.body.heat,
    likes : req.body.likes,
    dislikes : req.body.dislikes,
    usersLiked : req.body.usersLiked,
    usersDisliked : req.body.usersDisliked
  });
  Sauce.updateOne({_id: req.params.id}, sauce).then(
    () => {
      res.status(201).json({
        message: 'Sauce updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});
// ---------DELETE SAUCE-----------
const deleteSauce = ('/:id', (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
  .then(sauce => {
      if (sauce.userId != req.auth.userId) {
          res.status(401).json({message: 'Not authorized'});
      } else {
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
              Sauce.deleteOne({_id: req.params.id})
                  .then(() => { res.status(200).json({message: 'Object Deleted !'})})
                  .catch(error => res.status(401).json({ error }));
          });
      }
  })
  .catch( error => {
      res.status(500).json({ error });
  });
  // Sauce.deleteOne({_id: req.params.id}).then(
  //   () => {

  //     res.status(200).json({
  //       message: 'Deleted!'
  //     });
  //   }
  // ).catch(
  //   (error) => {
  //     res.status(400).json({
  //       error: error
  //     });
  //   }
  // );
});

module.exports = {
  getAllSauces,
  createSauce,
  getOneSauce,
  modifySauce,
  deleteSauce
};