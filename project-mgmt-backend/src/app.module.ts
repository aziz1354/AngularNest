import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
   TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',                  
      password: '',     
      database: 'nestjs_angular_app',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,                   
    }),
    UsersModule,
    ProjectsModule,
    TasksModule,
    CommentsModule,
    AuthModule,
  ],
})
export class AppModule {}
