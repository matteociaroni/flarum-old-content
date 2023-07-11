import app from 'flarum/forum/app';
import Post from 'flarum/common/models/Post';
import Model from 'flarum/common/Model';
import PostMeta from 'flarum/forum/components/PostMeta';
import {extend} from 'flarum/common/extend';
import Discussion from 'flarum/common/models/Discussion';
import Badge from 'flarum/common/components/Badge';

app.initializers.add('matteociaroni/flarum-old-content', function(app) {
	Post.prototype.isOld = Model.attribute("isOld");
	Discussion.prototype.isOld = Model.attribute("isOld");

	extend(PostMeta.prototype, "view", function(vnode) {
		
		if(!this.attrs.post.isOld() || this.attrs.post.isHidden() || !vnode.children)
			return vnode;

		//update the element adding oldDate class
		vnode.children = vnode.children.map(child => {
			if(child.attrs.className !== "Dropdown-toggle")
				return child;

			child.attrs.className += " oldDate";
			return child;
		});

		return vnode;
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
