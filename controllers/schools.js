const { response } = require('express');
const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

const API_KEY = process.env.API_KEY;

const getAll = async (req, res) => {
  try {

const result = await mongodb.getDb().collection('in_state').find();
const lists = await result.toArray();

    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving contacts', error: err });
  }
};

const getSingle = async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ObjectId' });
  }

  try {
    const userId = new ObjectId(id);
    const contact = await mongodb.getDb().collection('in_state').findOne({ _id: userId });
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json(contact);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving contact', error: err });
  }
};

const createSchool = async (req, res) => {
  const contact =
  {
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday,
  };
  const response = await mongodb.getDb().collection('in_state').insertOne(contact);
  if(response.acknowledged){
    res.status(201).json({message: 'School created', contact: response});
}else{
  res.status(500).json({message: 'There was an Error creating the new school', error: err});
}
};

const updateSchool = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const contact = {
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday,
  };
  const response = await mongodb.getDb().collection('in_state').replaceOne({ _id: userId }, contact );

  if (response.modifiedCount > 0) {
    res.status(200).send();
  } else {
    res.status(500).json({ message: 'There was an Error updating the school', error: err });
  }
}

const deleteSchool = async (req, res) => {
  const userId= new ObjectId(req.params.id);
  const response = await mongodb.getDb().collection('in_state').deleteOne({_id: userId}, true);

  if (response.deletedCount > 0) {
      return res.status(200).send();
    }else{
      res.status(500).json({message: 'There was an Error deleting the school', error: err});
    }
};

module.exports = { getAll, getSingle, createSchool, updateSchool, deleteSchool };
