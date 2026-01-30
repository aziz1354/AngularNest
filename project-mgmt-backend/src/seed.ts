import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { ProjectsService } from './projects/projects.service';
import { TasksService } from './tasks/tasks.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const usersService = app.get(UsersService);
  const projectsService = app.get(ProjectsService);
  const tasksService = app.get(TasksService);

  // Create users
  const user1 = await usersService.create({
    email: 'admin@test.com',
    name: 'Admin User',
    password: 'password123',
    role: 'admin'
  });

  const user2 = await usersService.create({
    email: 'dev@test.com',
    name: 'Developer User',
    password: 'password123',
    role: 'developer'
  });

  // Create projects - Use STRING dates
  const project1 = await projectsService.create({
    name: 'E-commerce Platform',
    description: 'Build a modern e-commerce platform with React and Node.js',
    status: 'active',
    progress: 65,
    ownerId: user1.id,
    startDate: '2024-01-01',  // ✅ String format
    endDate: '2024-06-30',    // ✅ String format
  });

  const project2 = await projectsService.create({
    name: 'Mobile App Development',
    description: 'Create a mobile app for iOS and Android',
    status: 'active',
    progress: 30,
    ownerId: user1.id,
    startDate: '2024-02-01',  // ✅ String format
  });

  // Create tasks - Use STRING dates
  await tasksService.create({
    title: 'Setup database schema',
    description: 'Design and implement the database schema for the project',
    status: 'done',
    priority: 'high',
    projectId: project1.id,
    assigneeId: user2.id,
    estimatedHours: 8,
  });

  await tasksService.create({
    title: 'Implement user authentication',
    description: 'Add login and registration functionality',
    status: 'in-progress',
    priority: 'high',
    projectId: project1.id,
    assigneeId: user2.id,
    estimatedHours: 16,
    dueDate: '2024-12-31',  // ✅ String format
  });

  await tasksService.create({
    title: 'Create product catalog',
    description: 'Build the product listing and detail pages',
    status: 'todo',
    priority: 'medium',
    projectId: project1.id,
    estimatedHours: 24,
  });

  console.log('✅ Seed data created successfully!');
  console.log('📧 Login with: admin@test.com / password123');
  await app.close();
}

seed().catch(error => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});