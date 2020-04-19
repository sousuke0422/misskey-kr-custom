import { IRemoteUser, isLocalUser } from '../../../../models/user';
import reject from '../../../../services/following/requests/reject';
import { IFollow } from '../../type';
import ApResolver from '../../ap-resolver';

export default async (actor: IRemoteUser, activity: IFollow): Promise<string> => {
	// ※ activityはこっちから投げたフォローリクエストなので、activity.actorは存在するローカルユーザーである必要がある

	const apResolver = new ApResolver();
	const follower = await apResolver.getUserFromApId(activity.actor);

	if (follower == null) {
		return `skip: follower not found`;
	}

	if (!isLocalUser(follower)) {
		return `skip: follower is not a local user`;
	}

	await reject(actor, follower);
	return `ok`;
};
