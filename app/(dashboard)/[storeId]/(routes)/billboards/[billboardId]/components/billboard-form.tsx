'use client';

import { Billboard } from '@prisma/client';
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
import ImageUpload from '@/components/image-upload';
import { toast } from 'react-toastify';

const formSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  imgUrl: z.string().min(1, 'Image URL is required'),
});

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
  initialData: Billboard | null;
}

export const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const params = useParams();
  const router = useRouter();

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: initialData?.label || '',
      imgUrl: initialData?.imageUrl || '',
    },
  });

  const handleAPIError = (err: unknown) => {
    if (axios.isAxiosError(err)) {
      setError(err.response?.data?.message || 'An unexpected error occurred.');
    } else {
      setError('An unexpected error occurred.');
    }
  };

  const title = initialData ? 'Edit Billboard' : 'Create Billboard';
  const description = initialData ? 'Edit your billboard' : 'Add a new billboard';
  const action = initialData ? 'Save changes' : 'Create Billboard';

  const onSubmit = async (data: BillboardFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const requestData = {
        label: data.label,
        imageUrl: data.imgUrl,  // Use imageUrl here to match the server-side
      };

      if (initialData) {
        await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, requestData);
      } else {
        console.log(data.imgUrl + ' ' + data.label);
        await axios.post(`/api/${params.storeId}/billboards`, requestData);
      }
      router.push(`/${params.storeId}/billboards`);
      toast.success('Billboard saved successfully');

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
      await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
      router.push(`/${params.storeId}/billboards`);
    } catch (err) {
      toast.error('Make sure you remove all categories using this billboard first');
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
          <FormField control={form.control} name="imgUrl" render={({ field }) => (
            <FormItem>
              <FormLabel>Background Image</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value ? [field.value] : []}
                  disabled={loading}
                  onChange={(url) => field.onChange(url)}
                  onRemove={() => field.onChange('')}
                />
              </FormControl>
            </FormItem>
          )} />
          <div className="grid grid-cols-3 gap-8">
            <FormField control={form.control} name="label" render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Billboard name" {...field} />
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
          <p>Are you sure you want to delete this billboard? This action cannot be undone.</p>
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
