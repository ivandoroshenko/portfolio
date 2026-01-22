/**
 * Component Loader
 * Loads HTML components and injects them into the DOM
 */

class ComponentLoader {
    constructor(basePath = 'components/') {
        this.basePath = basePath;
        this.cache = {};
    }

    /**
     * Load a single component
     * @param {string} name - Component name (without .html)
     * @returns {Promise<string>} HTML content
     */
    async load(name) {
        if (this.cache[name]) {
            return this.cache[name];
        }

        try {
            const response = await fetch(`${this.basePath}${name}.html`);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${name}`);
            }
            const html = await response.text();
            this.cache[name] = html;
            return html;
        } catch (error) {
            console.error(error);
            return '';
        }
    }

    /**
     * Load and inject a component into an element
     * @param {string} name - Component name
     * @param {string|Element} selector - CSS selector or Element
     * @param {boolean} replace - Replace element (true) or insert as child (false)
     */
    async inject(name, selector, replace = false) {
        const html = await this.load(name);
        const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
        
        if (!element) {
            console.warn(`Element not found: ${selector}`);
            return;
        }

        if (replace) {
            element.outerHTML = html;
        } else {
            element.innerHTML = html;
        }
    }

    /**
     * Load and inject multiple components
     * @param {Array<{name: string, selector: string, replace?: boolean}>} components
     */
    async injectMultiple(components) {
        await Promise.all(
            components.map(comp => 
                this.inject(comp.name, comp.selector, comp.replace || false)
            )
        );
    }
}

// Create global instance
window.ComponentLoader = new ComponentLoader('components/');
