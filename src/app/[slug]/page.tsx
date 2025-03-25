import { connectDB } from "@/lib/database";
import { Project } from "@/models/projects";
import Image from "next/image";
export default async function ProjectDetail({ params }: { params: { slug: string } }) {
  await connectDB()
  const project = await Project.findOne({ slug: params.slug })
  return (
    <>
      <h1>{project.title}</h1>
      <Image src={project.coverImage} alt={""} fill/>
    </>
  )
}
