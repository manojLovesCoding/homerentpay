import Property from "../models/Property.js";

export const addProperty = async (req, res) => {
  try {
    const { title, address, city, rent, image } = req.body;

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