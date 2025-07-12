import { Member } from '../models/member.model';
import { Role } from '../enums/role.enum';
import { Category } from '../enums/category.enum';
import { Status } from '../enums/status.enum';

export const MEMBERS: Member[] = [
  {
    id: 1,
    name: 'John Doe',
    role: Role.FRONTEND_DEVELOPER,
    description:
      'Frontend Developer specializing in React, TypeScript, and Angular, with 5+ years of experience building scalable web applications.',
    avatar:
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    specialties: ['React', 'TypeScript', 'Angular'],
    category: Category.SOFTWARE,
    status: Status.CONTACTED,
  },
  {
    id: 2,
    name: 'Jane Smith',
    role: Role.UX_DESIGNER,
    description:
      'UX Designer specializing in UI/UX, Figma, and design systems, with experience creating user-focused interfaces.',
    avatar:
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    specialties: ['UI/UX', 'Figma', 'Design Systems'],
    category: Category.DESIGN,
    status: Status.NOT_CONTACTED,
  },
  {
    id: 3,
    name: 'Alice Johnson',
    role: Role.BACKEND_DEVELOPER,
    description:
      'Backend Developer with expertise in Node.js, Express, and MongoDB, focusing on building robust server-side applications.',
    avatar:
      'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
    specialties: ['Node.js', 'Express', 'MongoDB'],
    category: Category.SOFTWARE,
    status: Status.NOT_CONTACTED,
  },
  {
    id: 4,
    name: 'Bob Brown',
    role: Role.PRODUCT_MANAGER,
    description:
      'Project Manager with a focus on Agile methodologies, team leadership, and project delivery.',
    avatar:
      'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150',
    specialties: ['Agile', 'Team Leadership', 'Project Delivery'],
    category: Category.SOFTWARE,
    status: Status.NOT_CONTACTED,
  },
  // Add more members as needed
  {
    id: 5,
    name: 'Charlie Davis',
    role: Role.DATA_SCIENTIST,
    description:
      'Data Scientist with expertise in machine learning, data analysis, and statistical modeling.',
    avatar:
      'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150',
    specialties: ['Machine Learning', 'Data Analysis', 'Statistical Modeling'],
    category: Category.SOFTWARE,
    status: Status.CONTACTED,
  },
  {
    id: 6,
    name: 'Davi Wilson',
    role: Role.DEVOPS_ENGINEER,
    description:
      'DevOps Engineer specializing in CI/CD, containerization, and cloud infrastructure.',
    avatar:
      'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
    specialties: ['CI/CD', 'Containerization', 'Cloud Infrastructure'],
    category: Category.SOFTWARE,
    status: Status.NOT_CONTACTED,
  },
];
