import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, LogOut, X } from 'lucide-react';
import { authService } from '@/services/auth';
import { productsService, Product } from '@/services/products';
import { User } from '@supabase/supabase-js';

export default function Admin() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<User | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'men',
        price: '',
        stock: 0,
        description: '',
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        checkAuth();
        fetchProducts();
    }, []);

    const checkAuth = async () => {
        try {
            const user = await authService.getSession();
            if (!user) {
                navigate('/auth/login');
                return;
            }
            setSession(user);
        } catch {
            navigate('/auth/login');
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await productsService.getAll();
            console.log("data", data)
            setProducts(data);
        } catch (err: unknown) {
            setError((err as Error).message ?? 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && !selectedProduct) return;
        if (!isEdit && !selectedFile) {
            setError('Please select a product image!');
            return;
        }
        setUploading(true);
        setError(null);
        try {
            let imageUrl = selectedProduct?.image_url || '';
            if (selectedFile) {
                imageUrl = await productsService.uploadImage(selectedFile);
            }

            const productData = {
                name: formData.name,
                category: formData.category as 'men' | 'women',
                price: parseFloat(formData.price),
                image_url: imageUrl,
                stock: parseInt(formData.stock.toString()),
                description: formData.description,
            };

            if (isEdit && selectedProduct) {
                await productsService.update(selectedProduct.id, productData);
            } else {
                await productsService.create(productData);
            }

            await fetchProducts();
            closeModal();
        } catch (err: unknown) {
            setError((err as Error).message ?? 'Unknown error');
        } finally {
            setUploading(false);
        }
    };

    const openModal = (product?: Product) => {
        if (product) {
            setIsEdit(true);
            setSelectedProduct(product);
            setFormData({
                name: product.name,
                category: product.category,
                price: product.price.toString(),
                stock: product.stock,
                description: product.description,
            });
        } else {
            setIsEdit(false);
            setSelectedProduct(null);
            setFormData({ name: '', category: 'men', price: '', stock: 0, description: '' });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEdit(false);
        setSelectedProduct(null);
        setSelectedFile(null);
        setFormData({ name: '', category: 'men', price: '', stock: 0, description: '' });
    };

    const handleEdit = (product: Product) => {
        openModal(product);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await productsService.delete(id);
            await fetchProducts();
        } catch (err: unknown) {
            setError((err as Error).message ?? 'Unknown error');
        }
    };

    const handleLogout = async () => {
        await authService.signOut();
        navigate('/auth/login');
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    if (!session) return null;

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-64 bg-white shadow-md">
                <div className="p-4 border-b">
                    <h1 className="text-xl font-bold">Admin Dashboard</h1>
                    <p className="text-sm text-gray-600">Welcome, {session.email}</p>
                </div>
                <nav className="mt-6 space-y-2 p-4">
                    <button onClick={() => navigate('/')} className="w-full flex items-center justify-start text-left p-2 hover:bg-gray-100 rounded">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Home
                    </button>
                    <button onClick={() => openModal()} className="w-full flex items-center justify-start text-left p-2 hover:bg-gray-100 rounded">
                        <Plus className="h-4 w-4 mr-2" /> Add Product
                    </button>
                    <button className="w-full flex items-center justify-start text-left p-2 hover:bg-gray-100 rounded">
                        <Edit className="h-4 w-4 mr-2" /> Manage (click to edit)
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center justify-start text-left p-2 hover:bg-gray-100 rounded text-red-600">
                        <LogOut className="h-4 w-4 mr-2" /> Logout
                    </button>
                </nav>
            </div>

            <div className="flex-1 p-6 overflow-auto">
                <h2 className="text-2xl font-bold mb-4">Product Management</h2>
                {error && <p className="text-red-600 mb-4 p-2 bg-red-50 rounded">{error}</p>}

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (VND)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product: Product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {product.category === 'men' ? 'Men' : 'Women'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.price.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stock}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate" title={product.description}>{product.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img src={product.image_url} alt={product.name} className="h-12 w-12 object-cover rounded" />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-900">
                                            <Edit className="h-4 w-4 inline" /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">
                                            <Trash2 className="h-4 w-4 inline" /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {products.length === 0 && (
                        <p className="text-center py-8 text-gray-500">No products yet. Add one now!</p>
                    )}
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">{isEdit ? 'Edit Product' : 'Add New Product'}</h3>
                                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Product Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="men">Men</option>
                                            <option value="women">Women</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Price (VND)</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Stock</label>
                                        <input
                                            type="number"
                                            name="stock"
                                            value={formData.stock}
                                            onChange={handleInputChange}
                                            min={0}
                                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Product Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {selectedFile && <p className="text-sm text-gray-600 mt-1">Selected: {selectedFile.name}</p>}
                                        {!isEdit && <p className="text-sm text-red-600">* Required for new products</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="flex gap-2 pt-4">
                                        <button
                                            type="submit"
                                            disabled={uploading}
                                            className="flex-1 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            {uploading ? 'Saving...' : (isEdit ? 'Update' : 'Add')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="flex-1 bg-gray-300 text-gray-700 p-2 rounded-md hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}