import { Table, Column, Model, DataType, AutoIncrement, PrimaryKey, AllowNull, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Post } from './post';
import { User } from './user' 

@Table({ tableName: 'comments' })
export class Comment extends Model {
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
    id!: number;

    @Column({ type: DataType.STRING, allowNull: false })
    author!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    content!: string;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    fromGuest!: boolean;

    @ForeignKey(() => Post)
    @Column({ type: DataType.INTEGER })
    postId!: number;

    @BelongsTo(() => Post)
    post!: Post;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId!: number;

    @BelongsTo(() => User)
    user!: User;
}
