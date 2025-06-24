const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');

// Set default environment variables if not provided
if (!process.env.MONGODB_URI) {
  console.warn('No MONGODB_URI environment variable set');
  process.env.MONGODB_URI = 'mongodb://localhost:27017/mydatabase';
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`\n${new Date().toISOString()} ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Query:', req.query);
  console.log('Body:', req.body);
  next();
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define schema and model
const heritageSchema = new mongoose.Schema({
  serialNumber: {
    type: String,
    required: true
  },
  village_city: String,
  historic_name: String,
  other_name: String,
  other_village_data: String,
  street_name: String,
  house_no: String,
  name_adjoining_building: String,
  situated: String,
  approach: String,
  owner_data: String,
  occupancy: String,
  past_usage: String,
  present_usage: String,
  protected_structure: String,
  condition_preservation: String,
  history_significance: String,
  age_building: Number,
  age_source: String,
  estimated_year: Number,
  estimated_year_source: String,
  no_floor: Number,
  style_data: String,
  period_consturction: String,
  typology_building: String,
  roof_data: String,
  ceiling_data: String,
  wall_data: String,
  jallis_data: String,
  openings_data: String,
  floor_data: String,
  building_facades_data: String,
  others_data: String,
  setting_data: String,
  decorative_feature: String,
  coordinates: {
    lat: Number,
    lng: Number
  },
  images: {
    roof_image: [{
      type: { type: String, enum: ['image/jpeg', 'image/png', 'image/gif'] },
      data: Buffer
    }],
    ceiling_image: [{
      type: { type: String, enum: ['image/jpeg', 'image/png', 'image/gif'] },
      data: Buffer
    }],
    wall_image: [{
      type: { type: String, enum: ['image/jpeg', 'image/png', 'image/gif'] },
      data: Buffer
    }],
    jallis_image: [{
      type: { type: String, enum: ['image/jpeg', 'image/png', 'image/gif'] },
      data: Buffer
    }],
    openings_image: [{
      type: { type: String, enum: ['image/jpeg', 'image/png', 'image/gif'] },
      data: Buffer
    }],
    floor_image: [{
      type: { type: String, enum: ['image/jpeg', 'image/png', 'image/gif'] },
      data: Buffer
    }],
    building_facades_image: [{
      type: { type: String, enum: ['image/jpeg', 'image/png', 'image/gif'] },
      data: Buffer
    }],
    others_image: [{
      type: { type: String, enum: ['image/jpeg', 'image/png', 'image/gif'] },
      data: Buffer
    }],
    setting_image: [{
      type: { type: String, enum: ['image/jpeg', 'image/png', 'image/gif'] },
      data: Buffer
    }],
    decorative_feature_image: [{
      type: { type: String, enum: ['image/jpeg', 'image/png', 'image/gif'] },
      data: Buffer
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Heritage = mongoose.model('Heritage', heritageSchema);

// Multer configuration for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 100 // Maximum number of files
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types
    cb(null, true);
  }
});

// Create a dynamic upload handler that accepts all file fields
const dynamicUpload = upload.fields([
  { name: 'roof_image', maxCount: 10 },
  { name: 'ceiling_image', maxCount: 10 },
  { name: 'wall_image', maxCount: 10 },
  { name: 'jallis_image', maxCount: 10 },
  { name: 'openings_image', maxCount: 10 },
  { name: 'floor_image', maxCount: 10 },
  { name: 'building_facades_image', maxCount: 10 },
  { name: 'others_image', maxCount: 10 },
  { name: 'setting_image', maxCount: 10 },
  { name: 'decorative_feature_image', maxCount: 10 }
]);

// API endpoint to submit form data
app.post('/api/submit-form', dynamicUpload, async (req, res) => {
  try {
    console.log('\n=== Form Submission Received ===');
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    console.log('Files received:', req.files);

    const requiredFields = ['village_city', 'street_name', 'house_no', 'owner_data', 'lat', 'lng'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return res.status(400).json({ 
        error: `Missing required fields: ${missingFields.join(', ')}`,
        details: `Expected fields: ${requiredFields.join(', ')}`
      });
    }

    // Create a new heritage document
    const heritage = new Heritage({
      serialNumber: req.body.serial_number,
      village_city: Array.isArray(req.body.village_city) ? req.body.village_city[0] : req.body.village_city,
      historic_name: Array.isArray(req.body.historic_name) ? req.body.historic_name[0] : req.body.historic_name,
      other_name: Array.isArray(req.body.other_name) ? req.body.other_name[0] : req.body.other_name,
      other_village_data: Array.isArray(req.body.other_village_data) ? req.body.other_village_data[0] : req.body.other_village_data,
      street_name: Array.isArray(req.body.street_name) ? req.body.street_name[0] : req.body.street_name,
      house_no: Array.isArray(req.body.house_no) ? req.body.house_no[0] : req.body.house_no,
      name_adjoining_building: Array.isArray(req.body.name_adjoining_building) ? req.body.name_adjoining_building[0] : req.body.name_adjoining_building,
      situated: Array.isArray(req.body.situated) ? req.body.situated[0] : req.body.situated,
      approach: Array.isArray(req.body.approach) ? req.body.approach[0] : req.body.approach,
      owner_data: Array.isArray(req.body.owner_data) ? req.body.owner_data[0] : req.body.owner_data,
      occupancy: Array.isArray(req.body.occupancy) ? req.body.occupancy[0] : req.body.occupancy,
      past_usage: Array.isArray(req.body.past_usage) ? req.body.past_usage[0] : req.body.past_usage,
      present_usage: Array.isArray(req.body.present_usage) ? req.body.present_usage[0] : req.body.present_usage,
      protected_structure: Array.isArray(req.body.protected_structure) ? req.body.protected_structure[0] : req.body.protected_structure,
      condition_preservation: Array.isArray(req.body.condition_preservation) ? req.body.condition_preservation[0] : req.body.condition_preservation,
      history_significance: Array.isArray(req.body.history_significance) ? req.body.history_significance[0] : req.body.history_significance,
      age_building: Array.isArray(req.body.age_building) ? req.body.age_building[0] : req.body.age_building,
      age_source: Array.isArray(req.body.age_source) ? req.body.age_source[0] : req.body.age_source,
      estimated_year: Array.isArray(req.body.estimated_year) ? req.body.estimated_year[0] : req.body.estimated_year,
      estimated_year_source: Array.isArray(req.body.estimated_year_source) ? req.body.estimated_year_source[0] : req.body.estimated_year_source,
      no_floor: Array.isArray(req.body.no_floor) ? req.body.no_floor[0] : req.body.no_floor,
      style_data: Array.isArray(req.body.style_data) ? req.body.style_data[0] : req.body.style_data,
      period_consturction: Array.isArray(req.body.period_consturction) ? req.body.period_consturction[0] : req.body.period_consturction,
      typology_building: Array.isArray(req.body.typology_building) ? req.body.typology_building[0] : req.body.typology_building,
      roof_data: Array.isArray(req.body.roof_data) ? req.body.roof_data[0] : req.body.roof_data,
      ceiling_data: Array.isArray(req.body.ceiling_data) ? req.body.ceiling_data[0] : req.body.ceiling_data,
      wall_data: Array.isArray(req.body.wall_data) ? req.body.wall_data[0] : req.body.wall_data,
      jallis_data: Array.isArray(req.body.jallis_data) ? req.body.jallis_data[0] : req.body.jallis_data,
      openings_data: Array.isArray(req.body.openings_data) ? req.body.openings_data[0] : req.body.openings_data,
      floor_data: Array.isArray(req.body.floor_data) ? req.body.floor_data[0] : req.body.floor_data,
      building_facades_data: Array.isArray(req.body.building_facades_data) ? req.body.building_facades_data[0] : req.body.building_facades_data,
      others_data: Array.isArray(req.body.others_data) ? req.body.others_data[0] : req.body.others_data,
      setting_data: Array.isArray(req.body.setting_data) ? req.body.setting_data[0] : req.body.setting_data,
      decorative_feature: Array.isArray(req.body.decorative_feature) ? req.body.decorative_feature[0] : req.body.decorative_feature,
      coordinates: {
        lat: parseFloat(req.body.lat),
        lng: parseFloat(req.body.lng)
      },
      images: {
        roof_image: req.files?.roof_image?.map(img => ({
          type: img.mimetype,
          data: Buffer.from(img.buffer)
        })) || [],
        ceiling_image: req.files?.ceiling_image?.map(img => ({
          type: img.mimetype,
          data: Buffer.from(img.buffer)
        })) || [],
        wall_image: req.files?.wall_image?.map(img => ({
          type: img.mimetype,
          data: Buffer.from(img.buffer)
        })) || [],
        jallis_image: req.files?.jallis_image?.map(img => ({
          type: img.mimetype,
          data: Buffer.from(img.buffer)
        })) || [],
        openings_image: req.files?.openings_image?.map(img => ({
          type: img.mimetype,
          data: Buffer.from(img.buffer)
        })) || [],
        floor_image: req.files?.floor_image?.map(img => ({
          type: img.mimetype,
          data: Buffer.from(img.buffer)
        })) || [],
        building_facades_image: req.files?.building_facades_image?.map(img => ({
          type: img.mimetype,
          data: Buffer.from(img.buffer)
        })) || [],
        others_image: req.files?.others_image?.map(img => ({
          type: img.mimetype,
          data: Buffer.from(img.buffer)
        })) || [],
        setting_image: req.files?.setting_image?.map(img => ({
          type: img.mimetype,
          data: Buffer.from(img.buffer)
        })) || [],
        decorative_feature_image: req.files?.decorative_feature_image?.map(img => ({
          type: img.mimetype,
          data: Buffer.from(img.buffer)
        })) || []
      }
    });

    console.log('Attempting to save document:', heritage.toObject());

    // Save to database
    await heritage.save();
    console.log('Form data saved successfully with ID:', heritage._id);
    console.log('Saved document:', heritage.toObject());
    
    res.status(201).json({ 
      message: 'Form submitted successfully', 
      id: heritage._id,
      data: heritage.toObject() 
    });
  } catch (error) {
    console.error('\n=== Error in Form Submission ===');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    console.error('Request details:', {
      body: req.body,
      files: req.files
    });
    
    res.status(500).json({ 
      error: 'Failed to submit form', 
      details: error.message 
    });
  }
});

// Add a test endpoint to verify server is working
app.get('/api/test', async (req, res) => {
  try {
    console.log('\n=== Test Endpoint Hit ===');
    console.log('Request:', req);
    
    const count = await Heritage.countDocuments();
    console.log('Total documents in collection:', count);
    
    res.json({ 
      count, 
      message: 'Test endpoint working',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('\n=== Error in Test Endpoint ===');
    console.error('Error:', error);
    
    res.status(500).json({ 
      error: 'Test failed', 
      details: error.message 
    });
  }
});

// Add a test endpoint to check if data is being saved
app.get('/api/test', async (req, res) => {
  try {
    const count = await Heritage.countDocuments();
    console.log('Total documents in collection:', count);
    res.json({ count, message: 'Test endpoint working' });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ error: 'Test failed' });
  }
});

// API endpoint to get all submissions
app.get('/api/submissions', async (req, res) => {
  try {
    const submissions = await Heritage.find().sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Serve static files
app.use(express.static(__dirname));

// Start server
const PORT = process.env.PORT || 3000;
// Using MONGODB_URI from environment variables (already connected at the top)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Access form at http://localhost:3000/index.html');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
