const express = require('express');
const Joi = require('joi');
const mongoose = require('mongoose');
const app = express();
const Movie = require('./models/movie');

app.use(express.json());

// const movies = [
// {id:1, genre: 'horror'},
// {id:2, genre: 'thriller'},
// {id:3, genre: 'adventure'},
// ];

mongoose.connect('mongodb+srv://nodershop:nodershop@noder-shop-ch3ay.mongodb.net/test?retryWrites=true');
app.get('/', (req,res) => {
res.send('Welcome to Vidley');
});

app.get('/api/genres', (req,res) => {
//res.send(movies);
Movie.find()
.exec()
.then(doc => {
    console.log("From MongoDB", doc);
    if (doc) {
      res.status(200).json(doc);
    } else {
      res
        .status(404)
        .json({ message: "No valid entry found for provided ID" });
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ error: err });
  });
});

app.get('/api/genres/:id', (req,res) => {
const mid = req.params.id;
if(!mid)
return res.status(404).send('Requested id not found');

Movie.findById(mid)
.exec()
.then(doc => {
    console.log("From MongoDB", doc);
    if (doc) {
      res.status(200).json(doc.genre);
    } else {
      res
        .status(404)
        .json({ message: "No valid entry found for provided ID" });
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ error: err });
  });

//res.send(genre.genre);
});

app.post('/api/genres', (req,res) => {

    const { error } = validateRes(req.body);
     if(error)
     {
         return res.status(400).send(error.details[0].message);
     }
    // const genre = {
    //     id: movies.length+1,
    //     genre: req.body.genre
    // };
    const movie = new Movie({
        _id: new mongoose.Types.ObjectId(),
        genre: req.body.genre
    });
    movie.save().then(result => {
        console.log(result);
        res.status(200).json({
            message: "Successful Entry",
            createdMovie: result
            });
    }).catch(err => console.log(err));
    
    // movies.push(genre);
    // res.send(genre);
});

app.patch('/api/genres/:id', (req,res) => {

    const mid = req.params.id;
    // if(!mid)
    // return res.status(404).send('Requested id not found');

    // const { error } = validateRes(req.body);
    //  if(error)
    //  {
    //      return res.status(400).send(error.details[0].message);
    //  }
    
    //  genre.genre = req.body.genre;
    //  res.send(movies);
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Movie.update({ _id: mid }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
    
});

app.delete('/api/genres/:id', (req,res) => {

    const mid = req.params.id;
    if(!mid)
    return res.status(404).send('Requested id not found');

    // const index = movies.indexOf(genre);
    // movies.splice(index, 1);

    // res.send(movies);

    Movie.remove({ _id: mid })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Listening to port ${port}...`);
});

function validateRes(genre){
   const schema = {
    genre: Joi.string().min(4).required()
};
  return Joi.validate(genre,schema);
}