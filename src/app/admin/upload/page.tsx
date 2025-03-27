'use client'
import React, { useState, useCallback } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import DraggableImage from '../components/DraggableImage';
import TagInput from '../components/TagInput';




type ProjectCategory = 'exterior' | 'interior' | 'product';

interface ImageItem {
  id: string;
  src: string;
  file: File;
}

interface ProjectDetails {
  title: string;
  location: string;
  type: string;
  category: ProjectCategory;
  program: string;
  client: string;
  siteArea: string;
  builtArea: string;
  design: string;
  completion: string;
  description: string;
  tags: string[];
}

interface Toast {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
}

const AdminUploadPage = () => {
  const router = useRouter()
  
  // State for project details
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
    title: '',
    location: '',
    type: '',
    category: 'exterior',
    program: '',
    client: '',
    siteArea: '',
    builtArea: '',
    design: '',
    completion: '',
    description: '',
    tags: []
  })

  // State for images
  const [coverImage, setCoverImage] = useState<ImageItem | null>(null)
  const [projectImages, setProjectImages] = useState<ImageItem[]>([])
  
  // State for loading and errors
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<Toast>({
    message: '',
    type: 'success',
    visible: false
  })

  // Handle input changes for project details
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setProjectDetails((prev) => ({ ...prev, [name]: value }))
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle cover image upload
  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      showToast('Invalid file type. Please use JPG, PNG or WebP format.', 'error')
      return
    }

    // Validate file size (5MB max)
    const maxSize = 64 * 1024 * 1024
    if (file.size > maxSize) {
      showToast('File too large. Maximum size is 5MB.', 'error')
      return
    }

    const imageUrl = URL.createObjectURL(file)
    setCoverImage({
      id: 'cover',
      src: imageUrl,
      file
    })
    
    // Clear error if it exists
    if (errors.coverImage) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.coverImage
        return newErrors
      })
    }
  }

  // Handle project images upload
  const handleProjectImagesUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files
    if (!files) return

    // Validate files
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    const maxSize = 64 * 1024 * 1024
    const invalidFiles: string[] = []

    const validFiles = Array.from(files).filter(file => {
      if (!validTypes.includes(file.type)) {
        invalidFiles.push(`${file.name}: Invalid file type`)
        return false
      }
      if (file.size > maxSize) {
        invalidFiles.push(`${file.name}: File too large (max 5MB)`)
        return false
      }
      return true
    })

    if (invalidFiles.length > 0) {
      showToast(`Some files were not added: ${invalidFiles.join(', ')}`, 'error')
    }

    const newImages: ImageItem[] = validFiles.map((file) => ({
      id: `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      src: URL.createObjectURL(file),
      file
    }))

    setProjectImages((prev) => [...prev, ...newImages])
  }

  // Move image (reorder)
  const moveImage = useCallback((dragIndex: number, hoverIndex: number) => {
    setProjectImages(prevImages => {
      const dragImage = prevImages[dragIndex]
      const newImages = [...prevImages]
      newImages.splice(dragIndex, 1)
      newImages.splice(hoverIndex, 0, dragImage)
      return newImages
    })
  }, [])

  // Remove image
  const removeImage = useCallback((id: string) => {
    setProjectImages(prev => prev.filter(image => image.id !== id))
  }, [])

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, visible: true })
    
    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }))
    }, 5000)
  }

  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    // Required fields
    if (!projectDetails.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (!projectDetails.location.trim()) {
      newErrors.location = 'Location is required'
    }
    
    if (!projectDetails.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    if (!coverImage) {
      newErrors.coverImage = 'Cover image is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle basic info submission
  const handleSubmitBasicInfo = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      // Create FormData object
      const formData = new FormData()

      // Add project details
      Object.entries(projectDetails).forEach(([key, value]) => {
        if (key === 'tags' && Array.isArray(value)) {
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, String(value))
        }
      })

      // Add cover image
      if (coverImage) {
        formData.append('coverImage', coverImage.file)
      }

      // Submit form data to API (only basic info and cover image)
      const response = await fetch('/api/project', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create project');
      }

      const data = await response.json();
      
      // Save the project ID for gallery uploads
      setProjectId(data.project._id);
      
      showToast('Project details saved! Now uploading gallery images...', 'success')
      
      // Upload gallery images
      if (projectImages.length > 0) {
        await uploadGalleryImages(data.project._id);
      } else {
        showToast('Project created successfully! No gallery images to upload.', 'success')
        
        // Redirect to project page
        setTimeout(() => {
          if (data.project.slug) {
            router.push(`/project/${data.project.slug}`)
          }
        }, 2000)
      }
      
    } catch (error) {
      console.error('Error submitting form:', error)
      showToast(
        error instanceof Error ? error.message : 'Failed to create project. Please try again.',
        'error'
      )
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Upload gallery images
  const uploadGalleryImages = async (projectId: string) => {
    setIsUploading(true)
    setUploadProgress(0)
    
    const totalImages = projectImages.length;
    let uploadedCount = 0;
    
    try {
      // Upload each image individually and update progress
      for (const image of projectImages) {
        const formData = new FormData();
        formData.append('projectId', projectId);
        formData.append('galleryImage', image.file);
        
        const response = await fetch('/api/project/gallery', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to upload gallery image');
        }
        
        uploadedCount++;
        setUploadProgress(Math.round((uploadedCount / totalImages) * 100));
      }
      
      showToast('All gallery images uploaded successfully!', 'success');
      
      // Redirect to project page
      setTimeout(() => {
        router.push(`/admin/project/${projectId}`);
      }, 2000);
      
    } catch (error) {
      console.error('Error uploading gallery images:', error);
      showToast(
        error instanceof Error ? error.message : 'Failed to upload some gallery images. Please try again.',
        'error'
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {/* Toast notification */}
      {toast.visible && (
        <div className="toast toast-top toast-end z-50">
          <div className={`alert alert-${toast.type}`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <div className="card-title">Create New Project</div>
          
          {projectId ? (
            <div className="card bg-base-100 shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Uploading Gallery Images</h2>
              
              {isUploading ? (
                <div className="space-y-4">
                  <progress 
                    className="progress progress-primary w-full" 
                    value={uploadProgress} 
                    max="100"
                  ></progress>
                  <p className="text-center">
                    Uploading images: {uploadProgress}% complete
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="mb-4">All uploads complete!</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => router.push(`/projects/${projectId}`)}
                  >
                    View Project
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmitBasicInfo} className="space-y-8">
              {/* Cover Image Section */}
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <h2 className="card-title">Cover Image</h2>
                  <p className="text-sm opacity-70">Main image displayed on the home page</p>

                  <div className="form-control w-full mb-4">
                    <label className="label">
                      <span className="label-text">Select Image</span>
                      <span className="label-text-alt text-error">*Required</span>
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleCoverImageUpload}
                      className={`file-input file-input-bordered w-full ${errors.coverImage ? 'input-error' : ''}`}
                      required={!coverImage}
                    />
                    {errors.coverImage && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.coverImage}</span>
                      </label>
                    )}
                  </div>

                  {coverImage && (
                    <div className="relative w-64 h-48 border rounded-lg">
                      <Image
                        src={coverImage.src}
                        alt="Cover preview"
                        width={256}
                        height={192}
                        className="object-cover w-full h-full rounded-lg"
                      />
                      <button
                        type="button"
                        className="btn btn-error btn-circle btn-xs absolute top-2 right-2"
                        onClick={() => setCoverImage(null)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {/* Project Images Section */}
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <h2 className="card-title">Gallery Images</h2>
                  <p className="text-sm opacity-70">
                    Images displayed on the project detail page{' '}
                    <span className="text-info">* Will be uploaded after saving basic info</span>
                  </p>

                  <div className="form-control w-full mb-6">
                    <label className="label">
                      <span className="label-text">Select Images</span>
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handleProjectImagesUpload}
                      className="file-input file-input-bordered w-full"
                    />
                  </div>

                  {projectImages.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">
                        Preview & Arrange Images ({projectImages.length} selected)
                      </h3>
                      <p className="text-sm opacity-70 mb-4">
                        Drag images to reorder them. The order will be preserved
                        when displaying.
                      </p>

                      <div className="flex flex-wrap">
                        {projectImages.map((image, index) => (
                          <DraggableImage
                            key={image.id}
                            image={image}
                            index={index}
                            moveImage={moveImage}
                            removeImage={removeImage}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Project Details Section */}
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <h2 className="card-title">Project Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Title</span>
                        <span className="label-text-alt text-error">*Required</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={projectDetails.title}
                        onChange={handleInputChange}
                        className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
                        required
                      />
                      {errors.title && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.title}</span>
                        </label>
                      )}
                    </div>

                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Location</span>
                        <span className="label-text-alt text-error">*Required</span>
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={projectDetails.location}
                        onChange={handleInputChange}
                        className={`input input-bordered w-full ${errors.location ? 'input-error' : ''}`}
                        required
                      />
                      {errors.location && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.location}</span>
                        </label>
                      )}
                    </div>

                    {/* Other fields */}
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Type</span>
                      </label>
                      <input
                        type="text"
                        name="type"
                        value={projectDetails.type}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                        placeholder="e.g. Residential, Commercial"
                      />
                    </div>

                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Program</span>
                      </label>
                      <input
                        type="text"
                        name="program"
                        value={projectDetails.program}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                        placeholder="e.g. Single Family Home"
                      />
                    </div>

                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Client</span>
                      </label>
                      <input
                        type="text"
                        name="client"
                        value={projectDetails.client}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Site Area</span>
                      </label>
                      <input
                        type="text"
                        name="siteArea"
                        value={projectDetails.siteArea}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                        placeholder="e.g. 500 sq.m."
                      />
                    </div>

                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Built Area</span>
                      </label>
                      <input
                        type="text"
                        name="builtArea"
                        value={projectDetails.builtArea}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                        placeholder="e.g. 300 sq.m."
                      />
                    </div>
                    
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Design Year</span>
                      </label>
                      <input
                        type="text"
                        name="design"
                        value={projectDetails.design}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                        placeholder="e.g. 2023"
                      />
                    </div>
                    
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Completion Year</span>
                      </label>
                      <input
                        type="text"
                        name="completion"
                        value={projectDetails.completion}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                        placeholder="e.g. 2024"
                      />
                    </div>

                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Category</span>
                      </label>
                      <select
                        name="category"
                        className="select select-bordered w-full"
                        value={projectDetails.category}
                        onChange={(e) =>
                          setProjectDetails({
                            ...projectDetails,
                            category: e.target.value as ProjectCategory
                          })
                        }
                      >
                        <option value="exterior">Exterior</option>
                        <option value="interior">Interior</option>
                        <option value="product">Product</option>
                      </select>
                    </div>
                    
                    <TagInput 
                      value={projectDetails.tags} 
                      onChange={(tags) => 
                        setProjectDetails(prev => ({ ...prev, tags }))
                      } 
                    />
                  </div>
                  
                  <div className="mt-6">
                    <label className="label">
                      <span className="label-text">Description</span>
                      <span className="label-text-alt text-error">*Required</span>
                    </label>
                    <textarea
                      className={`textarea textarea-bordered h-32 w-full ${errors.description ? 'textarea-error' : ''}`}
                      placeholder="Project description..."
                      name="description"
                      value={projectDetails.description}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                    {errors.description && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.description}</span>
                      </label>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <button 
                  type="button" 
                  className="btn btn-ghost" 
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-xs mr-2"></span>
                      Saving Basic Info...
                    </>
                  ) : 'Save Basic Info & Continue'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DndProvider>
  )
}

export default AdminUploadPage