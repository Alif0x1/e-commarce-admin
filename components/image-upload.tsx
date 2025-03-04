/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'


import { useEffect, useState } from 'react'

import { ImagePlus, Trash } from 'lucide-react'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'

import { Button } from '@/components/ui/button'

interface ImageUploadProps {
  disabled?: boolean
  onChange: (value: string) => void
  onRemove: (value: string) => void
  value: string[]
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const onUpload = (result: any) => {
    onChange(result.info.secure_url)
    
  }

  if (!isMounted) {
    return null
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>

            <Image fill className="object-cover"   sizes="(max-width: 768px) 100vw, 200px" alt="Image"  src={url} />
          </div>
        ))}
      </div>

      <CldUploadWidget 
      
      onSuccess={onUpload}
      uploadPreset="firstcms">
        {({ open }) => {
          const onClick = () => {
            open()
          }

          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload an Image
            </Button>
          )
        }}
      </CldUploadWidget>
    </div>
  )
}

export default ImageUpload











































// import { useState, useEffect } from 'react';
// import { ImagePlus, Trash, Loader } from 'lucide-react';
// import { CldUploadWidget } from 'next-cloudinary';
// import Image from 'next/image';

// import { Button } from '@/components/ui/button';

// interface ImageUploadProps {
//     disabled?: boolean;
//     onChange: (value: string[]) => void; // Now accepts an array of URLs
//     onRemove: (value: string) => void;
//     value: string[];
// }

// const ImageUpload: React.FC<ImageUploadProps> = ({
//     disabled,
//     onChange,
//     onRemove,
//     value,
// }) => {
//     const [isMounted, setIsMounted] = useState(false);
//     const [loading, setLoading] = useState(false); // Loading state for image upload
//     const [uploadError, setUploadError] = useState<string | null>(null); // Error message for upload failures

//     useEffect(() => {
//         setIsMounted(true);
//     }, []);

//     const onUpload = (result: any) => {
//         if (result?.info?.secure_url) {
//             onChange([...value, result.info.secure_url]); // Adds new image URL to the existing list of URLs
//             setUploadError(null); // Reset error on successful upload
//         } else {
//             setUploadError('Upload failed. Please try again.'); // Handle failed upload
//         }
//         setLoading(false);
//     };

//     const handleRemove = (url: string) => {
//         onRemove(url); // Removes specific image URL
//     };

//     const handleUploadClick = () => {
//         setLoading(true); // Set loading state when uploading
//         setUploadError(null); // Reset any previous error
//     };

//     if (!isMounted) {
//         return null;
//     }

//     return (
//         <div>
//             <div className="mb-4 flex items-center gap-4">
//                 {value.map((url) => (
//                     <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
//                         <div className="z-10 absolute top-2 right-2">
//                             <Button
//                                 type="button"
//                                 onClick={() => handleRemove(url)}
//                                 variant="destructive"
//                                 size="icon"
//                             >
//                                 <Trash className="w-4 h-4" />
//                             </Button>
//                         </div>
//                         <Image
//                             fill
//                             className="object-cover"
//                             sizes="(max-width: 768px) 100vw, 200px"
//                             alt="Uploaded Image"
//                             src={url}
//                         />
//                     </div>
//                 ))}
//             </div>

//             {/* Display upload error if any */}
//             {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}

//             {/* Upload Button */}
//             <CldUploadWidget onSuccess={onUpload} uploadPreset="firstcms">
//                 {({ open }) => {
//                     return (
//                         <Button
//                             type="button"
//                             disabled={disabled || loading} // Disable the button if uploading
//                             variant="secondary"
//                             onClick={() => {
//                                 handleUploadClick();
//                                 open();
//                             }}
//                         >
//                             {loading ? (
//                                 <Loader className="w-4 h-4 animate-spin mr-2" />
//                             ) : (
//                                 <ImagePlus className="h-4 w-4 mr-2" />
//                             )}
//                             Upload Image
//                         </Button>
//                     );
//                 }}
//             </CldUploadWidget>
//         </div>
//     );
// };

// export default ImageUpload;

// <ImageUpload
//     value={field.value ? field.value : []} // value prop: array of image URLs
//     disabled={loading} // disabled state: disables the upload button when loading is true
//     onChange={(urls) => field.onChange(urls)} // onChange: callback to update the form with the new list of URLs
//     onRemove={(url) => {
//         const newUrls = field.value.filter((item: string) => item !== url); // onRemove: removes specific URL from the list
//         field.onChange(newUrls);
//     }} // onRemove: callback to remove a specific image
// />