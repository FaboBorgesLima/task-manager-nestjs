import { DataSource, DataSourceOptions } from 'typeorm';
import Options from './options';

export default new DataSource(Options as DataSourceOptions);
