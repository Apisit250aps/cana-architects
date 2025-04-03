import { connectDB } from "@/lib/database";
import { Project } from "@/models/projects";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
  try {
    // Connect to database
    await connectDB();
    
    console.log('Starting migration: Adding displayOrder to existing projects', req);
    
    // Get all projects sorted by createdAt (oldest first)
    const projects = await Project.find({})
      .sort({ createdAt: 1 })
      .select('_id title');
    
    console.log(`Found ${projects.length} projects to update`);
    
    // Update each project with a displayOrder
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      await Project.findByIdAndUpdate(
        project._id,
        { displayOrder: i }
      );
      console.log(`Updated project: ${project.title} (${i+1}/${projects.length})`);
    }
    
    console.log('Migration completed successfully');
    return NextResponse.json({})
  } catch (error) {
    console.error('Migration failed:', error);
  } 
}