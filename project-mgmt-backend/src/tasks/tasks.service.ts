import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create(createTaskDto);
    return this.tasksRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find({
      relations: ['project', 'assignee', 'comments'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['project', 'assignee', 'comments', 'comments.author'],
    });

    if (!task) {
      throw new NotFoundException(`Task #${id} not found`);
    }

    return task;
  }

  async findByProject(projectId: number): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { projectId },
      relations: ['assignee', 'comments'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByAssignee(assigneeId: number): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { assigneeId },
      relations: ['project', 'comments'],
      order: { dueDate: 'ASC' },
    });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, updateTaskDto);
    return this.tasksRepository.save(task);
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await this.tasksRepository.remove(task);
  }
}
