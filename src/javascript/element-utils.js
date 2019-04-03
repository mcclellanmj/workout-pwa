export function text(textContent) {
    return document.createTextNode(textContent);
}

export function element(tag, attributes = {}, ...children) {
    const newElement = document.createElement(tag);

    for(const [key, value] of Object.entries(attributes)) {
        newElement.setAttribute(key, value);
    }

    for(const child of children) {
        newElement.append(child);
    }

    return newElement;
}