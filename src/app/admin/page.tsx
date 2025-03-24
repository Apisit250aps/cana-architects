'use client'
import React, { useState, useRef } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Image from 'next/image'

// Type definitions
type ProjectDetails = {
  title: string
  location: string
  type: string
  category: 'interior' | 'exterior' | 'product'
  program: string
  client: string
  siteArea: string
  builtArea: string
  design: string
  completion: string
  description: string
  tags: string
}

type ImageItem = {
  id: string
  src: string
  file: File
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

// Main Admin Upload Component
const AdminUploadPage = () => {
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
    tags: ''
  })

  // State for images
  const [coverImage, setCoverImage] = useState<ImageItem | null>(null)
  const [projectImages, setProjectImages] = useState<ImageItem[]>([])

  // Handle input changes for project details
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setProjectDetails((prev) => ({ ...prev, [name]: value }))
  }

  // Handle cover image upload
  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const imageUrl = URL.createObjectURL(file)
    setCoverImage({
      id: 'cover',
      src: imageUrl,
      file
    })
  }

  // Handle project images upload
  const handleProjectImagesUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files
    if (!files) return

    const newImages: ImageItem[] = Array.from(files).map((file) => ({
      id: `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      src: URL.createObjectURL(file),
      file
    }))

    setProjectImages((prev) => [...prev, ...newImages])
  }

  // Move image (reorder)
  const moveImage = (dragIndex: number, hoverIndex: number) => {
    const dragImage = projectImages[dragIndex]
    const newImages = [...projectImages]
    newImages.splice(dragIndex, 1)
    newImages.splice(hoverIndex, 0, dragImage)
    setProjectImages(newImages)
  }

  // Remove image
  const removeImage = (id: string) => {
    setProjectImages((prev) => prev.filter((image) => image.id !== id))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Here you would normally create a FormData object and send it to your API
    // This is just a placeholder for the actual implementation
    const formData = new FormData()

    // Add project details
    Object.entries(projectDetails).forEach(([key, value]) => {
      formData.append(key, value)
    })

    // Add cover image
    if (coverImage) {
      formData.append('coverImage', coverImage.file)
    }

    // Add project images
    projectImages.forEach((image, index) => {
      formData.append(`projectImage-${index}`, image.file)
    })

    // Submit form data (placeholder)
    console.log('Form data ready for submission:', formData)

    // Show toast notification instead of alert
    document.getElementById('success-toast')?.classList.remove('hidden')
    setTimeout(() => {
      document.getElementById('success-toast')?.classList.add('hidden')
    }, 3000)

    // In a real implementation, you would send the formData to your server
    // try {
    //   const response = await fetch('/api/projects', {
    //     method: 'POST',
    //     body: formData,
    //   });
    //   const data = await response.json();
    //   // Handle success
    // } catch (error) {
    //   // Handle error
    // }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      {/* Toast notification for success */}
      <div id="success-toast" className="toast toast-top toast-end hidden">
        <div className="alert alert-success">
          <span>Project uploaded successfully!</span>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="card-title"></div>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Cover Image Section */}
            <div className="card bg-base-100">
              <div className="card-body">
                <h2 className="card-title">ภาพหลัก</h2>
                <p className="text-sm opacity-70">ภาพที่จะแสดงตอนอยู่หน้าแรก</p>

                <div className="form-control w-full mb-4">
                  <label className="label">
                    <span className="label-text">เลือกภาพ</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageUpload}
                    className="file-input file-input-bordered w-full"
                    required={!coverImage}
                  />
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
            <div className="card bg-base-100">
              <div className="card-body">
                <h2 className="card-title">ภาพประกอบ</h2>
                <p className="text-sm opacity-70">
                  ภาพที่จะแสดงเมื่ออยู่หน้ารายละเอียด{' '}
                  <span className="text-error">* อัพโหลดได้หลายภาพ</span>
                </p>

                <div className="form-control w-full mb-6">
                  <label className="label">
                    <span className="label-text">เลือกภาพ</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
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
            <div className="card bg-base-100">
              <div className="card-body">
                <h2 className="card-title">Project Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Title</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={projectDetails.title}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Location</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={projectDetails.location}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      required
                    />
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
                    />
                  </div>
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Design</span>
                    </label>
                    <input
                      type="text"
                      name="design"
                      value={projectDetails.design}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                    />
                  </div>
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Completion</span>
                    </label>
                    <input
                      type="text"
                      name="completion"
                      value={projectDetails.completion}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Category</span>
                    </label>
                    <select
                      name="category"
                      className="select w-full"
                      onChange={(e) =>
                        setProjectDetails({
                          ...projectDetails,
                          category: e.target.value as
                            | 'interior'
                            | 'exterior'
                            | 'product'
                        })
                      }
                    >
                      <option value="exterior">Exterior</option>
                      <option value="interior">Interior</option>
                      <option value="product">Product</option>
                    </select>
                    {/* <input
                      type="text"
                      name="completion"
                      value={projectDetails.completion}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                    /> */}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Tags</span>
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={projectDetails.tags}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                    />
                  </div>
                  <fieldset className="fieldset w-full">
                    <legend className="fieldset-legend">Description</legend>
                    <textarea
                      className="textarea h-24 w-full"
                      placeholder="Description"
                      name="bio"
                      value={projectDetails.description}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </fieldset>
                </div>
              </div>
            </div>
            {/* Submit Button */}
            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary">
                Upload Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </DndProvider>
  )
}

export default AdminUploadPage
