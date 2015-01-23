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

function previewMarkdown()
{
	debugPrint('>>> previewMarkdown()');
	if(typeof(opener) == "undefined") return;

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
		preview.find('div[name=preview]').html(parsedMarkdown);
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

	var markdown = jQuery(opener.editorPrevNode).find('span[class=original]').text();
	markdown = base64_decode(markdown);

	var form = jQuery('#markdown');
	form.find('textarea[name=markdown]').val(markdown);
}

function base64_decode(data) {
	//  discuss at: http://phpjs.org/functions/base64_decode/
	// original by: Tyler Akins (http://rumkin.com)
	// improved by: Thunder.m
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	//    input by: Aman Gupta
	//    input by: Brett Zamir (http://brett-zamir.me)
	// bugfixed by: Onno Marsman
	// bugfixed by: Pellentesque Malesuada
	// bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	//   example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
	//   returns 1: 'Kevin van Zonneveld'
	//   example 2: base64_decode('YQ===');
	//   returns 2: 'a'
	//   example 3: base64_decode('4pyTIMOgIGxhIG1vZGU=');
	//   returns 3: '✓ à la mode'

	var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
		ac = 0,
		dec = '',
		tmp_arr = [];

	if (!data) {
		return data;
	}

	data += '';

	do {
		// unpack four hexets into three octets using index points in b64
		h1 = b64.indexOf(data.charAt(i++));
		h2 = b64.indexOf(data.charAt(i++));
		h3 = b64.indexOf(data.charAt(i++));
		h4 = b64.indexOf(data.charAt(i++));

		bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

		o1 = bits >> 16 & 0xff;
		o2 = bits >> 8 & 0xff;
		o3 = bits & 0xff;

		if (h3 == 64) {
			tmp_arr[ac++] = String.fromCharCode(o1);
		} else if (h4 == 64) {
			tmp_arr[ac++] = String.fromCharCode(o1, o2);
		} else {
			tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
		}
	} while (i < data.length);

	dec = tmp_arr.join('');

	return decodeURIComponent(escape(dec.replace(/\0+$/, '')));
}