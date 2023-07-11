<?php

/*
 * This file is part of matteociaroni/flarum-old-content.
 *
 * Copyright (c) 2023 Matteo Ciaroni.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace MatteoCiaroni\OldContent;

use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Api\Serializer\PostSerializer;
use Flarum\Discussion\Discussion;
use Flarum\Extend;
use Flarum\Post\Post;

function isOldPost(Post $post): bool
{
    $limitInDays = resolve("flarum.settings")->get("matteociaroni-old-content.time");
    $creationIsOld = $post->created_at->addDays($limitInDays)->isPast();
    $lastEditIsOld = $post->edited_at == null || $post->edited_at->addDays($limitInDays)->isPast();

    return $creationIsOld && $lastEditIsOld;
}

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js'),

    new Extend\Locales(__DIR__ . '/locale'),

    (new Extend\ApiSerializer(PostSerializer::class))
        ->attributes(function (PostSerializer $serializer, Post $post, array $attributes) {
            $attributes["isOld"] = isOldPost($post);
            return $attributes;
        }),

    (new Extend\ApiSerializer(DiscussionSerializer::class))
        ->attributes(function (DiscussionSerializer $serializer, Discussion $discussion, array $attributes) {
            $attributes["isOld"] = isOldPost($discussion->lastPost) && isOldPost($discussion->firstPost);
            return $attributes;
        }),

    (new Extend\Settings())
        ->default("matteociaroni-old-content.time", 365),
];
