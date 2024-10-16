const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const app = express();
const User = require('./models/User.js');
const Place = require('./models/Place.js')
const Booking = require('./models/Booking.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const path = require('path');

require('dotenv').config();

const bCryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'sdfklajflasjfklafasdfas';
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/Uploads'))
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}))

mongoose.connect(process.env.MONGO_URL);

app.get('/test', (req, res) => {
    res.json('test ok');
})

app.post('/login', async(req, res) => {
    const {email, password} = req.body;
    try {
        const userDoc = await User.findOne({email});
        if (userDoc) {
            const passOk = bcrypt.compareSync(password, userDoc.password)
            if (passOk) {
                jwt.sign({email: userDoc.email, id: userDoc._id, name: userDoc.name}, jwtSecret, {}, (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token).json(userDoc)
                })
            } else {
                const customError = new Error('Document not found');
                customError.name = 'DocumentNotFoundError';
                res.status(422).json({ error: 'Document not found' });
                throw customError;
            }
            
            
        } else {
            const customError = new Error('Document not found');
            customError.name = 'DocumentNotFoundError';
            res.status(422).json({ error: 'Document not found' });
            throw customError;
            
        }
    } catch (error) {
        console.log("ERROR " + error);
        
    }
})

app.post('/register', async (req, res) => {
    const {name, email, password} = req.body;
    try {
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bCryptSalt)
            });
        res.json(userDoc);
    } catch (error) {
        res.status(422).json(error)
    }
    
    
    
})

app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, decoded) => {
            if (err) throw err;
            const {name, email, _id} = await User.findById(decoded.id)
            res.json({name, email, _id});
        })
    } else {
        res.json(null);
    }
})

app.post("/logout", (req, res) => {
    res.clearCookie("token").json("logged out")
})

app.post("/upload-photo-by-link", async (req, res) => {
    try {
        const {link} = req.body;
        const newName = 'photo' + Date.now() + '.jpg'
        await imageDownloader.image({
            url: link,
            dest: __dirname + '/Uploads/' + newName
        })
        res.json(newName)
    } catch (error) {
        res.status(400).send(`Error: ${error.message}`);
    }
    
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
  })

  const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;  // Allowed file types
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
    if (mimetype && extname) {
      return cb(null, true);
    } else {
        return cb(new Error('Error: Images Only!'));
    }
  };

const photosMiddleware = multer({storage: storage, fileFilter: fileFilter});

app.post("/upload-photo-by-computer", photosMiddleware.array('photos', 100), (req, res) => {
    if (req.fileValidationError) {
        return res.status(400).json({ error: req.fileValidationError });
      }
    
      if (!req.files) {
        return res.status(400).json({ error: 'No files uploaded.' });
      }
    try {
        res.json(req.files)
    } catch (error) {
        res.status(400).send(`Error: ${error.message}`);
    }
    
})

app.post('/places', (req, res) => {
    
    const {token} = req.cookies;
    const {title, address, addedPhotos, 
        description, perks, extraInfo, 
        maxGuests, checkIn, checkOut, price} = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const placeDoc = await Place.create({
            owner: userData.id,
            title: title,
            description: description,
            photos: addedPhotos, 
            maxGuests: maxGuests,
            checkIn: checkIn,
            checkOut: checkOut,
            extraInfo: extraInfo,
            perks: perks,
            address: address,
            price: price
        });
        res.json(placeDoc);
    });

    
});

app.get('/places', async (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const {id} = userData;
        res.json(await Place.find({owner: id}))
    })
})

app.get('/places/:id', async (req, res) => {
    const {id} = req.params;
    res.json(await Place.
        findById(id).
        populate('owner').
        exec());

})

app.post('/update_place', async (req, res) => {
    const {token} = req.cookies;
    const {id, title, address, addedPhotos, 
        description, perks, extraInfo, 
        maxGuests, checkIn, checkOut, price} = req.body;
    
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const placeDoc = await Place.findById(id)
        try {
            console.log(addedPhotos)
            if (placeDoc.owner.equals(userData.id)) {
                placeDoc.title =  title;
                placeDoc.address = address;
                placeDoc.photos = addedPhotos;
                placeDoc.description = description;
                placeDoc.perks = perks;
                placeDoc.extraInfo = extraInfo;
                placeDoc.maxGuests = maxGuests;
                placeDoc.checkIn = checkIn;
                placeDoc.checkOut = checkOut;
                placeDoc.price = price;
                await placeDoc.validate();
                await placeDoc.save();
                res.json(placeDoc);
            } else {
                res.status(403).json("cant update post that isn't yours")
            }
        } catch (error) {
            if (error.name === 'ValidationError') {
                res.status(400).json({message: error.message});
            } else {
                res.status(500).json("Internal server error")
            }
            
        }
        
        
    });
    
});

app.get('/all-places', async (req, res) => {
    res.json(await Place.find())
})

function getUserDataFromToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) {
                reject(err);
            } else {
                resolve(userData);
            }
        })
    })
    
}

app.post('/bookings', async (req, res) => {
    const {token} = req.cookies;
    const userData = await getUserDataFromToken(token);
    const {place, checkIn, checkOut, guestCount, name, phoneNumber, price} = req.body;
    Booking.create({place, checkIn, checkOut, guests: guestCount, name, phone: phoneNumber, price, user: userData.id}).then(doc => {
        res.json(doc);
    }).catch(err => {throw err});

})



app.get('/bookings', async (req, res) => {
    try {
        const {token} = req.cookies;
        const userData = await getUserDataFromToken(token)
        res.json(await Booking.find({user: userData.id}).populate('place'))
    } catch (error) {
        console.error('Error verifying token:', error);
    }
    
})

app.use((err, req, res, next) => {
    if (err.message === 'Error: Images Only!') {
      return res.status(400).json({ error: err.message });
    }
    console.log(err)
    res.status(500).json({ error: 'Something went wrong!' });
  });

app.listen(4000);

