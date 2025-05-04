import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { UserByIdPipe } from '../../user-by-id/user-by-id.pipe';
import { User } from '../../user/domain/user';
import { AbstractAuthService } from '../../auth/domain/abstract-auth.service';
import { TaskServiceInterface } from '../domain/task.service.interface';
import { Task } from '../domain/task';
import { TaskUpdateDto } from './dto/task-update-dto';
import { TaskGetFromUserDto } from './dto/task-get-from-user-dto';
import { TaskAdapter } from '../infra/task-adapter';
import { TaskCreateDTO } from './dto/task-create-dto';
import { ApiBearerAuth, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { TaskJSON } from '../infra/task-JSON';
import { TaskListResponseDto } from './dto/task-list-response-dto';

@ApiBearerAuth('Authorization')
@Controller('tasks')
export class TaskController {
  public constructor(
    @Inject(AbstractAuthService)
    private readonly authService: AbstractAuthService,
    @Inject(TaskServiceInterface)
    private readonly taskService: TaskServiceInterface,
  ) {
    // Constructor logic if needed
  }

  @Get('/')
  @ApiBearerAuth('Authorization')
  @ApiOkResponse({
    description: 'The record has been successfully retrieved.',
    type: TaskListResponseDto,
  })
  async getCurrentUserTasks(
    @Headers('Authorization') authorization: string,
    @Query() query: TaskGetFromUserDto,
  ) {
    const requestUser = await this.authService.getUserFromHeader(authorization);
    if (!requestUser) {
      throw new UnauthorizedException('User not found');
    }

    return this.getTasksByUser(requestUser, authorization, query);
  }

  /**
   * TODO: Add pagination
   * @param user
   * @param authorization
   * @returns
   */
  @ApiParam({ name: 'user', type: String })
  @Get('/users/:user')
  @ApiOkResponse({
    description: 'The record has been successfully retrieved.',
    type: TaskListResponseDto,
  })
  async getTasksByUser(
    @Param('user', UserByIdPipe) user: User,
    @Headers('Authorization') authorization: string,
    @Query() query: TaskGetFromUserDto,
  ) {
    const requestUser = await this.authService.getUserFromHeader(authorization);

    if (!requestUser || !user.id) {
      throw new UnauthorizedException('User not found');
    }

    if (!requestUser.canViewTasks(user)) {
      throw new UnauthorizedException('User cannot view tasks for this user');
    }

    const tasks = query.range
      ? await this.taskService.findByUserAndDate(
          user.id || '',
          query.range.startDate,
          query.range.endDate,
        )
      : await this.taskService.findByUser(user.id);

    return {
      tasks: tasks.map((task) => TaskAdapter.fromDomain(task).toJson()),
    };
  }

  @Get('/:task')
  @ApiOkResponse({
    description: 'The record has been successfully retrieved.',
    type: TaskJSON,
  })
  async getTask(
    @Param('task') taskId: string,
    @Headers('Authorization') authorization: string,
  ) {
    const [requestUser, task] = await Promise.all([
      this.authService.getUserFromHeader(authorization),
      this.taskService.findById(taskId),
    ]);

    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (!requestUser) {
      throw new NotFoundException('User not found');
    }

    if (!task.canBeViewed(requestUser)) {
      throw new UnauthorizedException('User cannot view this task');
    }

    return TaskAdapter.fromDomain(task).toJson();
  }

  @Post('/')
  async createTask(
    @Body() taskCreateDTO: TaskCreateDTO,
    @Headers('Authorization') authorization: string,
  ) {
    const requestUser = await this.authService.getUserFromHeader(authorization);

    if (!requestUser) {
      throw new UnauthorizedException('User not found');
    }

    taskCreateDTO.userId = requestUser.id || '';

    const task = await this.taskService.save(Task.create(taskCreateDTO));

    return TaskAdapter.fromDomain(task).toJson();
  }

  @ApiOkResponse({
    description: 'The record has been successfully updated.',
    type: TaskJSON,
  })
  @Put('/:task')
  async updateTask(
    @Param('task') taskId: string,
    @Body() taskUpdateDTO: TaskUpdateDto,
    @Headers('Authorization') authorization: string,
  ) {
    const awaitedServices = await Promise.all([
      this.authService.getUserFromHeader(authorization),
      this.taskService.findById(taskId),
    ]);

    const requestUser = awaitedServices[0];
    let task = awaitedServices[1];

    if (!requestUser) {
      throw new NotFoundException('User not found');
    }

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (!task.canBeUpdated(requestUser)) {
      throw new UnauthorizedException('User cannot edit this task');
    }

    task.update(taskUpdateDTO);

    task = await this.taskService.save(task);

    return TaskAdapter.fromDomain(task).toJson();
  }

  @Delete('/:task')
  async deleteTask(
    @Param('task') taskId: string,
    @Headers('Authorization') authorization: string,
  ) {
    const [requestUser, task] = await Promise.all([
      this.authService.getUserFromHeader(authorization),
      this.taskService.findById(taskId),
    ]);

    if (!requestUser) {
      throw new NotFoundException('User not found');
    }

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (!task.canBeDeleted(requestUser)) {
      throw new UnauthorizedException('User cannot delete this task');
    }

    return await this.taskService.delete(taskId);
  }
}
