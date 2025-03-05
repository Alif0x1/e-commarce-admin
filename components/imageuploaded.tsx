/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { ImagePlus, Trash, Loader } from 'lucide-react';
// @ts-ignore
import { CldUploadWidget,CldUploadWidgetResult } from 'next-cloudinary'; // Ensure to import correct types
import Image from 'next/image';

import { Button } from '@/components/ui/button';

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string[]) => void; // Now accepts an array of URLs
    onRemove: (value: string) => void;
    value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value,
}) => {
    const [isMounted, setIsMounted] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state for image upload
    const [uploadError, setUploadError] = useState<string | null>(null); // Error message for upload failures
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]); // State to track uploaded URLs

    useEffect(() => {
        setIsMounted(true);
    }, []);
 {/* @ts-ignore */}
    const onUpload = (result: CldUploadWidgetResult) => {
    
    

    const uploadedUrls: string[] = result?.info?.files?.map((file:any) => file.uploadInfo.secure_url) || [];

    if (uploadedUrls.length > 0) {
        // Add the new image URLs to the existing value array
        const updatedUrls = [...value, ...uploadedUrls];
        onChange(updatedUrls); // Update the parent component with the new array of URLs
        setUploadedUrls(updatedUrls); // Update local state for uploaded URLs
    } else {
        setUploadError('Upload failed. Please try again.'); // Handle error if no URL is returned
    }
};




    const handleRemove = (url: string) => {
        const updatedUrls = value.filter((item) => item !== url);
        onRemove(url); // Removes specific image URL
        setUploadedUrls(updatedUrls); // Update state with remaining URLs
        
        setLoading(false);
    };


    if (!isMounted) {
        return null;
    }

    return (
        <div>
            {/* Display uploaded images */}

            <div className="mb-4 flex items-center gap-4">
                {value.map((url, index) => (
                    <div key={`${url}-${index}`} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                        <div className="z-10 absolute top-2 right-2">
                            <Button
                                type="button"
                                onClick={() => handleRemove(url)}
                                variant="destructive"
                                size="icon"
                            >
                                <Trash className="w-4 h-4" />
                            </Button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 200px"
                            alt="Uploaded Image"
                            src={url}
                        />
                    </div>
                ))}
            </div>


            {/* Display upload error if any */}
            {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}

            {/* Upload Button */}
          
            <CldUploadWidget onQueuesEndAction={onUpload} uploadPreset="firstcms">
                {({ open }) => {
                    return (
                        <Button
                            type="button"
                            disabled={disabled || loading} // Disable the button if uploading
                            variant="secondary"
                            onClick={() => {
                                open(); // Make sure `open` is always callable
                            }}
                        >
                            {loading ? (
                                <Loader className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <ImagePlus className="h-4 w-4 mr-2" />
                            )}
                            
                              {value.length > 0 ? <p className=" text-sm mb-2">Update Images</p> : 'Upload Image'}
                        </Button>
                    );
                }}
            </CldUploadWidget>
        </div>
    );
};

export default ImageUpload;
