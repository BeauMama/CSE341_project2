/* eslint-disable no-console */
const { ObjectId } = require('mongodb');
const mongodb = require('../db/connect');

// Get all roommates
const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDb().collection('roommates').find();
    const lists = await result.toArray();
    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving roommates', error: err });
  }
};

// Get a single roommate by ID
const getSingle = async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ObjectId' });
  }

  try {
    const userId = new ObjectId(id);
    const roommate = await mongodb.getDb().collection('roommates').findOne({ _id: userId });

    if (!roommate) {
      return res.status(404).json({ message: 'Roommate not found' });
    }

    res.status(200).json(roommate);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving roommate', error: err });
  }
};

// Create a new reoommate
const createRoommate = async (req, res) => {
  const roommate = {
    name: req.body.name,
    age: req.body.age,
    major: req.body.major,
    contact: req.body.contact || {}
   
  };

  try {
    const response = await mongodb.getDb().collection('roommates').insertOne(roommate);
    if (response.acknowledged) {
      // Return the created school with its insertedId
      res.status(201).json({
        message: 'Roommate created successfully',
        school: {
          _id: response.insertedId,
          ...roommate
        }
      });
    } else {
      res.status(500).json({ message: 'There was an error creating the new roommate.' });
    }
  } catch (err) {
  
    console.error('Error creating roommate:', err);

   
    res.status(500).json({
      message: 'There was an error creating the new roommate',
      error: err.message
    });
  }
};

// Update a roommate by ID
const updateRoommate = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const roommate = {
    name: req.body.name,
    age: req.body.age,
    major: req.body.major,
    contact: req.body.contact || {}
  };

  try {
    const response = await mongodb.getDb().collection('roommates').replaceOne({ _id: userId }, roommate);
    if (response.modifiedCount > 0) {
      res.status(200).json({ message: 'Roommate updated' });
    } else {
      res.status(404).json({ message: 'Roommate not found or no changes made' });
    }
  } catch (err) {
    res.status(500).json({ message: 'There was an error updating the roommate', error: err });
  }
};

// Delete a roommate by ID
const deleteRoommate = async (req, res) => {
  const userId = new ObjectId(req.params.id);

  try {
    const response = await mongodb.getDb().collection('roommates').deleteOne({ _id: userId });

    if (response.deletedCount > 0) {
      res.status(200).json({ message: 'Roommate deleted' });
    } else {
      res.status(404).json({ message: 'Roommate not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'There was an error deleting the roommate', error: err });
  }
};

module.exports = { getAll, getSingle, createRoommate, updateRoommate, deleteRoommate };
