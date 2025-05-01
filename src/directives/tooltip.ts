// src/directives/tooltip.ts
import { Tooltip } from 'bootstrap'
import type { DirectiveBinding, ObjectDirective } from 'vue'

// Extend the HTMLElement type to include the _tooltip attribute
type TooltipElement = HTMLElement & {
    _tooltip?: Tooltip | null
}

const initTooltip = (el: TooltipElement, binding: DirectiveBinding) => {
    el._tooltip = new Tooltip(el, {
        title: binding.value,
        trigger: 'hover'
    })
}

const destroyTooltip = (el: TooltipElement) => {
    if (el._tooltip) {
        el._tooltip.dispose()
        el._tooltip = null
    }
}

const tooltipDirective: ObjectDirective<TooltipElement> = {
    beforeMount(el) {
        el._tooltip = null
    },
    mounted(el, binding) {
        initTooltip(el, binding)
    },
    updated(el, binding) {
        if (binding.oldValue === binding.value) {
            return;
        }
        const tooltip = el._tooltip as Tooltip;
        if (!tooltip) {
            initTooltip(el, binding);
        } else {
            tooltip.setContent({'.tooltip-inner': binding.value});
        }
    },
    unmounted(el) {
        destroyTooltip(el)
    }
}

export default tooltipDirective;
