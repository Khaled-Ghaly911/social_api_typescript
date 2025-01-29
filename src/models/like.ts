import { Table, Column, DataType, ForeignKey, Model, BelongsTo } from "sequelize-typescript";
import { Post } from "./post";
import { User } from "./user";

@Table({ tableName: 'likes' })
export class Like extends Model {
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
    id!: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId!: number;

    
    @ForeignKey(() => Post)
    @Column({ type: DataType.INTEGER })
    postId!: number;
    
    @BelongsTo(() => User)
    user!: User;
    
    @BelongsTo(() => Post)
    post!: Post;
}