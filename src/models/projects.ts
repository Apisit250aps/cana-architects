import { Document, model, models, ObjectId, Schema } from 'mongoose'
import slugify from 'slugify'

export type ProjectCategory = 'interior' | 'exterior' | 'product'

export interface IProject extends Document {
  _id: ObjectId
  title: string
  slug: string
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
  coverImage: string
  galleryImages: string[]
  createdAt: Date
  updatedAt: Date
}

const projectSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    type: { type: String, required: true },
    category: { type: String, enum: ['interior', 'exterior', 'product'] },
    program: { type: String, required: true },
    client: { type: String, required: true },
    siteArea: { type: String, required: true },
    builtArea: { type: String, required: true },
    design: { type: String, required: true },
    completion: { type: String, required: true },
    description: { type: String, required: true },
    tags: { type: [String], required: true },
    coverImage: { type: String, required: true },
    galleryImages: { type: [String], required: true }
  },
  { timestamps: true }
)

projectSchema.pre<IProject>('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, {
      lower: true, // ทำให้เป็นตัวพิมพ์เล็กทั้งหมด
      strict: true, // ลบอักขระพิเศษออก
      replacement: '-' // แทนที่ช่องว่างด้วย "-"
    })
  }
  next()
})

export const Project = models.projects || model<IProject>('projects', projectSchema)