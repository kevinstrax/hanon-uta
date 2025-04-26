// src/utils/useTooltip.ts
import { Tooltip } from 'bootstrap'
import type { DirectiveBinding, ObjectDirective } from 'vue'

// Extend the HTMLElement type to include the _tooltip attribute
declare module '@vue/runtime-dom' {
    interface HTMLAttributes {
        _tooltip?: Tooltip | null
    }
}

type TooltipElement = HTMLElement & {
    _tooltip?: Tooltip | null
}

export function useTooltip() {
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
            if (binding.oldValue !== binding.value) {
                destroyTooltip(el)
                initTooltip(el, binding)
            }
        },
        unmounted(el) {
            destroyTooltip(el)
        }
    }

    return {
        tooltipDirective
    }
}