import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ResenaSchema } from "./ResenaSchema";

@Entity('like')
export class LikeSchema {

    @PrimaryGeneratedColumn()
    likeID: number;

    @Column()
    usuarioID: string;
    
    @Column()
    resenaID: number;
    
    @ManyToOne(() => ResenaSchema, (resena) => resena.likesArray)
    @JoinColumn({ name: 'resenaID' })
    resena: ResenaSchema;
}