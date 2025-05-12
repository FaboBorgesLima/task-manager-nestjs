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
  UseInterceptors,
} from '@nestjs/common';
import { AbstractAuthService } from '../../auth/domain/abstract-auth.service';
import { TaskServiceInterface } from '../domain/task.service.interface';
import { Task } from '../domain/task';
import { TaskUpdateDto } from './dto/task-update-dto';
import { TaskCreateDTO } from './dto/task-create-dto';
import { ApiBearerAuth, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { TaskResponseDto } from './dto/task-response-dto';
import { TaskListResponseDto } from './dto/task-list-response-dto';
import { TaskHttpAdapter } from '../domain/task.http.adapter';
import { DateRangeDto } from '../../types/app/date-range-dto';
import { UserServiceInterface } from '../../user/domain/user.service.interface';
import { TaskResponseInterceptor } from './interceptors/task-response.interceptor';
import { TaskListResponseInterceptor } from './interceptors/task-list-response.interceptor';
import { BigIntPipe } from '../../big-int/big-int.pipe';

@Controller('tasks')
@ApiBearerAuth()
export class TaskController implements TaskHttpAdapter {
  public constructor(
    @Inject(AbstractAuthService)
    private readonly authService: AbstractAuthService,
    @Inject(TaskServiceInterface)
    private readonly taskService: TaskServiceInterface,
    @Inject(UserServiceInterface)
    private readonly userService: UserServiceInterface,
  ) {
    // Constructor logic if needed0
  }

  @Get('/')
  @UseInterceptors(TaskListResponseInterceptor)
  @ApiOkResponse({
    description: 'The record has been successfully retrieved.',
    type: TaskListResponseDto,
  })
  async findFromCurrentUser(
    @Headers('Authorization') authorization: string,
    @Query() query: DateRangeDto,
  ) {
    const requestUser = await this.authService.getUserFromHeader(authorization);
    if (!requestUser) {
      throw new UnauthorizedException('User not found');
    }

    return this.findFromUser(requestUser.id || '', authorization, query);
  }

  /**
   * TODO: Add pagination
   * @param user
   * @param authorization
   * @returns
   */
  @ApiParam({ name: 'user', type: String })
  @Get('/users/:user')
  @UseInterceptors(TaskListResponseInterceptor)
  @ApiOkResponse({
    description: 'The record has been successfully retrieved.',
    type: TaskListResponseDto,
  })
  async findFromUser(
    @Param('user', BigIntPipe) userId: string,
    @Headers('Authorization') authorization: string,
    @Query() range: DateRangeDto,
  ) {
    const [requestUser, user] = await Promise.all([
      this.authService.getUserFromHeader(authorization),
      this.userService.findOne(userId),
    ]);

    if (!requestUser || !user) {
      throw new UnauthorizedException('User not found');
    }

    if (!requestUser.canViewTasks(user)) {
      throw new UnauthorizedException('User cannot view tasks for this user');
    }

    const tasks = range
      ? await this.taskService.findByUserAndDate(
          userId,
          range.startDate,
          range.endDate,
        )
      : await this.taskService.findByUser(userId);

    return tasks;
  }

  @Get('/:task')
  @UseInterceptors(TaskResponseInterceptor)
  @ApiOkResponse({
    description: 'The record has been successfully retrieved.',
    type: TaskResponseDto,
  })
  async findOne(
    @Param('task', BigIntPipe) taskId: string,
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

    return task;
  }

  @Post('/')
  @UseInterceptors(TaskResponseInterceptor)
  async create(
    @Body() taskCreateDTO: TaskCreateDTO,
    @Headers('Authorization') authorization: string,
  ) {
    const requestUser = await this.authService.getUserFromHeader(authorization);

    if (!requestUser) {
      throw new UnauthorizedException('User not found');
    }

    taskCreateDTO.userId = requestUser.id || '';

    const task = await this.taskService.save(Task.create(taskCreateDTO));

    return task;
  }

  @ApiOkResponse({
    description: 'The record has been successfully updated.',
    type: TaskResponseDto,
  })
  @Put('/:task')
  @UseInterceptors(TaskResponseInterceptor)
  async update(
    @Param('task', BigIntPipe) taskId: string,
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

    return task;
  }

  @Delete('/:task')
  async delete(
    @Param('task', BigIntPipe) taskId: string,
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
