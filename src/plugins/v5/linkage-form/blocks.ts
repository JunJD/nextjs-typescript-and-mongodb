import { Editor, PluginOptions } from "grapesjs";
import { BaseLoadBlocks } from "../common/base";
import { LINKAGE_FORM_TYPES, PRESETS } from "./constants";

export class LinkageFormBlocks extends BaseLoadBlocks {
    constructor(editor: Editor, options: PluginOptions) {
        super(editor, options);
    }

    load() {
        const blockManager = this.editor.Blocks;

        // 添加数字输入block
        blockManager.add('number-input', {
            label: '数量输入',
            category: '表单组件',
            content: {
                type: LINKAGE_FORM_TYPES['input-group'],
                label: PRESETS.number.label,
                suffix: PRESETS.number.suffix,
                'input-type': PRESETS.number.type
            },
            attributes: { class: 'fa fa-plus-square' }
        });

        // 添加金额输入block
        blockManager.add('amount-input', {
            label: '金额输入',
            category: '表单组件',
            content: {
                type: LINKAGE_FORM_TYPES['input-group'],
                label: PRESETS.amount.label,
                suffix: PRESETS.amount.suffix,
                'input-type': PRESETS.amount.type
            },
            attributes: { class: 'fa fa-money' }
        });

        // 添加姓名输入block
        blockManager.add('name-input', {
            label: '姓名输入',
            category: '表单组件',
            content: {
                type: LINKAGE_FORM_TYPES['input-group'],
                label: PRESETS.name.label,
                suffix: PRESETS.name.suffix,
                'input-type': PRESETS.name.type
            },
            attributes: { class: 'fa fa-user' }
        });
    }
} 