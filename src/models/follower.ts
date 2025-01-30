// src/models/Follower.ts
import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user';

@Table({ tableName: 'followers' })
export class Follower extends Model<Follower> {
  @ForeignKey(() => User)
  @Column
  followerId: number; 

  @ForeignKey(() => User)
  @Column
  followingId: number; 

  @BelongsTo(() => User, { foreignKey: 'followerId', as: 'follower' })
  follower: User;

  @BelongsTo(() => User, { foreignKey: 'followingId', as: 'following' })
  following: User;
}