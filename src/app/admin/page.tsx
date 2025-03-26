import { connectDB } from '@/lib/database'
import { Project } from '@/models/projects'
import Image from 'next/image'
export default async function AdminProject() {
  // Connect to database
  await connectDB()

  // Fetch all projects
  const projects = await Project.find()
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Projects</h5>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>Project</th>
                <th>Detail</th>
                <th>Client</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {projects.map((project, index) => (
                <tr key={index}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <Image
                            src={project.coverImage}
                            alt="Avatar Tailwind CSS Component"
                            width={64}
                            height={64}
                          />
                        </div>
                      </div>
                      <div>
                        <a href={`/admin/project/${project._id}`} className="font-bold">{project.title}</a>
                        <div className="text-sm opacity-50">
                          {project.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {project.type}
                    <br />
                    <span className="badge badge-ghost badge-sm">
                      {project.category}
                    </span>
                  </td>
                  <td>{project.client}</td>
                  <th>
                    <button className="btn btn-ghost btn-xs">details</button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
