<?php

class markdown extends EditorHandler
{
	var $editor_sequence = '0';
	var $component_path = '';

	function markdown($editor_sequence, $component_path)
	{
		$this->editor_sequence = $editor_sequence;
		$this->component_path = $component_path;
		Context::loadLang($component_path.'lang');
	}

	function parseMarkdown()
	{
		require_once "$this->component_path/Parsedown.php";

		$parsedown = new Parsedown();
		$markdown = Context::get('markdown');
		$parsedMarkdown = $parsedown->text($markdown);
		$this->add('parsedMarkdown', $this->wrapParsedMarkdown($parsedMarkdown, $markdown));
	}

	function wrapParsedMarkdown($parsedMarkdown, $markdown)
	{
		$wrappedMarkdown = '<span class="original" style="display: none">'.$markdown.'</span>';
		$wrappedParsedMarkdown = '<div editor_component="markdown">'.$parsedMarkdown.$wrappedMarkdown.'</div>';
		return $wrappedParsedMarkdown;
	}

	function getPopupContent()
	{
		$tpl_path = "$this->component_path/tpl/";
		$tpl_file = 'popup.html';
		$oTemplate = &TemplateHandler::getInstance();
		return $oTemplate->compile($tpl_path, $tpl_file);
	}
}