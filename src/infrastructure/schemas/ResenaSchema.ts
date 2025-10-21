import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { LikeSchema } from './LikeSchema';

@Entity('resena')
export class ResenaSchema {
  
  @PrimaryGeneratedColumn()
  resenaID: number;

  @Column()
  usuarioID: number;

  @Column()
  productoID: number;

  @Column({ type: 'text', nullable: true })
  resena: string;

  @Column({ default: 0 })
  rating: number;

  @Column({ type: 'datetime' })
  fhCreacion: Date;

  @Column({ type: 'datetime', nullable: true })
  fhResena: Date;

  @Column({ default: 'Vacia' })
  estadoResena: string;

  @Column({ default: 0 })
  likes: number;

  @OneToMany(() => LikeSchema, (like) => like.resena)
  likesArray: LikeSchema[];
}