'use client';

import { Billboard, Category } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert } from '@/components/ui/alert';
import { Trash } from 'lucide-react';
import { toast } from 'react-toastify';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectGroup
} from "@/components/ui/select"


const formSchema = z.object({
  name: z.string().min(1, 'Label is required'),
  BillboardId: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  initialData: Category | null;
  billboards: Billboard[] | null;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, billboards }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const params = useParams();
  const router = useRouter();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      BillboardId: initialData?.BillboardId || '',
    },
  });

  const handleAPIError = (err: unknown) => {
    if (axios.isAxiosError(err)) {
      setError(err.response?.data?.message || 'An unexpected error occurred.');
    } else {
      setError('An unexpected error occurred.');
    }
  };

  const title = initialData ? 'Edit Category' : 'Create Category';
  const description = initialData ? 'Edit your Category' : 'Add a new Category';
  const action = initialData ? 'Save changes' : 'Create Category';

  const onSubmit = async (data: CategoryFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const requestData = {
        name: data.name,
        BillboardId: data.BillboardId,  // Use imageUrl here to match the server-side
      };

      if (initialData) {
        await axios.patch(`/api/${params.storeId}/categories/${params.categoriesId}`, requestData);
      } else {
        console.log(data.name + ' ' + data.BillboardId);
        await axios.post(`/api/${params.storeId}/categories`, requestData);
      }
      router.push(`/${params.storeId}/categories`);
      toast.success('Category saved successfully');

    } catch (err) {
      handleAPIError(err);
    } finally {
      setLoading(false);
    }
  };


  const onDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      await axios.delete(`/api/${params.storeId}/categories/${params.categoriesId}`);
      router.push(`/${params.storeId}/categories`);
      toast.success('Category deleted successfully');
      router.refresh();
    } catch (err) {
      toast.error('Make sure you remove all categories using this Category first');
      handleAPIError(err);
    } finally {
      setLoading(false);
      setDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button variant="destructive" size="icon" onClick={() => setDialogOpen(true)} disabled={loading}>
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      {error && (
        <Alert variant="destructive">
          <span>{error}</span>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-3 gap-8">
            <FormField control={form.control} name="name" render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Category name" {...field} />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )} />


            <FormField control={form.control} name="BillboardId" render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Billboard</FormLabel>
                <Select
                  disabled={loading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a Billboard" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Available Billboards {billboards?.length}</SelectLabel>
                      {billboards && billboards.length > 0 ? (
                        billboards.map((billboard) => (
                          <SelectItem key={billboard.id} value={billboard.id}>
                            {billboard.label}
                          </SelectItem>
                          
                        ))
                      ) : (
                        <SelectItem value="" disabled>
                          No billboards available
                        </SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )} />


          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : action}
          </Button>
        </form>
      </Form>
      <Separator />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this Category? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onDelete} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
