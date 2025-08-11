const { Product } = require('../models');

// Obtenir tous les produits
async function getAllProducts(req, res, next) {
  try {
    const { category, available, outOfStock } = req.query;
    
    // Construire les conditions de filtrage
    const whereConditions = {};
    
    // Filtrer par catégorie si spécifié
    if (category) {
      whereConditions.category_id = category;
    }
    
    // Filtrer par disponibilité si spécifié
    if (available !== undefined) {
      whereConditions.is_available = available === 'true';
    }
    
    // Filtrer par stock si spécifié
    if (outOfStock !== undefined) {
      whereConditions.is_out_of_stock = outOfStock === 'true';
    }

    const products = await Product.findAll({
      where: whereConditions,
      include: [
        {
          model: require('../models/category'),
          as: 'Category',
          attributes: ['id', 'name', 'image_url']
        }
      ],
      order: [['name', 'ASC']]
    });

    res.json({ 
      success: true, 
      data: products,
      count: products.length,
      filters: {
        category: category || null,
        available: available || null,
        outOfStock: outOfStock || null
      }
    });
  } catch (err) {
    next(err);
  }
}

// Obtenir un produit par ID
async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

// Créer un nouveau produit
async function createProduct(req, res, next) {
  try {
    const { name, description, price, image_url, is_available, is_out_of_stock, category_id } = req.body;
    if (!name || !price || !category_id) {
      return res.status(400).json({ error: 'name, price, and category_id are required' });
    }
    const product = await Product.create({ name, description, price, image_url, is_available, is_out_of_stock, category_id });
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

// Mettre à jour un produit
async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description, price, image_url, is_available, is_out_of_stock, category_id } = req.body;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (image_url !== undefined) product.image_url = image_url;
    if (is_available !== undefined) product.is_available = is_available;
    if (is_out_of_stock !== undefined) product.is_out_of_stock = is_out_of_stock;
    if (category_id !== undefined) product.category_id = category_id;
    await product.save();
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

// Supprimer un produit
async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await product.destroy();
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
}

// Créer plusieurs produits à la fois
async function createMultipleProducts(req, res, next) {
  try {
    const { products } = req.body;
    
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ 
        error: 'products array is required and must not be empty' 
      });
    }

    // Valider chaque produit
    for (const product of products) {
      if (!product.name || !product.price || !product.category_id) {
        return res.status(400).json({ 
          error: 'Each product must have name, price, and category_id' 
        });
      }
    }

    // Créer tous les produits en une seule transaction
    const createdProducts = await Product.bulkCreate(products, {
      validate: true,
      returning: true
    });

    res.status(201).json({ 
      success: true, 
      data: createdProducts,
      message: `${createdProducts.length} products created successfully`
    });
  } catch (err) {
    next(err);
  }
}

// Obtenir les produits par catégorie
async function getProductsByCategory(req, res, next) {
  try {
    const { categoryId } = req.params;
    const { available, outOfStock } = req.query;

    // Construire les conditions de filtrage
    const whereConditions = {
      category_id: categoryId
    };

    // Filtrer par disponibilité si spécifié
    if (available !== undefined) {
      whereConditions.is_available = available === 'true';
    }

    // Filtrer par stock si spécifié
    if (outOfStock !== undefined) {
      whereConditions.is_out_of_stock = outOfStock === 'true';
    }

    const products = await Product.findAll({
      where: whereConditions,
      include: [
        {
          model: require('../models/category'),
          as: 'Category',
          attributes: ['id', 'name', 'image_url']
        }
      ],
      order: [['name', 'ASC']]
    });

    if (products.length === 0) {
      return res.status(200).json({ 
        success: true, 
        data: [],
        message: 'No products found for this category'
      });
    }

    res.json({ 
      success: true, 
      data: products,
      count: products.length
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  createMultipleProducts,
  updateProduct,
  deleteProduct,
};
