import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/utils/supabase';

export default function Admin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        category: 'nam',
        price: '',
        stock: 0,
        description: ''
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

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
        if (!selectedFile) {
            setError('Vui lòng chọn ảnh sản phẩm!');
            return;
        }

        setUploading(true);
        setError(null);
        try {

            const fileName = `${Date.now()}-${selectedFile.name}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(fileName, selectedFile, {});
            console.log("supabase", supabase.storage)
            if (uploadError) throw new Error(`Upload ảnh lỗi: ${uploadError.message}`);


            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(fileName);


            const { error: insertError } = await supabase
                .from('products')
                .insert([
                    {
                        name: formData.name,
                        category: formData.category,
                        price: parseFloat(formData.price),
                        image_url: publicUrl,
                        stock: parseInt(formData.stock.toString()),
                        description: formData.description
                    }
                ]);

            if (insertError) throw new Error(`Thêm sản phẩm lỗi: ${insertError.message}`);

            setSuccess(true);

            setFormData({ name: '', category: 'nam', price: '', stock: 0, description: '' });
            setSelectedFile(null);

            setTimeout(() => navigate('/'), 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">  {/* Tailwind classes */}
            <Button onClick={() => navigate('/')} variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" /> Quay về
            </Button>
            <h1 className="text-2xl font-bold mb-6 text-center">Thêm Sản Phẩm Mới</h1>

            {success && <p className="text-green-600 mb-4 text-center">Thêm sản phẩm thành công!</p>}
            {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tên sản phẩm */}
                <div>
                    <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="nam">Nam</option>
                        <option value="nu">Nữ</option>
                    </select>
                </div>

                {/* Giá */}
                <div>
                    <label className="block text-sm font-medium mb-1">Giá (VND)</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Stock */}
                <div>
                    <label className="block text-sm font-medium mb-1">Số lượng tồn kho</label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        min={0}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Upload ảnh */}
                <div>
                    <label className="block text-sm font-medium mb-1">Ảnh sản phẩm</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {selectedFile && <p className="text-sm text-gray-600 mt-1">Đã chọn: {selectedFile.name}</p>}
                </div>

                {/* Mô tả */}
                <div>
                    <label className="block text-sm font-medium mb-1">Mô tả</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Submit */}
                <Button type="submit" disabled={uploading} className="w-full">
                    {uploading ? 'Đang thêm...' : 'Thêm Sản Phẩm'}
                </Button>
            </form>
        </div>
    );
}