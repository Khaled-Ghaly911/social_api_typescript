import { Table, Column, DataType, ForeignKey, Model, BelongsTo } from "sequelize-typescript";
import { User } from "./user";

@Table({ tableName: 'followers' })
export class Follower extends Model {
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
    id!: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    followerId!: number;

    @BelongsTo(() => User, { foreignKey: 'followerId' })
    follower!: User;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    followingId!: number;

    @BelongsTo(() => User, { foreignKey: 'followingId' })
    following!: User;
}