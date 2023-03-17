// import { Vec } from '@polkadot/types'
// import { AnyTuple, CallBase } from '@polkadot/types/types'

// import { addDataToHistoryElement, getOrCreateHistoryElement, updateHistoryElementStats } from '../../utils/history'
// import { formatU128ToBalance } from '../../utils/assets'
// import { poolsStorage } from '../../utils/pools'
// import { Block, CallEntity, Context } from '../../processor'

// function formatSpecificCalls(call: CallBase<AnyTuple>): Object {
//     const { args } = call
//     switch (call.method) {
//         case 'depositLiquidity': {
//             const [dex_id, input_asset_a, input_asset_b, input_a_desired, input_b_desired, input_a_min, input_b_min] = args
//             // TODO move args to common function here and in other cases
//             return { args: {
//                 dex_id: dex_id, // .toHuman(),
//                 input_asset_a: getAssetId(input_asset_a),
//                 input_asset_b: getAssetId(input_asset_b),
//                 input_a_min: formatU128ToBalance(input_a_min.toString(), getAssetId(input_asset_a)),
//                 input_b_min: formatU128ToBalance(input_b_min.toString(), getAssetId(input_asset_b)),
//                 input_a_desired: formatU128ToBalance(input_a_desired.toString(), getAssetId(input_asset_a)),
//                 input_b_desired: formatU128ToBalance(input_b_desired.toString(), getAssetId(input_asset_b))
//                 }
//             }
//         }
//         case 'initializePool': {
//             const [dex_id, asset_a, asset_b] = args
//             return { args: {
//                 dex_id: dex_id, // .toHuman(),
//                 asset_a: getAssetId(asset_a),
//                 asset_b: getAssetId(asset_b),
//                 }
//             }
//         }
//         case 'register': {
//             const [dex_id, base_asset_id, target_asset_id] = args
//             return  { args: {
//                 dex_id: dex_id, // .toHuman(),
//                 base_asset_id: getAssetId(base_asset_id),
//                 target_asset_id: getAssetId(target_asset_id),
//                 }
//             }
//         }
//         default: {
//             return call.toJSON()
//         }
//     }
// }

// function extractCalls(
//     call: CallBase<AnyTuple>,
//     id: number,
//     parentCallId: string,
//     entities: Object[]
// ): Object[] {

//     let entity = new Object()

//     entity = {
//         callId: `${parentCallId}-${id}`,
//         method: call.method,
//         module: call.section,
//         hash: call.hash,
//         data: formatSpecificCalls(call)
//     }

//     entities.push(entity)

//     return entities

// }

// export async function batchTransactionsHandler(ctx: Context, block: Block, callEntity: CallEntity): Promise<void> {

//     if (callEntity.name !== 'Utility.batch_all') return

//     ctx.log.debug('Caught batch transaction extrinsic')

//     // TODO: remove any type
//     const calls = (callEntity.extrinsic as any).method.args[0] as Vec<CallBase<AnyTuple>>
//     const entities = [] as Object[]

//     const historyElement = await getOrCreateHistoryElement(ctx, block, callEntity)

//     if (!historyElement) return

//     entities.concat(
//         calls.map((call, idx) => extractCalls(call, idx, historyElement.blockHeight.toString(), entities))
//     )

//     await addDataToHistoryElement(ctx, historyElement, entities)
//     await updateHistoryElementStats(ctx, historyElement)

//     ctx.log.debug(`===== Saved batch extrinsic with ${historyElement.id.toString()} txid =====`)

//     if (historyElement.execution.success) {
//         // If initialize pool call exists, create new Pool
//         const initializePool: any = entities.find((entity: any) => entity.method === 'initializePool')

//         if (initializePool) {
//             await poolsStorage.getPool(ctx, initializePool.data.args.asset_a, initializePool.data.args.asset_b)
//         }
//     }
// }