import Property from "../models/Property.js";

export const addProperty = async (req, res) => {
  try {
    const { title, address, city, rent } = req.body;

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const property = await Property.create({
      title,
      address,
      city,
      rent,
      image,
      landlord: req.user.id,
    });

    res.status(201).json({
      success: true,
      property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Homepage properties
export const getHomeProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .sort({ createdAt: -1 })
      .select("title address city rent image");

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.json({ properties });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};