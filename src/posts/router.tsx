import type { Context } from '@devvit/public-api';
import { Devvit, useState } from '@devvit/public-api';

import { Service } from '../service/Service.js';
import { PinnedPost } from './PinnedPost/PinnedPost.js';
import { PostType, PostId, PinnedPostData, GameSettings, UserData } from '../types.js';

export const Router: Devvit.CustomPostComponent = (context: Context) => {
    const postId = context.postId as PostId;
    const service = new Service(context);

    // Get the username for the userId
    const getUsername = async () => {
        if (!context.userId) return null; // Return early if no userId
        const cacheKey = 'cache:userId-username';
        const cache = await context.redis.hGet(cacheKey, context.userId);
        if (cache) {
            return cache;
        } else {
            const user = await context.reddit.getUserById(context.userId);
            if (user) {
                await context.redis.hSet(cacheKey, {
                    [context.userId]: user.username,
                });
                return user.username;
            }
        }
        return null;
    };

    // Function to get post data, only for PINNED type
    function getPostData(postType: PostType, postId: PostId): Promise<PinnedPostData> {
        if (postType === PostType.PINNED) {
            return service.getPinnedPost(postId); // Only fetch for PINNED
        }
        return Promise.reject(new Error('Unknown post type')); // Reject any other type
    }

    const [data] = useState<{
        gameSettings: GameSettings;
        postData: PinnedPostData;
        postType: PostType;
        userData: UserData | null;
        username: string | null;
    }>(async () => {
        const [postType, username] = await Promise.all([service.getPostType(postId), getUsername()]);
        
        // Check if the post type is PINNED
        if (postType === PostType.PINNED) {
            const [postData, gameSettings, userData] = await Promise.all([
                getPostData(postType, postId),
                service.getGameSettings(),
                service.getUser(username, postId),
            ]);
            return { gameSettings, postData, postType, userData, username };
        } else {
            // If it's not PINNED, return an empty state (you can adjust this if needed)
            return { gameSettings: {} as GameSettings, postData: {} as PinnedPostData, postType: PostType.PINNED, userData: null, username: null };
        }
    });

    // Only map the PINNED post type to a component
    const postTypes: Record<string, JSX.Element> = {
        pinned: (
            <PinnedPost
                postData={data.postData}
                userData={data.userData}
                username={data.username}
                gameSettings={data.gameSettings}
            />
        ),
    };

    return (
        <zstack width="100%" height="100%" alignment="top start">
            <image
                imageHeight={1024}
                imageWidth={2048}
                height="100%"
                width="100%"
                url="background1.png"
                description="background1"
                resizeMode="cover"
            />
            {postTypes[data.postType] || (
                <vstack alignment="center middle" grow>
                    <text>Error: Unknown post type</text>
                </vstack>
            )}
        </zstack>
    );
};
