function debugPrint(msg)
{
	if(typeof console == 'object' && typeof console.log == 'function')
	{
		console.log(msg);
	}
}

function insertMarkdown()
{
	debugPrint('>>> insertMarkdown()');
	if(typeof(opener) == "undefined") return;

	var form = jQuery('#markdown');
	var markdown = form.find('textarea[name=markdown]').val();

	var argument = {
		'component': 'markdown',
		'method': 'parseMarkdown',
		'markdown' : markdown
	};
	var response_tags = new Array('error','message','results');
	jQuery.exec_json('editor.procEditorCall', argument, function(ret_obj) {
		var parsedMarkdown = ret_obj['parsedMarkdown'];

		var iframe_obj = opener.editorGetIFrame(opener.editorPrevSrl);
		var prevNode = opener.editorPrevNode;

		if(prevNode && prevNode.nodeName == 'DIV' && prevNode.getAttribute('editor_component') != null) {
			prevNode.innerHTML = parsedMarkdown;
			debugPrint('innerHTML');
		}
		else {
			opener.editorReplaceHTML(iframe_obj, parsedMarkdown);
			debugPrint('editorReplaceHTML');
		}
		opener.editorFocus(opener.editorPrevSrl);
		window.close();
	});
}

function getMarkdown()
{
	debugPrint('>>> getMarkdown()');
	if(typeof(opener) == "undefined") return;

	var markdown = jQuery(opener.editorPrevNode).find('span[class=original]').text();

	var form = jQuery('#markdown');
	form.find('textarea[name=markdown]').val(markdown);
}