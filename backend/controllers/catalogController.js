const { Category, Product, ProductImage } = require('../models');
const { Sequelize } = require('sequelize');

const createCategory = async (req, res) => {
  try {
    const rawName = (req.body && req.body.name) ? String(req.body.name) : '';
    const rawSlug = (req.body && req.body.slug) ? String(req.body.slug) : '';

    const name = rawName.trim();
    let slug = rawSlug.trim().toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!slug) {
      return res.status(400).json({ error: 'Slug is required' });
    }

    // Check for duplicate slug for clearer error than generic validation
    const existing = await Category.findOne({ where: { slug } });
    if (existing) {
      return res.status(409).json({ error: 'Slug already exists. Please choose a different slug.' });
    }

    const category = await Category.create({ name, slug });
    res.status(201).json(category);
  } catch (err) {
    // Fallback: still surface a readable error
    const message = (err && err.message) ? err.message : 'Failed to create category';
    res.status(400).json({ error: message });
  }
};

const listCategories = async (req, res) => {
  try {
    const limit = Math.max(parseInt(req.query.limit, 10) || 0, 0);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const offset = limit > 0 ? (page - 1) * limit : undefined;

    // Simple query without GROUP BY for now to avoid SQL issues
    const baseQuery = {
      attributes: ['id', 'name', 'slug'],
      include: [{ model: Product, attributes: ['id'], required: false, as: 'Products' }],
      order: [['name', 'ASC']],
    };

    if (limit > 0) {
      const result = await Category.findAndCountAll({ 
        ...baseQuery, 
        limit, 
        offset,
        distinct: true // This ensures count is accurate with includes
      });
      return res.json({ rows: result.rows, count: result.count, page, pageSize: limit });
    }

    const result = await Category.findAndCountAll(baseQuery);
    return res.json({ rows: result.rows, count: result.count, page: 1, pageSize: result.rows.length });
  } catch (err) {
    console.error('Categories list error:', err);
    res.status(500).json({ error: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { title, slug, description, price, sku, stock, category_id, images } = req.body;
    
    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Product title is required' });
    }
    if (!slug || !slug.trim()) {
      return res.status(400).json({ error: 'Product slug is required' });
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      return res.status(400).json({ error: 'Valid price is required' });
    }
    if (!category_id || isNaN(Number(category_id)) || Number(category_id) <= 0) {
      return res.status(400).json({ error: 'Valid category is required' });
    }
    if (stock !== undefined && (isNaN(Number(stock)) || Number(stock) < 0)) {
      return res.status(400).json({ error: 'Stock must be a non-negative number' });
    }
    
    // Check if category exists
    const categoryExists = await Category.findByPk(category_id);
    if (!categoryExists) {
      return res.status(400).json({ error: 'Selected category does not exist' });
    }
    
    // Check if slug already exists
    const existingProduct = await Product.findOne({ where: { slug: slug.trim() } });
    if (existingProduct) {
      return res.status(400).json({ error: 'A product with this slug already exists' });
    }
    
    const product = await Product.create({ 
      title: title.trim(), 
      slug: slug.trim(), 
      description: description?.trim() || '', 
      price: Number(price), 
      sku: sku?.trim() || '', 
      stock: Number(stock || 0), 
      category_id: Number(category_id), 
      created_at: new Date() 
    });
    
    if (Array.isArray(images) && images.length > 0) {
      const records = images.map((url) => ({ product_id: product.id, url: url.trim() })).filter(record => record.url);
      if (records.length > 0) {
        await ProductImage.bulkCreate(records);
      }
    }
    
    const withRelations = await Product.findByPk(product.id, { include: [{ model: ProductImage, as: 'images' }, { model: Category, as: 'Category' }] });
    res.status(201).json(withRelations);
  } catch (err) {
    console.error('Product creation error:', err);
    res.status(400).json({ error: err.message || 'Failed to create product' });
  }
};

const listProducts = async (req, res) => {
  const limit = Math.max(parseInt(req.query.limit, 10) || 0, 0);
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const offset = limit > 0 ? (page - 1) * limit : undefined;

  if (limit > 0) {
    const result = await Product.findAndCountAll({
      include: [{ model: ProductImage, as: 'images' }, { model: Category, as: 'Category' }],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });
    return res.json({ rows: result.rows, count: result.count, page, pageSize: limit });
  }

  const products = await Product.findAll({ include: [{ model: ProductImage, as: 'images' }, { model: Category, as: 'Category' }], order: [["created_at", "DESC"]] });
  res.json({ rows: products, count: products.length, page: 1, pageSize: products.length });
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, description, price, sku, stock, category_id, images } = req.body;
    
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Product title is required' });
    }
    if (!slug || !slug.trim()) {
      return res.status(400).json({ error: 'Product slug is required' });
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      return res.status(400).json({ error: 'Valid price is required' });
    }
    if (!category_id || isNaN(Number(category_id)) || Number(category_id) <= 0) {
      return res.status(400).json({ error: 'Valid category is required' });
    }
    if (stock !== undefined && (isNaN(Number(stock)) || Number(stock) < 0)) {
      return res.status(400).json({ error: 'Stock must be a non-negative number' });
    }
    
    // Check if category exists
    const categoryExists = await Category.findByPk(category_id);
    if (!categoryExists) {
      return res.status(400).json({ error: 'Selected category does not exist' });
    }
    
    // Check if slug already exists (excluding current product)
    const existingProduct = await Product.findOne({ where: { slug: slug.trim() } });
    if (existingProduct && existingProduct.id !== parseInt(id)) {
      return res.status(400).json({ error: 'A product with this slug already exists' });
    }

    await product.update({ 
      title: title.trim(), 
      slug: slug.trim(), 
      description: description?.trim() || '', 
      price: Number(price), 
      sku: sku?.trim() || '', 
      stock: Number(stock || 0), 
      category_id: Number(category_id) 
    });
    
    // Update images if provided
    if (Array.isArray(images)) {
      // Delete existing images
      await ProductImage.destroy({ where: { product_id: id } });
      // Add new images
      if (images.length > 0) {
        const records = images.map((url) => ({ product_id: id, url: url.trim() })).filter(record => record.url);
        if (records.length > 0) {
          await ProductImage.bulkCreate(records);
        }
      }
    }

    const withRelations = await Product.findByPk(id, { include: [{ model: ProductImage, as: 'images' }, { model: Category, as: 'Category' }] });
    res.json(withRelations);
  } catch (err) {
    console.error('Product update error:', err);
    res.status(400).json({ error: err.message || 'Failed to update product' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete associated images first
    await ProductImage.destroy({ where: { product_id: id } });
    
    // Delete the product
    await product.destroy();
    
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const productsInCategory = await Product.count({ where: { category_id: id } });
    if (productsInCategory > 0) {
      return res.status(409).json({ error: 'Cannot delete category because it has associated products' });
    }

    await category.destroy();
    return res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = { createCategory, listCategories, createProduct, listProducts, updateProduct, deleteProduct, deleteCategory };


