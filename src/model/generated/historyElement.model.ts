import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {ExecutionResult} from "./_executionResult"

@Entity_()
export class HistoryElement {
    constructor(props?: Partial<HistoryElement>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    blockHeight!: bigint

    @Index_()
    @Column_("text", {nullable: false})
    blockHash!: string

    @Column_("text", {nullable: false})
    module!: string

    @Column_("text", {nullable: false})
    method!: string

    @Index_()
    @Column_("text", {nullable: false})
    address!: string

    @Column_("text", {nullable: false})
    networkFee!: string

    @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => obj == null ? undefined : new ExecutionResult(undefined, obj)}, nullable: false})
    execution!: ExecutionResult

    @Column_("int4", {nullable: false})
    timestamp!: number

    @Column_("jsonb", {nullable: true})
    data!: unknown | undefined | null
}
