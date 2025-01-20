import { Table, Column, Model, DataType, BelongsTo, ForeignKey, HasMany } from 'sequelize-typescript';
import { User } from './user';
import { Comment } from './comment';
import { Like } from './like'

@Table({ tableName: 'posts' })
export class Post extends Model {
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
    id!: number;

    @Column({ type: DataType.STRING, allowNull: false })
    title!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    content!: string;

    @Column({ type: DataType.STRING, allowNull: true })
    author!: string;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    isPublic!: boolean;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId!: number;

    @BelongsTo(() => User)
    user!: User;

    @HasMany(() => Comment)
    comments!: Comment[];

    @HasMany(() => Like)
    likes!: Like[];
}