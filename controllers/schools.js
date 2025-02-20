/* eslint-disable no-console */
const { ObjectId } = require('mongodb');
const mongodb = require('../db/connect');

// Get all schools
const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDb().collection('schools').find();
    const lists = await result.toArray();
    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving schools', error: err });
  }
};

// Get a single school by ID
const getSingle = async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ObjectId' });
  }

  try {
    const userId = new ObjectId(id);
    const school = await mongodb.getDb().collection('schools').findOne({ _id: userId });

    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    res.status(200).json(school);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving school', error: err });
  }
};

// Create a new school
const createSchool = async (req, res) => {
  const school = {
    name: req.body.name,
    location: req.body.location,
    established: req.body.established,
    type: req.body.type,
    student_population: req.body.student_population,
    website: req.body.website,
    mascot: req.body.mascot
  };

  try {
    const response = await mongodb.getDb().collection('schools').insertOne(school);
    if (response.acknowledged) {
      // Return the created school with its insertedId
      res.status(201).json({
        message: 'School created successfully',
        school: {
          _id: response.insertedId,
          ...school
        }
      });
    } else {
      res.status(500).json({ message: 'There was an error creating the new school' });
    }
  } catch (err) {
  
    console.error('Error creating school:', err);

   
    res.status(500).json({
      message: 'There was an error creating the new school',
      error: err.message
    });
  }
};

// Update a school by ID
const updateSchool = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const school = {
    name: req.body.name,
    location: req.body.location,
    established: req.body.established,
    type: req.body.type,
    student_population: req.body.student_population,
    website: req.body.website,
    mascot: req.body.mascot
  };

  try {
    const response = await mongodb.getDb().collection('schools').replaceOne({ _id: userId }, school);
    
    if (response.modifiedCount > 0) {
      res.status(200).json({ message: 'School updated' });
    } else {
      res.status(404).json({ message: 'School not found or no changes made' });
    }
  } catch (err) {
    console.error('Error updating school:', err);
    res.status(500).json({ message: 'There was an error updating the school', error: err.message });
  }
};

// Delete a school by ID
const deleteSchool = async (req, res) => {
  const userId = new ObjectId(req.params.id);

  try {
    const response = await mongodb.getDb().collection('schools').deleteOne({ _id: userId });

    if (response.deletedCount > 0) {
      res.status(200).json({ message: 'School deleted' });
    } else {
      res.status(404).json({ message: 'School not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'There was an error deleting the school', error: err });
  }
};

module.exports = { getAll, getSingle, createSchool, updateSchool, deleteSchool };
