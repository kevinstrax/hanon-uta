// src/directives/dropdown.ts
import type { Directive } from 'vue'
import { Dropdown } from "bootstrap";

type DropdownElement = HTMLElement & {
    _dropdown?: Dropdown | null
}

const dropdownDirective: Directive<DropdownElement, string> = {
    mounted(el) {
        let dropdown = new Dropdown(el);
        el._dropdown = dropdown

        el.addEventListener('click', (event) => {
            // Prevent the default behavior because we control it manually
            event.preventDefault()
            // Gets the current expansion status
            // Toggle the state
            if (el.getAttribute('aria-expanded') === 'true') {
                dropdown.hide()
            } else {
                dropdown.show()
            }
        })
    },
    unmounted(el) {
        if (el._dropdown) {
            el._dropdown.dispose()
            el._dropdown = null
        }
    }
}

export default dropdownDirective