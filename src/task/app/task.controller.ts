import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { TaskUpdateDto } from './dto/task-update-dto';
import { TaskCreateDTO } from './dto/task-create-dto';
import { ApiBearerAuth, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { TaskResponseDto } from './dto/task-response-dto';
import { TaskListResponseDto } from './dto/task-list-response-dto';
import {
  Task,
  TaskRepositoryInterface,
} from '@faboborgeslima/task-manager-domain/task';
import { DateRangeDto } from '../../types/app/date-range-dto';
import { TaskResponseInterceptor } from './interceptors/task-response.interceptor';
import { TaskListResponseInterceptor } from './interceptors/task-list-response.interceptor';
import { Auth } from '../../auth/app/decorators/auth.decorator';
import {
  User,
  UserRepositoryInterface,
} from '@faboborgeslima/task-manager-domain/user';
import { UuidPipe } from '../../uuid/uuid.pipe';

@Controller('tasks')
@ApiBearerAuth()
export class TaskController {
  public constructor(
    @Inject(TaskRepositoryInterface)
    private readonly taskRepository: TaskRepositoryInterface,
    @Inject(UserRepositoryInterface)
    private readonly userRepository: UserRepositoryInterface,
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
    @Auth() requestUser: User,
    @Query() query: DateRangeDto,
  ) {
    return this.findFromUser(requestUser.id || '', requestUser, query);
  }

  /**
   * TODO: Add pagination
   * @param user
   * @param requestUser
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
    @Param('user', UuidPipe) userId: string,
    @Auth() requestUser: User,
    @Query() range: DateRangeDto,
  ) {
    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!requestUser.canViewTasks(user)) {
      throw new UnauthorizedException('User cannot view tasks for this user');
    }

    const tasks = range
      ? await this.taskRepository.findByUserAndDate(
          userId,
          range.startDate,
          range.endDate,
        )
      : await this.taskRepository.findByUser(userId);

    return tasks;
  }

  @Get('/:task')
  @UseInterceptors(TaskResponseInterceptor)
  @ApiOkResponse({
    description: 'The record has been successfully retrieved.',
    type: TaskResponseDto,
  })
  async findOne(
    @Param('task', UuidPipe) taskId: string,
    @Auth() requestUser: User,
  ) {
    const [task] = await Promise.all([this.taskRepository.findById(taskId)]);

    if (!task) {
      throw new NotFoundException('Task not found');
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
    @Auth() requestUser: User,
  ) {
    taskCreateDTO.userId = requestUser.id || '';

    const task = await this.taskRepository.save(Task.make(taskCreateDTO));

    return task;
  }

  @ApiOkResponse({
    description: 'The record has been successfully updated.',
    type: TaskResponseDto,
  })
  @Put('/:task')
  @UseInterceptors(TaskResponseInterceptor)
  async update(
    @Param('task', UuidPipe) taskId: string,
    @Body() taskUpdateDTO: TaskUpdateDto,
    @Auth() requestUser: User,
  ) {
    let task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (!task.canBeUpdated(requestUser)) {
      throw new UnauthorizedException('User cannot edit this task');
    }

    task.update(taskUpdateDTO);

    task = await this.taskRepository.save(task);

    return task;
  }

  @Delete('/:task')
  async delete(
    @Param('task', UuidPipe) taskId: string,
    @Auth() authorization: User,
  ) {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (!task.canBeDeleted(authorization)) {
      throw new UnauthorizedException('User cannot delete this task');
    }

    return await this.taskRepository.delete(taskId);
  }
}
