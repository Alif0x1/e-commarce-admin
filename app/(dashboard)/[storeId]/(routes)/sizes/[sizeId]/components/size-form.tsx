'use client';

import { Size } from '@prisma/client';
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

const formSchema = z.object({
  name: z.string().min(1, 'Label is required'),
  value: z.string().min(1, 'Image URL is required'),
});

type SizeFormValues = z.infer<typeof formSchema>;

interface SizeFormProps {
  initialData: Size | null;
}

export const SizeForm: React.FC<SizeFormProps> = ({ initialData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const params = useParams();
  const router = useRouter();

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      value: initialData?.value || '',
    },
  });

  const handleAPIError = (err: unknown) => {
    if (axios.isAxiosError(err)) {
      setError(err.response?.data?.message || 'An unexpected error occurred.');
    } else {
      setError('An unexpected error occurred.');
    }
  };

  const title = initialData ? 'Edit Size' : 'Create Size';
  const description = initialData ? 'Edit your Size' : 'Add a new Size';
  const action = initialData ? 'Update' : 'Create Size';

  const onSubmit = async (data: SizeFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const requestData = {
        name: data.name,
        value: data.value,  // Use imageUrl here to match the server-side
      };

      if (initialData) {
        await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, requestData);
      } else {
        console.log(data.name + ' ' + data.value);
        await axios.post(`/api/${params.storeId}/sizes`, requestData);
      }
      router.push(`/${params.storeId}/sizes`);
      toast.success('Size saved successfully');

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
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
      router.push(`/${params.storeId}/sizes`);
    } catch (err) {
      toast.error('Make sure you remove all categories using this Size first');
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
                <FormLabel>name</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Size name" {...field} />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )} />

            <FormField control={form.control} name="value" render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>value</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Size name" {...field} />
                </FormControl>
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
          <p>Are you sure you want to delete this Size? This action cannot be undone.</p>
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
