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
		$markdown = Context::get('markdown');
		$this->add('parsedMarkdown', $markdown);
	}

	function getPopupContent()
	{
		$tpl_path = "$this->component_path/tpl/";
		$tpl_file = 'popup.html';
		$oTemplate = &TemplateHandler::getInstance();
		return $oTemplate->compile($tpl_path, $tpl_file);
	}
}