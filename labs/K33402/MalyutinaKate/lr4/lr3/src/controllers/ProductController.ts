import { Request, Response } from 'express';
import { Product } from '../models/product';
import { Op } from 'sequelize';

export class ProductController {
    public async create(req: Request, res: Response): Promise<void> {
        const { name, category, price, stock, discount } = req.body;
        try {
            const product = await Product.create({ name, category, price, stock, discount });
            res.status(201).json(product);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Unknown error' });
            }
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { name, category, price, stock, discount } = req.body;
        try {
            const product = await Product.findByPk(id);
            if (product) {
                await product.update({ name, category, price, stock, discount });
                res.json(product);
            } else {
                res.status(404).json({ error: 'Product not found' });
            }
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Unknown error' });
            }
        }
    }

    public async search(req: Request, res: Response): Promise<void> {
        try {
            const products = await Product.findAll({
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: `%${req.query.name}%` } },
                        { category: { [Op.like]: `%${req.query.category}%` } },
                        { price: { [Op.like]: `%${req.query.price}%` } },
                        { stock: { [Op.like]: `%${req.query.stock}%` } },
                        { discount: { [Op.like]: `%${req.query.discount}%` } }
                    ]
                }
            });
            res.json(products);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Unknown error' });
            }
        }
    }
}
