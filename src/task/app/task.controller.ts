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
import { TaskResponseInterceptor } from './interceptors/task-response.interceptor';
import { TaskListResponseInterceptor } from './interceptors/task-list-response.interceptor';
import { Auth } from '../../auth/app/decorators/auth.decorator';
import {
  User,
  UserRepositoryInterface,
} from '@faboborgeslima/task-manager-domain/user';
import { UuidPipe } from '../../uuid/uuid.pipe';
import { BigIntPipe } from '../../big-int/big-int.pipe';
import { TaskService } from './task.service';
import { OptionalDateRangePaginatedDto } from './dto/optional-date-range-paginated';

@Controller('tasks')
@ApiBearerAuth()
export class TaskController {
  public constructor(
    private readonly taskService: TaskService,
    @Inject(UserRepositoryInterface)
    private readonly userRepository: UserRepositoryInterface,
    @Inject(TaskRepositoryInterface)
    private readonly taskRepository: TaskRepositoryInterface,
  ) {
    // Constructor logic if needed
  }

  @Get('/')
  @UseInterceptors(TaskListResponseInterceptor)
  @ApiOkResponse({
    description: 'The record has been successfully retrieved.',
    type: TaskListResponseDto,
  })
  async findFromCurrentUser(
    @Auth() requestUser: User,
    @Query() query: OptionalDateRangePaginatedDto,
  ) {
    if (query.startDate && query.endDate) {
      return this.taskService.findByUserAndDate(
        requestUser,
        requestUser,
        query.startDate,
        query.endDate,
        query.size,
        query.page,
      );
    }

    return this.taskService.findByUser(
      requestUser,
      requestUser,
      query.size,
      query.page,
    );
  }

  @ApiParam({ name: 'user', type: String })
  @Get('/users/:user')
  @UseInterceptors(TaskListResponseInterceptor)
  @ApiOkResponse({
    description: 'The record has been successfully retrieved.',
    type: TaskListResponseDto,
  })
  async findFromUser(
    @Param('user', BigIntPipe) userId: string,
    @Auth() requestUser: User,
    @Query() query: OptionalDateRangePaginatedDto,
  ) {
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (query.startDate && query.endDate) {
      return this.taskService.findByUserAndDate(
        user,
        requestUser,
        query.startDate,
        query.endDate,
        query.size,
        query.page,
      );
    }

    return this.taskService.findByUser(
      user,
      requestUser,
      query.size,
      query.page,
    );
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
    const task = await this.taskService.findById(requestUser, taskId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  @Post('/')
  @UseInterceptors(TaskResponseInterceptor)
  async create(
    @Body() taskCreateDTO: TaskCreateDTO,
    @Auth() requestUser: User,
  ) {
    if (!taskCreateDTO.userId) {
      if (!requestUser.id) {
        throw new UnauthorizedException('User does not have an ID');
      }
      taskCreateDTO.userId = requestUser.id;
    }
    return this.taskService.save(requestUser, Task.make(taskCreateDTO));
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

    task.update(taskUpdateDTO);

    task = await this.taskService.save(requestUser, task);

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

    return this.taskService.delete(authorization, task);
  }
}
