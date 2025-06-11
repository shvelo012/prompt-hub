import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../utils/db';

export interface PromptAttributes {
  id?: string;
  title: string;
  template: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Prompt extends Model<PromptAttributes> implements PromptAttributes {
  public id!: string;
  public title!: string;
  public template!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Prompt.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    title: { type: DataTypes.STRING, allowNull: false },
    template: { type: DataTypes.TEXT, allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, modelName: 'Prompt' }
);
