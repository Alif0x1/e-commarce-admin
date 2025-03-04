'use client';
import { Image, Product, Size, Colour, Category } from '@prisma/client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { z } from 'zod';

// UI Components from shadcn/ui
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from "@/components/ui/checkbox";
import { Trash } from 'lucide-react';
import ImageUpload from '@/components/imageuploaded';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the form validation schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  images: z.array(z.object({ url: z.string() })).min(1, "At least one image is required"),
  price: z.coerce.number().positive("Price must be positive"),
  categoryId: z.string().min(1, "Category is required"),
   colourId: z.string().min(1, "Color is required"),
  sizeId: z.string().min(1, "Size is required"),
  isFeatured: z.boolean().default(false),
  isArchived: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductsFormProps {
  initialData: (Product & { images: Image[] }) | null;
  colors: Colour[];
  categories: Category[];
  sizes: Size[];
}

export const ProductsForm = ({
  initialData,
  categories,
  colors,
  sizes
}: ProductsFormProps) => {
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const params = useParams();
  const router = useRouter();

  // Initialize form with default values or existing product data
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      price: parseFloat(String(initialData?.price)),
    } : {
      name: '',
      images: [],
      price: 0,
      categoryId: '',
       colourId: '',
      sizeId: '',
      isFeatured: false,
      isArchived: false,
    },
  });

  // Handle form submission
  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      const endpoint = initialData 
        ? `/api/${params.storeId}/products/${params.productId}`
        : `/api/${params.storeId}/products`;
        
        
      const requestData = {
        name: data.name,
         colourId: data. colourId,
        sizeId: data.sizeId,
        images:data.images,
        price:data.price,
        categoryId: data.categoryId,
        isFeatured:data.isFeatured,
        isArchived:data.isArchived,


      };
      const method = initialData ? axios.patch : axios.post;
      await method(endpoint, requestData);
      
      router.push(`/${params.storeId}/products`);
      toast.success(initialData ? 'Product updated successfully' : 'Product created successfully');
    } catch {
      toast.error('An error occurred while saving the product');
    } finally {
      setLoading(false);
    }
  };

  // Handle product deletion
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.push(`/${params.storeId}/products`);
      toast.success('Product deleted successfully');
    } catch {
      toast.error('Failed to delete product. Make sure there are no dependencies.');
    } finally {
      setLoading(false);
      setDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading 
          title={initialData ? 'Edit Product' : 'Create Product'} 
          description={initialData ? 'Edit your product details' : 'Add a new product to your store'}
        />
        {initialData && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setDialogOpen(true)}
            disabled={loading}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Image Upload Section */}
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map(img => img.url) || []}
                    disabled={loading}
                    onChange={(urls) => field.onChange(urls.map(url => ({ url })))}
                    onRemove={(url) => field.onChange(field.value.filter(img => img.url !== url))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Product Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      disabled={loading}
                      placeholder="0.00"
                      step="0.01"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Category Selection */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    disabled={loading} 
                    onValueChange={field.onChange} 
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                      
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Size Selection */}
            <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select 
                    disabled={loading} 
                    onValueChange={field.onChange} 
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Color Selection */}
            <FormField
              control={form.control}
              name="colourId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select 
                    disabled={loading} 
                    onValueChange={field.onChange} 
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                    </FormControl>
                  <SelectContent>
                    {colors.map((color) => (
                      <div key={color.id}>
                        <SelectItem value={color.id}>
                          {color.name}
                        </SelectItem>
                       
                      </div>
                    ))}
                  </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Product Status Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This product will be displayed on the home page.
                    </FormDescription>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                   <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will be hidden from the store.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Button 
            disabled={loading} 
            type="submit"
            className="w-full md:w-auto"
          >
            {loading ? "Saving..." : (initialData ? "Save changes" : "Create product")}
          </Button>
        </form>
      </Form>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this product? This action cannot be undone.</p>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)} 
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={onDelete} 
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsForm;