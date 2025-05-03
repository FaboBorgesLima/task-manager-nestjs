import { JwtModule } from '@nestjs/jwt';

export const JwtConfigModule = JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '10d' },
});
