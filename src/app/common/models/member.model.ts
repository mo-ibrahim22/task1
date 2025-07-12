import { Role } from '../enums/role.enum';
import { Category } from '../enums/category.enum';
import { Status } from '../enums/status.enum';

export interface Member {
  id: number;
  name: string;
  role: Role;
  description: string;
  avatar?: string;
  specialties?: string[];
  category: Category;
  status: Status;
}
