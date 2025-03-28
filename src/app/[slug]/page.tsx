import { connectDB } from '@/lib/database'
import { Project } from '@/models/projects'

import ClientSideCarousel from './components/ClientSideCarousel'
import Footer from '@/components/navigate/Footer'
import ProtectedGallery from '@/components/gallery/ProtectedGallery'

import { Metadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
}

// ฟังก์ชันสร้าง Metadata ตาม slug
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  await connectDB()
  const project = await Project.findOne({ slug })
  const title = `Cana Architects — ${project.title}`
  const keywords = [
    'architecture',
    'design',
    'cana architects',
    'interior design',
    'residential',
    'commercial',
    ...project.tags
  ]
  const description = project.description
  const url = `https://canaarchitects.com/${slug}`
  const image = `https://canaarchitects.com/${project.coverImage}`

  return {
    title,
    description,
    keywords,
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      images: [{ url: image }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image]
    }
  }
}

export default async function ProjectDetail({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  await connectDB()
  const { slug } = await params
  const project = await Project.findOne({ slug })

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-center text-2xl font-bold">Project not found</h1>
      </div>
    )
  }

  const images = [project.coverImage, ...(project.galleryImages || [])]

  return (
    <>
      <div className="container mx-auto pt-7 px-0 lg:px-0 max-w-screen-xl">
        {/* Flicking Carousel */}
        <div className="relative mb-7 px-0 lg:px-15">
          <ClientSideCarousel
            images={images.slice(0, 10)}
            title={project.title}
          />
        </div>

        {/* Project Info */}
        <div className="max-w-2xl mx-auto">
          {/* Tags */}
          {/* <div className="flex flex-wrap gap-2 justify-center">
            {project.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="badge badge-neutral px-4 py-3 rounded"
              >
                {tag}
              </span>
            ))}
          </div> */}
          {/* Project Details */}
          <div className="space-y-8 pt-5">
            <div className="flex flex-col items-center">
              <p className="font-medium text-sm">
                Location: {project.location}
              </p>
              <p className="font-medium text-sm">Type: {project.type}</p>
              <p className="font-medium text-sm">Program: {project.program}</p>
              <p className="font-medium text-sm">Client: {project.client}</p>
              {/* <p className="font-medium">Location : {project.location}</p> */}
              {/* <br /> */}
              <p className="font-medium text-sm mt-4">
                Site Area: {project.siteArea}
              </p>
              <p className="font-medium text-sm">
                Build Area: {project.builtArea}
              </p>
              <p className="font-medium text-sm">Design: {project.design}</p>
              <p className="font-medium text-sm">
                Completion: {project.completion}
              </p>
            </div>

            {/* Description */}
            <div className="px-5 lg:px-0">
              <p className="leading-relaxed whitespace-pre-wrap font-light text-sm">
                {project.description}
              </p>
            </div>
          </div>
        </div>
      </div>
      <ProtectedGallery images={images} title={project.title} />
      <a
        href={'/'}
        className="fixed bottom-4 right-4 bg-white text-black btn btn-circle btn-md p-6 rounded-full transition"
      >
        <i className="bx bx-home bx-sm"></i>
      </a>
      <Footer />
    </>
  )
}
