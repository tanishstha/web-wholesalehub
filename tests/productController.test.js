import request from 'supertest';
import app from '../app'; // Ensure this is the correct Express app import
import productModel from '../models/productModel';
import mongoose from 'mongoose';

jest.mock('../models/productModel');

describe('Product Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Create Product', () => {
    it('should create a product successfully', async () => {
      const mockProduct = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Test Product',
        slug: 'test-product',
        description: 'A test product',
        price: 100,
        category: 'TestCategory',
        quantity: 10,
        shipping: true,
        photo: 'photo-url',
        photo1: 'photo1-url',
        photo2: 'photo2-url',
        colors: ['red', 'blue'],
      };

      productModel.prototype.save = jest.fn().mockResolvedValue(mockProduct);

      const res = await request(app)
        .post('/api/products')
        .send(mockProduct);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.product).toEqual(expect.objectContaining(mockProduct));
    });

    it('should return an error if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({ name: '' });

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Get All Products', () => {
    it('should fetch all products', async () => {
      productModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([{}]) }),
      });

      const res = await request(app).get('/api/products');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Get Single Product', () => {
    it('should fetch a single product', async () => {
      const mockProduct = { name: 'Test Product', slug: 'test-product' };
      productModel.findOne = jest.fn().mockResolvedValue(mockProduct);

      const res = await request(app).get('/api/products/test-product');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.product).toEqual(mockProduct);
    });
  });

  describe('Delete Product', () => {
    it('should delete a product successfully', async () => {
      productModel.findByIdAndDelete = jest.fn().mockResolvedValue(true);

      const res = await request(app).delete('/api/products/123');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});

