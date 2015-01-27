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

	var wrappedMarkdown = '<pre>'+markdown+'</pre>'

	var iframe_obj = opener.editorGetIFrame(opener.editorPrevSrl);
	var prevNode = opener.editorPrevNode;

	if(prevNode && prevNode.nodeName == 'DIV' && prevNode.getAttribute('editor_component') != null) {
		prevNode.innerHTML = wrappedMarkdown;
		debugPrint('innerHTML');
	}
	else {
		wrappedMarkdown = '<div editor_component="markdown" style="border:#000 1px dotted; padding: 10px">'+wrappedMarkdown+'</div>';
		opener.editorReplaceHTML(iframe_obj, wrappedMarkdown);
		debugPrint('editorReplaceHTML');
	}
	opener.editorFocus(opener.editorPrevSrl);
	window.close();
}

function previewMarkdown()
{
	var form = jQuery('#markdown');
	var markdown = form.find('textarea[name=markdown]').val();

	var argument = {
		'component': 'markdown',
		'method': 'parseMarkdown',
		'markdown' : markdown
	};
	jQuery.exec_json('editor.procEditorCall', argument, function(ret_obj) {
		var parsedMarkdown = ret_obj['parsedMarkdown'];
		var preview = jQuery('#preview');
		preview.html(parsedMarkdown);
	});
}

function getMarkdown()
{
	debugPrint('>>> getMarkdown()');
	if(typeof(opener) == "undefined") return;

	var node = opener.editorPrevNode;
	var form = jQuery('#markdown');

	if(!node || node.nodeName != 'DIV')
	{
		var code = opener.editorGetSelectedHtml(opener.editorPrevSrl);
		code = jQuery('<textarea />').html(code).text();	//특수문자 치환
		form.find('textarea[name=markdown]').val(code);
		return;
	}

	var markdown = jQuery(opener.editorPrevNode).find('pre').text();

	var form = jQuery('#markdown');
	form.find('textarea[name=markdown]').val(markdown);
}