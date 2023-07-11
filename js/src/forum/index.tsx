import app from 'flarum/forum/app';
import Post from 'flarum/common/models/Post';
import Model from 'flarum/common/Model';
import PostMeta from 'flarum/forum/components/PostMeta';
import {extend, override} from 'flarum/common/extend';
import Discussion from 'flarum/common/models/Discussion';
import Badge from 'flarum/common/components/Badge';
import humanTime from 'flarum/common/helpers/humanTime';
import fullTime from 'flarum/common/helpers/fullTime';

app.initializers.add('matteociaroni/flarum-old-content', function(app) {
	Post.prototype.isOld = Model.attribute("isOld");
	Discussion.prototype.isOld = Model.attribute("isOld");

	override(PostMeta.prototype, "view", function() {
		//Original method: https://github.com/flarum/framework/blob/2.x/framework/core/js/src/forum/components/PostMeta.js
		//The only difference is the className of the Dropdown-toggle element

		const post = this.attrs.post;
		const time = post.createdAt();
		const permalink = this.getPermalink(post);
		const touch = 'ontouchstart' in document.documentElement;

		const selectPermalink = function (e) {
			setTimeout(() => $(this).parent().find('.PostMeta-permalink').select());

			e.redraw = false;
		};

		const oldPostClassName = this.attrs.post.isOld() ? " oldDate" : "";

		return (
			<div className="Dropdown PostMeta">
				<a className={"Dropdown-toggle" + oldPostClassName} onclick={selectPermalink} data-toggle="dropdown">
					{humanTime(time)}
				</a>

				<div className="Dropdown-menu dropdown-menu">
					<span className="PostMeta-number">{app.translator.trans('core.forum.post.number_tooltip', { number: post.number() })}</span>{' '}
					<span className="PostMeta-time">{fullTime(time)}</span> <span className="PostMeta-ip">{post.data.attributes.ipAddress}</span>
					{touch ? (
						<a className="Button PostMeta-permalink" href={permalink}>
							{permalink}
						</a>
					) : (
						<input className="FormControl PostMeta-permalink" value={permalink} onclick={(e) => e.stopPropagation()} />
					)}
				</div>
			</div>
		);
	});

	extend(Discussion.prototype, "badges", function (badges) {
		if (this.isOld()) {
			badges.add("old",
				Badge.component({
					type: "old",
					label: app.translator.trans("matteociaroni-old-content.forum.tooltip", {contentType: "discussion"}),
					icon: "fas fa-exclamation",
				})
			);
		}
	});
});
