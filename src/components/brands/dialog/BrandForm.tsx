import * as z from 'zod';

// file path: src/components/brands/dialog/BrandForm.tsx
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const brandFormSchema = z.object({
  name: z.string().min(2, 'Brand name must be at least 2 characters'),
  website: z.string().url().optional(),
  description: z.string().optional()
});

type BrandFormData = z.infer<typeof brandFormSchema>;

interface BrandFormProps {
  initialValues?: Partial<BrandFormData>;
  onSubmit: (data: BrandFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function BrandForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false
}: BrandFormProps) {
  const form = useForm<BrandFormData>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: initialValues || {
      name: '',
      website: '',
      description: ''
    }
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Brand Name
        </label>
        <input
          type="text"
          id="name"
          {...form.register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          placeholder="Enter brand name"
          disabled={isSubmitting}
        />
        {form.formState.errors.name && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="website"
          className="block text-sm font-medium text-gray-700"
        >
          Website (optional)
        </label>
        <input
          type="url"
          id="website"
          {...form.register('website')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          placeholder="https://example.com"
          disabled={isSubmitting}
        />
        {form.formState.errors.website && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.website.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description (optional)
        </label>
        <textarea
          id="description"
          {...form.register('description')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          placeholder="Enter brand description"
          disabled={isSubmitting}
        />
        {form.formState.errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-green-600 hover:bg-green-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Brand'}
        </Button>
      </div>
    </form>
  );
}