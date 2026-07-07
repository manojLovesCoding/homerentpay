import Property from "../models/Property.js";
import { v2 as cloudinary } from "cloudinary";

export const addProperty = async (req, res) => {
  try {
    const { title, address, city, rent } = req.body;

    let imageUrl = "";

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "properties",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    }

    const property = await Property.create({
      title,
      address,
      city,
      rent,
      image: imageUrl,
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


export const getProperties = async (req, res) => {
  try {
    const properties = await Property.find();

    res.json({
      properties,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


export const getHomeProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .sort({ createdAt: -1 })
      .select("title address city rent image");

    res.json({
      success: true,
      properties,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


export const deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);

    res.json({
      message: "Deleted",
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};