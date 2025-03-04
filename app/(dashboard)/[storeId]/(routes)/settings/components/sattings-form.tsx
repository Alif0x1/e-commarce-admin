'use client';

import { Store } from '@prisma/client';
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
import ApiAlert from '@/components/api-alert';
import { UseOrigin } from '@/hooks/use-origin';


const formSchema = z.object({
  name: z.string().min(1, 'Name is required').max(40, 'Name is too long'),
});

type SettingsFormValues = z.infer<typeof formSchema>;

interface SettingsFormProps {
  initialData: Store | null;
}

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const params = useParams();
  const router = useRouter();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
    },
  });

  const handleAPIError = (err: unknown) => {
    if (axios.isAxiosError(err)) {
      setError(err.response?.data?.message || 'An unexpected error occurred.');
    } else {
      setError('An unexpected error occurred.');
    }
  };

  const origin = UseOrigin();

  const onSubmit = async (data: SettingsFormValues) => {
    setLoading(true);
    setError(null);

    try {
      await axios.patch(`/api/stores/${params.storeId}`, data);
      router.refresh();
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
      await axios.delete(`/api/stores/${params.storeId}`);
      router.push('/');
    } catch (err) {
      handleAPIError(err);
    } finally {
      setLoading(false);
      setDialogOpen(false);
    }
  };
  

  if (!initialData) {
    return (
      <div className="space-y-4">
        <Heading
          title="Loading Settings..."
          description="Please wait while we fetch your store data."
        />
        <Separator />
        <div className="grid gap-4">
          <div className="h-6 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading
          title={`Settings for ${initialData.name}`}
          description="Manage your store settings"
        />
        <Button
          variant="destructive"
          size="icon"
          onClick={() => setDialogOpen(true)}
          disabled={loading}
        >
          <Trash className="h-4 w-4" />
        </Button>
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
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Form>
      <Separator/> 
    
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this store? This action cannot be undone.</p>
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
      <ApiAlert
       title="NEXT_PUBLIC_API_URL" 
        description={`${origin}/api/${params.storeId}`} 
        variant="public"
      />
    </div>
  );
};
