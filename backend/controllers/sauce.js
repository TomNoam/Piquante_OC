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

  if (validateSauce(payload)) {
    const sauce = new Sauce({
      userId: payload.userId,
      name : payload.name,
      manufacturer : payload.manufacturer,
      description : payload.description,
      mainPepper : payload.mainPepper,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      heat : payload.heat,
      likes : 0,
      dislikes : 0,
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
// // ---------MODIFY SAUCE-----------
const modifySauce = ('/:id', async (req, res, next) => {
  const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

  if (validateSauce(sauceObject) ) {
    let sauceFromDb;
    try {
      sauceFromDb = await Sauce.findOne({_id: req.params.id});
    } catch (error) {
      res.status(404).json({ error });
      return;
    }
    if (sauceFromDb.userId != req.auth.userId) {
      res.status(401).json({ message : 'Not authorized'});
      return;
    }
    const existingSauceImage = sauceFromDb.imageUrl;
    try {
      await Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id});
      res.status(200).json({message : 'Object Modified !'});
      if (existingSauceImage != sauceObject.imageUrl) {
        const existingSauceImageFilename = existingSauceImage.split('http://localhost:3000/')[1];
        fs.unlinkSync(existingSauceImageFilename);
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  } else {
    res.status(400).json({
      message: "your sauce is not valid !"
    });
  }
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
});

module.exports = {
  getAllSauces,
  createSauce,
  getOneSauce,
  modifySauce,
  deleteSauce
};