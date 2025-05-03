import { TypeOrmModule } from '@nestjs/typeorm';
import Options from './options';

export default (() => {
  return TypeOrmModule.forRoot(Options);
})();
