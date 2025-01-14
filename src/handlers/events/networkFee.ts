import { networkSnapshotsStorage } from '../../utils/network'
import { AssetAmount, Block, Context, EventItem } from '../../types'
import { XorFeeFeeWithdrawnEvent } from '../../types/generated/events'
import { getEntityData } from '../../utils/entities'

export async function networkFeeEventHandler(ctx: Context, block: Block, eventItem: EventItem<'XorFee.FeeWithdrawn'>): Promise<void> {
  	const event = new XorFeeFeeWithdrawnEvent(ctx, eventItem.event)
	const data = getEntityData(ctx, block, event, eventItem)

  	const fee = data[1] as AssetAmount

  	await networkSnapshotsStorage.updateFeesStats(ctx, block, fee)
}