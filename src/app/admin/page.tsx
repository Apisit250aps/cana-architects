'use client'
import React, { useState, useRef, useCallback } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Image from 'next/image'
import axios from 'axios'
import { useRouter } from 'next/navigation'

// Type definitions
type ProjectCategory = 'interior' | 'exterior' | 'product'

type ProjectDetails = {
  title: string
  location: string
  type: string
  category: ProjectCategory
  program: string
  client: string
  siteArea: string
  builtArea: string
  design: string
  completion: string
  description: string
  tags: string[]
}

type ImageItem = {
  id: string
  src: string
  file: File
}

type Toast = {
  message: string
  type: 'success' | 'error'
  visible: boolean
}

// Draggable Image Component
const DraggableImage = ({
  image,
  index,
  moveImage,
  removeImage
}: {
  image: ImageItem
  index: number
  moveImage: (dragIndex: number, hoverIndex: number) => void
  removeImage: (id: string) => void
}) => {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: 'IMAGE',
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  })

  const [, drop] = useDrop({
    accept: 'IMAGE',
    hover: (item: { index: number }, monitor) => {
      console.log(monitor)
      if (!ref.current) return
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) return
      moveImage(dragIndex, hoverIndex)
      item.index = hoverIndex
    }
  })

  drag(drop(ref))

  return (
    <div
      ref={ref}
      className={`relative group w-48 h-48 border rounded-lg m-2 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <Image
        src={image.src}
        alt="Project image"
        width={192}
        height={192}
        className="object-cover w-full h-full rounded-lg"
      />
      <button
        type="button"
        className="btn btn-error btn-circle btn-xs absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => removeImage(image.id)}
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
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-base-300 bg-opacity-70 text-base-content text-xs">
        Drag to reorder
      </div>
    </div>
  )
}

// Tag Input Component
const TagInput = ({ 
  value, 
  onChange 
}: { 
  value: string[]
  onChange: (tags: string[]) => void 
}) => {
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      if (inputValue.trim()) {
        const newTag = inputValue.trim()
        if (!value.includes(newTag)) {
          onChange([...value, newTag])
        }
        setInputValue('')
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  const removeTag = (index: number) => {
    const newTags = [...value]
    newTags.splice(index, 1)
    onChange(newTags)
  }

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">Tags</span>
      </label>
      <div className="flex flex-wrap items-center gap-2 p-2 border rounded-lg">
        {value.map((tag, index) => (
          <div key={index} className="badge badge-primary badge-outline gap-1">
            {tag}
            <button type="button" onClick={() => removeTag(index)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
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
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-[100px] outline-none bg-transparent"
          placeholder={value.length === 0 ? "Type and press Enter to add tags" : ""}
        />
      </div>
    </div>
  )
}

// Main Admin Upload Component
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
    const maxSize = 5 * 1024 * 1024
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
    const maxSize = 5 * 1024 * 1024
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
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

      // Add project images
      projectImages.forEach((image, index) => {
        formData.append(`projectImage-${index}`, image.file)
      })

      // Submit form data to API
      const response = await axios.post('/api/projects', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      // Handle successful response
      showToast('Project created successfully!', 'success')
      
      // Redirect to project page or clear form
      setTimeout(() => {
        if (response.data?.project?.slug) {
          router.push(`/projects/${response.data.project.slug}`)
        } else {
          // Reset form
          setProjectDetails({
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
          setCoverImage(null)
          setProjectImages([])
        }
      }, 2000)
      
    } catch (error) {
      console.error('Error submitting form:', error)
      
      if (axios.isAxiosError(error) && error.response) {
        // Handle API error response
        showToast(
          error.response.data?.error || 'Failed to create project. Please try again.',
          'error'
        )
      } else {
        // Handle network errors
        showToast('Network error. Please check your connection and try again.', 'error')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

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
          <form onSubmit={handleSubmit} className="space-y-8">
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
                  <span className="text-info">* Multiple uploads supported</span>
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
                      Preview & Arrange Images
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
                    Saving...
                  </>
                ) : 'Save Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DndProvider>
  )
}

export default AdminUploadPage