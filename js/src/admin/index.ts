import app from 'flarum/admin/app';

app.initializers.add('matteociaroni/flarum-old-content', () => {
	app.extensionData.for('matteociaroni-old-content')
		.registerSetting({
			setting: 'matteociaroni-old-content.time',
			label: app.translator.trans('matteociaroni-old-content.admin.time_label'),
			type: 'number',
		})
});
