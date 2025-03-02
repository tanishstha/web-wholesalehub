import express from 'express';
import request from 'supertest';
import categoryModel from '../models/categoryModel.js';

// Mock the categoryModel
jest.mock('../models/categoryModel.js');

// Set up an Express app for testing
const app = express();
app.use(express.json());

// Your controllers
import {
    categoryController,
    createCategoryController,
    deleteCategoryController,
    singleCategoryController,
    updateCategoryController
} from '../controllers/categoryController.js';

// Add routes
app.post('/api/categories', createCategoryController);
app.put('/api/categories/:id', updateCategoryController);
app.get('/api/categories', categoryController);
app.get('/api/categories/:slug', singleCategoryController);
app.delete('/api/categories/:id', deleteCategoryController);

// Test suite for category controllers
describe('Category Controller Tests', () => {

    // Test the createCategoryController
    it('should create a new category', async () => {
        const mockCategory = { name: 'Electronics', slug: 'electronics' };
        
        categoryModel.findOne.mockResolvedValue(null);  // No existing category
        
        categoryModel.prototype.save.mockResolvedValue(mockCategory);  // Mock save

        const res = await request(app)
            .post('/api/categories')
            .send({ name: 'Electronics' });

        expect(res.status).toBe(201);
        expect(res.body.message).toBe('New Categry Created');
        expect(res.body.category.name).toBe(mockCategory.name);
        expect(res.body.category.slug).toBe(mockCategory.slug);
    });

    it('should return an error if name is missing when creating category', async () => {
        const res = await request(app)
            .post('/api/categories')
            .send({});

        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Name is Required');
    });

    it('should return an existing category when category already exists', async () => {
        const mockCategory = { name: 'Electronics', slug: 'electronics' };

        categoryModel.findOne.mockResolvedValue(mockCategory);  // Mock existing category

        const res = await request(app)
            .post('/api/categories')
            .send({ name: 'Electronics' });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Category created');
    });

    // Test the updateCategoryController
    it('should update an existing category', async () => {
        const mockCategory = { name: 'Updated Category', slug: 'updated-category' };
        
        categoryModel.findByIdAndUpdate.mockResolvedValue(mockCategory);

        const res = await request(app)
            .put('/api/categories/1')
            .send({ name: 'Updated Category' });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('category updated successfully');
        expect(res.body.category.name).toBe(mockCategory.name);
    });

    // Test the categoryController (get all categories)
    it('should return a list of categories', async () => {
        const mockCategories = [{ name: 'Electronics', slug: 'electronics' }];
        
        categoryModel.find.mockResolvedValue(mockCategories);

        const res = await request(app).get('/api/categories');

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('All category list');
        expect(res.body.category.length).toBeGreaterThan(0);
    });

    // Test the singleCategoryController
    it('should return a single category by slug', async () => {
        const mockCategory = { name: 'Electronics', slug: 'electronics' };

        categoryModel.findOne.mockResolvedValue(mockCategory);

        const res = await request(app).get('/api/categories/electronics');

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Single category fetched');
        expect(res.body.category.name).toBe(mockCategory.name);
    });

    // Test the deleteCategoryController
    it('should delete a category', async () => {
        categoryModel.findByIdAndDelete.mockResolvedValue({});

        const res = await request(app).delete('/api/categories/1');

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Cat deleted successfully');
    });

    it('should return an error when deleting a category', async () => {
        categoryModel.findByIdAndDelete.mockRejectedValue(new Error('Deletion failed'));

        const res = await request(app).delete('/api/categories/1');

        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Error while deleting category');
    });
});



