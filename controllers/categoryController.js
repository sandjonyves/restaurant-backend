const { Category } = require('../models');
const cloudinary = require("../config/cloudinary")
// Obtenir toutes les catégories
async function getAllCategories(req, res, next) {
  try {
    const categories = await Category.findAll();
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
}

// Obtenir une catégorie par ID
async function getCategoryById(req, res, next) {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
}

// Créer une nouvelle catégorie
async function createCategory(req, res, next) {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    let imageUrl = null;

    // Vérifie si une image a été envoyée
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'categories', // pour organiser dans ton cloudinary
      });
      imageUrl = result.secure_url;
    }

    const category = await Category.create({
      name,
      description,
      image_url: imageUrl,
    });

    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
}

export default { createCategory };

// Mettre à jour une catégorie
async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { name, image_url } = req.body;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    if (name !== undefined) category.name = name;
    if (image_url !== undefined) category.image_url = image_url;
    await category.save();
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
}

// Supprimer une catégorie
async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    await category.destroy();
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
}

// Créer plusieurs catégories à la fois
async function createMultipleCategories(req, res, next) {
  try {
    const { categories } = req.body;
    
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ 
        error: 'categories array is required and must not be empty' 
      });
    }

    // Valider chaque catégorie
    for (const category of categories) {
      if (!category.name) {
        return res.status(400).json({ 
          error: 'Each category must have a name' 
        });
      }
    }

    // Créer toutes les catégories en une seule transaction
    const createdCategories = await Category.bulkCreate(categories, {
      validate: true,
      returning: true
    });

    res.status(201).json({ 
      success: true, 
      data: createdCategories,
      message: `${createdCategories.length} categories created successfully`
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  createMultipleCategories,
  updateCategory,
  deleteCategory,
};
