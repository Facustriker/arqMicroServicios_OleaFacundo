import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ResenaSchema } from "./ResenaSchema";


@Entity('like')
export class LikeSchema{

    @PrimaryGeneratedColumn()
    likeID: number;

    @Column()
    usuarioID: number;

    @Column()
    resenaID: number;
    
    @ManyToOne(() => ResenaSchema, (resena) => resena.likesArray)
    @JoinColumn({ name: 'resenaID' })
    resena: ResenaSchema;
}